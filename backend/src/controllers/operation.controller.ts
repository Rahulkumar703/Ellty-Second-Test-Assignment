import { Request, Response } from "express";
import Operation from "../models/operator.model";
import StartingNumber from "../models/starting-number.model";
import mongoose from "mongoose";
import { buildOperationTree } from "../utils";

const createOperation = async (req: Request, res: Response) => {
  try {
    // Validate request body
    if (
      !req.body ||
      !req.body.operator ||
      req.body.value === undefined ||
      isNaN(req.body.value) ||
      !req.body.parentType ||
      !req.body.parentId
    ) {
      return res.status(400).json({
        message: "All fields are required",
        success: false,
        type: "error",
      });
    }

    // Ensure user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        message: "Unauthorized: User information is missing",
        success: false,
        type: "error",
      });
    }

    const { operator, value, parentType, parentId } = req.body;

    // Validate parentId
    if (!mongoose.Types.ObjectId.isValid(parentId)) {
      return res.status(400).json({
        message: "Invalid parent ID",
        success: false,
        type: "error",
      });
    }

    // Validate operator and parentType
    if (!["+", "-", "*", "/"].includes(operator)) {
      return res.status(400).json({
        message: "Invalid operator",
        success: false,
        type: "error",
      });
    }

    const validParentTypes = ["StartingNumber", "Operation"];
    if (!validParentTypes.includes(parentType)) {
      return res.status(400).json({
        message: "Invalid parent type",
        success: false,
        type: "error",
      });
    }

    let parent;

    // Fetch the parent document based on parentType
    if (parentType === "StartingNumber") {
      parent = await StartingNumber.findById(parentId);
    } else if (parentType === "Operation") {
      parent = await Operation.findById(parentId);
    }

    if (!parent) {
      return res.status(404).json({
        message: "Parent not found",
        success: false,
        type: "error",
      });
    }

    // create the operation
    const operation = await Operation.create({
      operator,
      value,
      parentType,
      parentId,
      author: req.user._id,
      result: eval(`${parent.value} ${operator} ${value}`).toFixed(2),
    });
    res.status(201).json({
      message: "Operation created successfully",
      data: operation,
      success: true,
      type: "success",
    });
  } catch (error) {
    console.error("Error creating operation:", error);
    res.status(500).json({
      message: "Internal server error",
      type: "error",
      success: false,
    });
  }
};

const getOperations = async (req: Request, res: Response) => {
  try {
    const { parentType, parentId } = req.params;

    // Validate parentId
    if (!mongoose.Types.ObjectId.isValid(parentId)) {
      return res.status(400).json({
        message: "Invalid parent ID",
        success: false,
        type: "error",
      });
    }

    // Validate parentType
    const validParentTypes = ["StartingNumber", "Operation"];
    if (!validParentTypes.includes(parentType)) {
      return res.status(400).json({
        message: "Invalid parent type",
        success: false,
        type: "error",
      });
    }

    // Fetch operations

    const operations = await buildOperationTree(
      parentId,
      parentType as "StartingNumber" | "Operation"
    );

    res.status(200).json({
      message: "Operations retrieved successfully",
      data: operations,
      success: true,
      type: "success",
    });
  } catch (error) {
    console.error("Error fetching operations:", error);
    res.status(500).json({
      message: "Internal server error",
      type: "error",
      success: false,
    });
  }
};

export { createOperation, getOperations };
