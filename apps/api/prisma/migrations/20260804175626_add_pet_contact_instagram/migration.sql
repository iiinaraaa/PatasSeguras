-- AlterTable
ALTER TABLE "pet_visibility_settings" ADD COLUMN     "showInstagram" BOOLEAN NOT NULL DEFAULT true,
ALTER COLUMN "showPhone" SET DEFAULT true;

-- AlterTable
ALTER TABLE "pets" ADD COLUMN     "contactInstagram" TEXT;
