/*
  Warnings:

  - A unique constraint covering the columns `[identifier,token,userId]` on the table `VerificationToken` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT "Account_userId_fkey";

-- DropForeignKey
ALTER TABLE "PasswordManager" DROP CONSTRAINT "PasswordManager_userId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "VerificationToken" DROP CONSTRAINT "VerificationToken_userId_fkey";

-- DropIndex
DROP INDEX "VerificationToken_identifier_token_key";

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_userId_key" ON "VerificationToken"("identifier", "token", "userId");
