-- DropForeignKey
ALTER TABLE "email_confirmation_tokens" DROP CONSTRAINT IF EXISTS "email_confirmation_tokens_userId_fkey";

-- DropTable
DROP TABLE "email_confirmation_tokens";

-- AlterTable
ALTER TABLE "users" DROP COLUMN "emailVerified";
