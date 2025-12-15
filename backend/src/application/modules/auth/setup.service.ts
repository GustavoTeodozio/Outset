import prisma from '../../../config/prisma';
import { hashPassword } from '../../../shared/utils/password';
import AppError from '../../../shared/errors/AppError';

export interface SetupAdminInput {
  name: string;
  email: string;
  password: string;
}

export class SetupService {
  /**
   * Verifica se já existe algum admin no sistema
   */
  async hasAdmin(): Promise<boolean> {
    const adminCount = await prisma.user.count({
      where: {
        role: 'ADMIN',
        isActive: true,
      },
    });

    return adminCount > 0;
  }

  /**
   * Obtém ou cria o tenant "Sistema" para admins
   */
  async getOrCreateSystemTenant() {
    let systemTenant = await prisma.tenant.findFirst({
      where: {
        name: 'Sistema',
        clients: null, // Sem ClientProfile (tenant de admin)
      },
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

    return systemTenant;
  }

  /**
   * Cria o primeiro admin do sistema
   * Só funciona se não houver nenhum admin existente
   */
  async setupFirstAdmin(input: SetupAdminInput) {
    // Verificar se já existe admin
    const hasAdmin = await this.hasAdmin();

    if (hasAdmin) {
      throw new AppError(
        'Já existe um administrador no sistema. Use o endpoint de login ou contate um administrador existente.',
        403
      );
    }

    // Verificar se email já está em uso
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      throw new AppError('Este email já está cadastrado', 400);
    }

    // Obter ou criar tenant "Sistema"
    const systemTenant = await this.getOrCreateSystemTenant();

    // Hash da senha
    const passwordHash = await hashPassword(input.password);

    // Criar admin
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
    };
  }

  /**
   * Inicialização automática: cria admin se não existir e variáveis de ambiente estiverem configuradas
   */
  async autoSetupAdmin() {
    try {
      // Verificar se já existe admin
      if (await this.hasAdmin()) {
        return { created: false, message: 'Admin já existe no sistema' };
      }

      // Verificar variáveis de ambiente
      const adminEmail = process.env.ADMIN_EMAIL;
      const adminPassword = process.env.ADMIN_PASSWORD;

      if (!adminEmail || !adminPassword) {
        return {
          created: false,
          message: 'Variáveis ADMIN_EMAIL e ADMIN_PASSWORD não configuradas',
        };
      }

      // Criar admin automaticamente
      const admin = await this.setupFirstAdmin({
        name: 'Administrador',
        email: adminEmail,
        password: adminPassword,
      });

      return {
        created: true,
        message: 'Admin criado automaticamente via variáveis de ambiente',
        admin: {
          email: admin.email,
          id: admin.id,
        },
      };
    } catch (error: any) {
      return {
        created: false,
        message: `Erro ao criar admin automaticamente: ${error.message}`,
        error: error.message,
      };
    }
  }
}

export default new SetupService();

