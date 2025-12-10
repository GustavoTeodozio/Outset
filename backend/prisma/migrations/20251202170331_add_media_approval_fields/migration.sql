-- AlterTable (PostgreSQL)
ALTER TABLE "MediaAsset" ADD COLUMN "approvalStatus" TEXT NOT NULL DEFAULT 'PENDING';
ALTER TABLE "MediaAsset" ADD COLUMN "approvedAt" TIMESTAMP;
ALTER TABLE "MediaAsset" ADD COLUMN "approvedById" TEXT;
ALTER TABLE "MediaAsset" ADD COLUMN "rejectionNote" TEXT;

-- AddForeignKey
ALTER TABLE "MediaAsset" ADD CONSTRAINT "MediaAsset_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- CreateIndex
CREATE INDEX "MediaAsset_approvalStatus_idx" ON "MediaAsset"("approvalStatus");
