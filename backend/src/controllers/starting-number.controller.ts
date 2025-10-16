import { Request, Response } from "express";
import StartingNumber from "../models/starting-number.model";
import { buildOperationTree } from "../utils";

const getAllStartingNumbers = async (req: Request, res: Response) => {
  try {
    // Fetch all starting numbers
    const startingNumbers = await StartingNumber.find({})
      .sort({
        createdAt: -1,
      })
      .populate("author")
      .lean();

    // For each starting number, fetch its operations tree
    const startingNumbersWithOperations = await Promise.all(
      startingNumbers.map(async (startingNumber) => {
        const operations = await buildOperationTree(
          String(startingNumber._id),
          "StartingNumber"
        );
        return {
          ...startingNumber,
          operations,
          operationsCount: operations.length,
        };
      })
    );

    res.json({
      message: "All starting numbers fetched successfully",
      data: startingNumbersWithOperations,
      success: true,
      type: "success",
    });
  } catch (error) {
    console.error("Error fetching starting numbers:", error);
    res.status(500).json({
      message: "Internal server error",
      type: "error",
      success: false,
    });
  }
};

const createStartingNumber = async (req: Request, res: Response) => {
  try {
    // Validate request body
    if (!req.body || !req.body.value) {
      return res
        .status(400)
        .json({ message: "Starting number is required", success: false });
    }

    // Ensure user is authenticated
    if (!req.user || !req.user._id) {
      return res.status(401).json({
        message: "Unauthorized: User information is missing",
        success: false,
        type: "error",
      });
    }

    const { value } = req.body;

    // Validate starting number
    if (typeof value !== "number" || isNaN(value)) {
      return res.status(400).json({
        message: "Invalid starting number",
        success: false,
        type: "error",
      });
    }

    // Create new starting number
    const newStartingNumber = await StartingNumber.create({
      value,
      author: req.user._id,
    });

    res.status(201).json({
      message: "Starting number created successfully",
      data: newStartingNumber,
      success: true,
      type: "success",
    });
  } catch (error) {
    console.error("Error creating starting number:", error);
    res.status(500).json({
      message: "Internal server error",
      type: "error",
      success: false,
    });
  }
};

const getStartingNumberById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Validate ID
    if (!id || id.trim() === "") {
      return res.status(400).json({
        message: "Invalid Starting Number ID",
        success: false,
        type: "error",
      });
    }

    // Fetch starting number by ID
    const startingNumber = await StartingNumber.findById(id);

    // Check if starting number exists
    if (!startingNumber) {
      return res.status(404).json({
        message: "Starting number not found",
        success: false,
        type: "error",
      });
    }

    res.json({
      message: "Starting number fetched successfully",
      data: startingNumber,
      success: true,
      type: "success",
    });
  } catch (error) {
    console.error("Error fetching starting number by ID:", error);
    res
      .status(500)
      .json({ message: "Internal server error", type: error, success: false });
  }
};

const deleteStartingNumber = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    // Validate ID
    if (!id || id.trim() === "") {
      return res.status(400).json({
        message: "Invalid Starting Number ID",
        success: false,
        type: "error",
      });
    }

    // Delete starting number
    const deletedStartingNumber = await StartingNumber.findByIdAndDelete(id);

    // Check if starting number exists
    if (!deletedStartingNumber) {
      return res.status(404).json({
        message: "Starting number not found",
        success: false,
        type: "error",
      });
    }

    res.json({
      message: "Starting number deleted successfully",
      success: true,
      type: "success",
    });
  } catch (error) {
    console.error("Error deleting starting number:", error);
    res
      .status(500)
      .json({ message: "Internal server error", type: error, success: false });
  }
};

export {
  getAllStartingNumbers,
  createStartingNumber,
  getStartingNumberById,
  deleteStartingNumber,
};
