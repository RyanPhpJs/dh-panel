import { PrismaClient } from "@prisma/client";
import { Application } from "express";

export declare function createApplication<Db extends PrismaClient, K extends {}>(db: Db, options: K) : Application & { db: Db } & K

export declare type DHRouter = (app: import("./server")) => any