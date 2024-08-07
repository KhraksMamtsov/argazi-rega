/*
  Warnings:

  - Added the required column `description` to the `Event` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Lecture` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Meal` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Place` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Lecture" ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Meal" ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Place" ADD COLUMN     "description" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "RouteFrom" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "RouteTo" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "TicketPaymentToPlaceAdmin" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "VisaPayment" ADD COLUMN     "description" TEXT;
