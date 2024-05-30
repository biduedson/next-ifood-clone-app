-- AlterTable
ALTER TABLE "Restaurant" ADD COLUMN     "ownerId" TEXT NOT NULL DEFAULT 'default_owner_id';

-- AddForeignKey
ALTER TABLE "Restaurant" ADD CONSTRAINT "Restaurant_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
