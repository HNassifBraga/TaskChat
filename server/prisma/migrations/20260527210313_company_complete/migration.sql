/*
  Warnings:

  - A unique constraint covering the columns `[telefone]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `email` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endereco` to the `Company` table without a default value. This is not possible if the table is not empty.
  - Added the required column `telefone` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Company" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "endereco" TEXT NOT NULL,
ADD COLUMN     "telefone" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Company_telefone_key" ON "Company"("telefone");

-- CreateIndex
CREATE UNIQUE INDEX "Company_email_key" ON "Company"("email");
