import * as express from "express";
import { ITokenPayload } from ".";

declare global {
  namespace Express {
    interface Request {
      user?: ITokenPayload;
    }
  }
}

export {};
