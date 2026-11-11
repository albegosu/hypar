-- AlterTable
ALTER TABLE "UserSettings" ADD COLUMN     "autoEngage" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "peerLimit" INTEGER NOT NULL DEFAULT 15;
