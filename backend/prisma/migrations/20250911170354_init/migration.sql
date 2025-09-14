/*
  Warnings:

  - You are about to drop the column `createdById` on the `Sensor` table. All the data in the column will be lost.
  - You are about to drop the column `threshold` on the `Sensor` table. All the data in the column will be lost.
  - The `location` column on the `Sensor` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - You are about to drop the column `createdAt` on the `SensorReading` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `Action` table. If the table is not empty, all the data it contains will be lost.
  - Changed the type of `level` on the `Alert` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `type` on the `Sensor` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `passwordHash` to the `User` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `role` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "Action" DROP CONSTRAINT "Action_createdById_fkey";

-- DropForeignKey
ALTER TABLE "Action" DROP CONSTRAINT "Action_sensorId_fkey";

-- DropForeignKey
ALTER TABLE "Alert" DROP CONSTRAINT "Alert_sensorId_fkey";

-- DropForeignKey
ALTER TABLE "Sensor" DROP CONSTRAINT "Sensor_createdById_fkey";

-- AlterTable
ALTER TABLE "Alert" ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "resolvedAt" TIMESTAMP(3),
ADD COLUMN     "resolvedBy" TEXT,
DROP COLUMN "level",
ADD COLUMN     "level" TEXT NOT NULL,
ALTER COLUMN "sensorId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Sensor" DROP COLUMN "createdById",
DROP COLUMN "threshold",
ADD COLUMN     "metadata" JSONB,
DROP COLUMN "type",
ADD COLUMN     "type" TEXT NOT NULL,
DROP COLUMN "location",
ADD COLUMN     "location" JSONB;

-- AlterTable
ALTER TABLE "SensorReading" DROP COLUMN "createdAt",
ADD COLUMN     "rawPayload" JSONB,
ADD COLUMN     "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ALTER COLUMN "value" DROP NOT NULL;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "password",
ADD COLUMN     "passwordHash" TEXT NOT NULL,
ALTER COLUMN "name" DROP NOT NULL,
DROP COLUMN "role",
ADD COLUMN     "role" TEXT NOT NULL;

-- DropTable
DROP TABLE "Action";

-- DropEnum
DROP TYPE "AlertLevel";

-- DropEnum
DROP TYPE "Role";

-- DropEnum
DROP TYPE "SensorType";

-- CreateIndex
CREATE INDEX "Alert_sensorId_level_idx" ON "Alert"("sensorId", "level");

-- CreateIndex
CREATE INDEX "Sensor_type_idx" ON "Sensor"("type");

-- CreateIndex
CREATE INDEX "SensorReading_sensorId_timestamp_idx" ON "SensorReading"("sensorId", "timestamp");

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_sensorId_fkey" FOREIGN KEY ("sensorId") REFERENCES "Sensor"("id") ON DELETE SET NULL ON UPDATE CASCADE;
