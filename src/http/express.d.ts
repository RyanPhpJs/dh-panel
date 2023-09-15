import { PrismaClient, User } from "@prisma/client";
import { NextFunction, Application, Request, Response } from "express";

export declare function createApplication<Db extends PrismaClient, K extends {}>(db: Db, options: K) : Application & { db: Db } & K

export declare type DHRouter = (app: import("./server")) => any

export type DHRequest = Request & {
    user: User,
    token: string,
    token_expiration: number
};

type ErrorFunction = ((status: number, error: string) => DHResponse) | ((error: string) => DHResponse);
type APIResponseFunction = ((status: number, data: any) => DHResponse) | ((data: any) => DHResponse);

export type DHResponse = Response & { error: ErrorFunction, api: APIResponseFunction }

export declare type DHRoute = (req: DHRequest, res: DHResponse, next: NextFunction) => any