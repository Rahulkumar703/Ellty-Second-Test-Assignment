import jwt from "jsonwebtoken";
import Operation from "../models/operator.model";
import { IOperationsTree } from "../types";

import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET as string;
if (!JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined in environment variables");
}

interface ITokenPayload {
  _id: string;
  username: string;
}

const generateToken = async ({ username, _id }: ITokenPayload) => {
  return jwt.sign({ _id, username }, JWT_SECRET, {
    expiresIn: "12h",
  });
};

const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, JWT_SECRET) as ITokenPayload;
  } catch (error) {
    return null;
  }
};

const buildOperationTree = async (
  parentId: string,
  parentType: "StartingNumber" | "Operation"
): Promise<IOperationsTree[]> => {
  const children = await Operation.find({ parentId, parentType }).populate(
    "author"
  );

  const tree = await Promise.all(
    children.map(async (op) => {
      const subTree = await buildOperationTree(op._id.toString(), "Operation");
      return {
        _id: op._id,
        operator: op.operator,
        value: op.value,
        result: op.result,
        parentType: op.parentType,
        parentId: op.parentId,
        author: {
          _id: op.author._id,
          username: op.author.username,
        },
        children: subTree,
      };
    })
  );

  return tree;
};

export { generateToken, verifyToken, buildOperationTree };
