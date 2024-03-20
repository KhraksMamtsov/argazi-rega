/*
  Warnings:

  - Added the required column `dateAnnouncement` to the `Event` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "dateAnnouncement" TIMESTAMPTZ(3) NOT NULL,
ALTER COLUMN "dateStart" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "dateFinish" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "Lecture" ALTER COLUMN "dateStart" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "dateFinish" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "Meal" ALTER COLUMN "dateStart" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "dateFinish" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "RouteFrom" ALTER COLUMN "dateStart" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "dateFinish" SET DATA TYPE TIMESTAMPTZ(3);

-- AlterTable
ALTER TABLE "RouteTo" ALTER COLUMN "dateStart" SET DATA TYPE TIMESTAMPTZ(3),
ALTER COLUMN "dateFinish" SET DATA TYPE TIMESTAMPTZ(3);
