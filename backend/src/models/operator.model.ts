// models/operation.model.ts
import mongoose, { Document, Schema } from "mongoose";
import { IOperation } from "../types";

const operationSchema: Schema<IOperation> = new mongoose.Schema(
  {
    operator: {
      type: String,
      enum: ["+", "-", "*", "/"],
      required: [true, "Operator is required"],
    },
    value: {
      type: Number,
      required: [true, "Value is required"],
    },
    result: {
      type: Number,
      required: [true, "Result is required"],
    },
    parentType: {
      type: String,
      enum: ["StartingNumber", "Operation"],
      required: [true, "Parent type is required"],
    },
    parentId: {
      type: mongoose.Schema.Types.ObjectId,
      refPath: "parentType",
      required: [true, "Parent ID is required"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },
  },
  { timestamps: true }
);

const Operation = mongoose.model("Operation", operationSchema);
export default Operation;
