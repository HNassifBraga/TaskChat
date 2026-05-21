/*
  Warnings:

  - Added the required column `ownerId` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "ownerId" INTEGER NOT NULL;
