import { Types } from "mongoose";

export interface ITokenPayload {
  _id: string;
  username: string;
}

export interface IUser {
  username: string;
  password: string;
  comparePassword(candidatePassword: string): boolean;
}

export interface IStartingNumber {
  value: number;
  author: Types.ObjectId;
}

export interface IOperation {
  operator: "+" | "-" | "*" | "/";
  value: number;
  result: number;
  parentType: "StartingNumber" | "Operation";
  parentId: Types.ObjectId;
  author: {
    _id: Types.ObjectId;
    username: string;
  };
}

export interface IOperationsTree {
  _id: Types.ObjectId;
  operator: "+" | "-" | "*" | "/";
  value: number;
  result: number;
  parentType: "StartingNumber" | "Operation";
  parentId: Types.ObjectId;
  author: {
    _id: Types.ObjectId;
    username: string;
  };
  children: IOperationsTree[];
}
