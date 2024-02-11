/*
  Warnings:

  - You are about to drop the column `serviceId` on the `PasswordManager` table. All the data in the column will be lost.
  - You are about to drop the `Service` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `password` to the `PasswordManager` table without a default value. This is not possible if the table is not empty.
  - Added the required column `serviceName` to the `PasswordManager` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "PasswordManager" DROP CONSTRAINT "PasswordManager_serviceId_fkey";

-- AlterTable
ALTER TABLE "PasswordManager" DROP COLUMN "serviceId",
ADD COLUMN     "password" TEXT NOT NULL,
ADD COLUMN     "serviceName" TEXT NOT NULL,
ADD COLUMN     "serviceUrl" TEXT;

-- DropTable
DROP TABLE "Service";
