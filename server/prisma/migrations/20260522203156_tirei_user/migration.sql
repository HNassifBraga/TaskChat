/*
  Warnings:

  - You are about to drop the column `user` on the `User` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "User_user_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "user";
