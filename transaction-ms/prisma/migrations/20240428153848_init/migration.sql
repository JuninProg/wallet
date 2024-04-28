/*
  Warnings:

  - A unique constraint covering the columns `[originId]` on the table `transactions` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "transactions_originId_key" ON "transactions"("originId");
