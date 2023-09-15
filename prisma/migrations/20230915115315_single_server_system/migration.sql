/*
  Warnings:

  - You are about to drop the column `git_url` on the `Bots` table. All the data in the column will be lost.
  - You are about to drop the column `servers` on the `Bots` table. All the data in the column will be lost.
  - You are about to drop the column `shards` on the `Bots` table. All the data in the column will be lost.
  - You are about to drop the `BackupProvider` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `BotDatabaseBackup` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Containers` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Cron` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CronLogs` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Server` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `gid` to the `Bots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `package_id` to the `Bots` table without a default value. This is not possible if the table is not empty.
  - Added the required column `uid` to the `Bots` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "BotDatabaseBackup" DROP CONSTRAINT "BotDatabaseBackup_bot_id_fkey";

-- DropForeignKey
ALTER TABLE "BotDatabaseBackup" DROP CONSTRAINT "BotDatabaseBackup_provider_id_fkey";

-- DropForeignKey
ALTER TABLE "Containers" DROP CONSTRAINT "Containers_bot_id_fkey";

-- DropForeignKey
ALTER TABLE "Containers" DROP CONSTRAINT "Containers_server_id_fkey";

-- DropForeignKey
ALTER TABLE "CronLogs" DROP CONSTRAINT "CronLogs_cron_id_fkey";

-- AlterTable
ALTER TABLE "Bots" DROP COLUMN "git_url",
DROP COLUMN "servers",
DROP COLUMN "shards",
ADD COLUMN     "domains" TEXT[],
ADD COLUMN     "ftp_password" TEXT,
ADD COLUMN     "ftp_username" TEXT,
ADD COLUMN     "gid" TEXT NOT NULL,
ADD COLUMN     "http_port" INTEGER,
ADD COLUMN     "package_id" INTEGER NOT NULL,
ADD COLUMN     "started" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "uid" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "is_admin" BOOLEAN NOT NULL DEFAULT false;

-- DropTable
DROP TABLE "BackupProvider";

-- DropTable
DROP TABLE "BotDatabaseBackup";

-- DropTable
DROP TABLE "Containers";

-- DropTable
DROP TABLE "Cron";

-- DropTable
DROP TABLE "CronLogs";

-- DropTable
DROP TABLE "Server";

-- DropEnum
DROP TYPE "BackupType";

-- DropEnum
DROP TYPE "CronType";

-- DropEnum
DROP TYPE "ServerProvider";

-- CreateTable
CREATE TABLE "Packages" (
    "id" SERIAL NOT NULL,
    "is_started" BOOLEAN NOT NULL DEFAULT false,
    "ram_limit" INTEGER NOT NULL,
    "cpu_limit" DOUBLE PRECISION NOT NULL,
    "storage_limit" INTEGER NOT NULL,

    CONSTRAINT "Packages_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Bots" ADD CONSTRAINT "Bots_package_id_fkey" FOREIGN KEY ("package_id") REFERENCES "Packages"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
