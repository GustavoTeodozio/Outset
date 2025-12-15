import { randomUUID } from 'crypto';

import prisma from '../../../config/prisma';
import redis from '../../../config/redis';
import AppError from '../../../shared/errors/AppError';
import { hashPassword, comparePassword } from '../../../shared/utils/password';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../../../shared/utils/token';
import type { AuthContext } from '../../../shared/types/roles';

const REFRESH_TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 dias

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterClientInput {
  tenantName: string;
  businessName: string;
  segment?: string;
  contactName: string;
  contactEmail: string;
  contactPhone?: string;
  password: string;
  logoUrl?: string;
}

export interface RefreshInput {
  refreshToken: string;
}

export interface CreateAdminInput {
  name: string;
  email: string;
  password: string;
}

export class AuthService {
  async login({ email, password }: LoginInput) {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !user.isActive) {
      throw new AppError('Credenciais inválidas', 401);
    }

    const match = await comparePassword(password, user.password);

    if (!match) {
      throw new AppError('Credenciais inválidas', 401);
    }

    const session = await this.createSession(user.id, user.tenantId);
    const payload: AuthContext & { sessionId: string } = {
      userId: user.id,
      role: user.role,
      tenantId: user.tenantId ?? undefined,
      sessionId: session.id,
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await prisma.session.update({
      where: { id: session.id },
      data: { refreshToken },
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        tenantId: user.tenantId,
      },
    };
  }

  async refresh({ refreshToken }: RefreshInput) {
    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded.sessionId) {
      throw new AppError('Sessão inválida', 401);
    }

    const session = await prisma.session.findUnique({
      where: { id: decoded.sessionId },
      include: { user: true },
    });

    if (!session || session.refreshToken !== refreshToken) {
      throw new AppError('Sessão expirada', 401);
    }

    if (session.expiresAt < new Date()) {
      throw new AppError('Sessão expirada', 401);
    }

    const payload: AuthContext & { sessionId: string } = {
      userId: session.userId,
      role: session.user.role,
      tenantId: session.user.tenantId ?? undefined,
      sessionId: session.id,
    };

    const newAccessToken = signAccessToken(payload);
    const newRefreshToken = signRefreshToken(payload);

    await prisma.session.update({
      where: { id: session.id },
      data: { refreshToken: newRefreshToken, expiresAt: this.getRefreshExpiration() },
    });

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  async registerClient(input: RegisterClientInput) {
    const tenantSlug = input.tenantName.toLowerCase().replace(/\s+/g, '-');

    const existingTenant = await prisma.tenant.findFirst({
      where: { slug: tenantSlug },
    });

    if (existingTenant) {
      throw new AppError('Nome do cliente já utilizado');
    }

    const passwordHash = await hashPassword(input.password);

    const result = await prisma.$transaction(async (tx) => {
      const tenant = await tx.tenant.create({
        data: {
          name: input.tenantName,
          slug: tenantSlug,
        },
      });

      await tx.clientProfile.create({
        data: {
          tenantId: tenant.id,
          businessName: input.businessName,
          segment: input.segment,
          mainContact: input.contactName,
          mainEmail: input.contactEmail,
          mainPhone: input.contactPhone,
          logoUrl: input.logoUrl,
        },
      });

      const user = await tx.user.create({
        data: {
          name: input.contactName,
          email: input.contactEmail,
          password: passwordHash,
          role: 'CLIENT',
          tenantId: tenant.id,
        },
      });

      return { tenant, user };
    });

    const session = await this.createSession(result.user.id, result.tenant.id);
    const payload: AuthContext & { sessionId: string } = {
      userId: result.user.id,
      tenantId: result.tenant.id,
      role: 'CLIENT',
      sessionId: session.id,
    };

    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await prisma.session.update({
      where: { id: session.id },
      data: { refreshToken },
    });

    return {
      tenant: result.tenant,
      user: {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        role: result.user.role,
      },
      tokens: {
        accessToken,
        refreshToken,
      },
    };
  }

  private async createSession(userId: string, tenantId?: string | null) {
    return prisma.session.create({
      data: {
        userId,
        tenantId,
        refreshToken: randomUUID(),
        expiresAt: this.getRefreshExpiration(),
      },
    });
  }

  async createAdmin(input: CreateAdminInput) {
    // Verificar se email já existe
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      throw new AppError('Email já está em uso', 400);
    }

    // Buscar ou criar tenant "Sistema"
    let systemTenant = await prisma.tenant.findFirst({
      where: { name: 'Sistema' },
    });

    if (!systemTenant) {
      systemTenant = await prisma.tenant.create({
        data: {
          name: 'Sistema',
          slug: 'sistema',
          isActive: true,
        },
      });
    }

    // Hash da senha
    const passwordHash = await hashPassword(input.password);

    // Criar usuário admin
    const admin = await prisma.user.create({
      data: {
        name: input.name,
        email: input.email,
        password: passwordHash,
        role: 'ADMIN',
        tenantId: systemTenant.id,
        isActive: true,
      },
    });

    return {
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
      tenantId: admin.tenantId,
      createdAt: admin.createdAt,
    };
  }

  private getRefreshExpiration() {
    return new Date(Date.now() + REFRESH_TTL_MS);
  }
}

export default new AuthService();

