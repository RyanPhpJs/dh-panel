-- CreateEnum
CREATE TYPE "CronType" AS ENUM ('INPUT', 'INPUT_TO_MAIN', 'REQUEST', 'DATABASE_QUERY');

-- CreateEnum
CREATE TYPE "ServerProvider" AS ENUM ('DIGITAL_OCEAN', 'MICROSOFT_AZURE', 'AMAZON_AWS', 'LINODE', 'EXTRA_VM', 'GALAXY_GATE', 'CONTABO', 'VULTR', 'RAM_NODE', 'SO_YOU_START', 'OVH', 'CUSTOM');

-- CreateEnum
CREATE TYPE "BackupType" AS ENUM ('SFTP', 'FTP', 'DRIVE');

-- CreateTable
CREATE TABLE "Server" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "local" TEXT,
    "provider" "ServerProvider" NOT NULL DEFAULT 'CUSTOM',
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "ip" TEXT NOT NULL,
    "port" INTEGER NOT NULL,

    CONSTRAINT "Server_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "two_factor_secret" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Bots" (
    "id" TEXT NOT NULL,
    "bot_token" TEXT NOT NULL,
    "database_url" TEXT,
    "shards" INTEGER NOT NULL,
    "servers" INTEGER NOT NULL,
    "git_url" TEXT NOT NULL,
    "node_version" TEXT NOT NULL,
    "env" TEXT,

    CONSTRAINT "Bots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Containers" (
    "id" SERIAL NOT NULL,
    "server_id" TEXT NOT NULL,
    "bot_id" TEXT NOT NULL,
    "is_started" BOOLEAN NOT NULL DEFAULT false,
    "ram_limit" INTEGER NOT NULL,
    "cpu_limit" DOUBLE PRECISION NOT NULL,
    "port" INTEGER,

    CONSTRAINT "Containers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BackupProvider" (
    "id" TEXT NOT NULL,
    "provider" "BackupType" NOT NULL,
    "data" JSONB NOT NULL,

    CONSTRAINT "BackupProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BotDatabaseBackup" (
    "id" TEXT NOT NULL,
    "provider_id" TEXT NOT NULL,
    "bot_id" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "checksun" TEXT NOT NULL,
    "db_type" TEXT NOT NULL,

    CONSTRAINT "BotDatabaseBackup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cron" (
    "id" SERIAL NOT NULL,
    "bot_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "CronType" NOT NULL,
    "time" TEXT NOT NULL,

    CONSTRAINT "Cron_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CronLogs" (
    "id" SERIAL NOT NULL,
    "cron_id" INTEGER NOT NULL,
    "result" TEXT,
    "execute_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CronLogs_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Containers" ADD CONSTRAINT "Containers_server_id_fkey" FOREIGN KEY ("server_id") REFERENCES "Server"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Containers" ADD CONSTRAINT "Containers_bot_id_fkey" FOREIGN KEY ("bot_id") REFERENCES "Bots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotDatabaseBackup" ADD CONSTRAINT "BotDatabaseBackup_provider_id_fkey" FOREIGN KEY ("provider_id") REFERENCES "BackupProvider"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BotDatabaseBackup" ADD CONSTRAINT "BotDatabaseBackup_bot_id_fkey" FOREIGN KEY ("bot_id") REFERENCES "Bots"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CronLogs" ADD CONSTRAINT "CronLogs_cron_id_fkey" FOREIGN KEY ("cron_id") REFERENCES "Cron"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
