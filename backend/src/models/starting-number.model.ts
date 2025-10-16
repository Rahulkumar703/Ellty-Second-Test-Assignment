import mongoose, { Schema } from "mongoose";
import { IStartingNumber } from "../types";

const startingNumberSchema: Schema<IStartingNumber> = new mongoose.Schema(
  {
    value: {
      type: Number,
      required: [true, "Starting number is required"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Author is required"],
    },
  },
  { timestamps: true }
);

const StartingNumber = mongoose.model("StartingNumber", startingNumberSchema);
export default StartingNumber;
