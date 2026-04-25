import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";
import Category from "../models/category.js";
import AppError from "../utils/AppError.js";

// =======================
// CREATE
// =======================
export const createTransaction = async (req, res, next) => {
  try {
    let { amount, type, categoryId, date, note } = req.body;

    if (!amount || !type || !categoryId) {
      throw new AppError("Required fields missing", 400);
    }

    if (amount <= 0) {
      throw new AppError("Amount must be > 0", 400);
    }

    if (!["income", "expense"].includes(type)) {
      throw new AppError("Invalid type", 400);
    }

    const category = await Category.findOne({
      _id: categoryId,
      userId: req.user.id,
    });

    if (!category) {
      throw new AppError("Invalid category", 400);
    }

    if (category.type !== type) {
      throw new AppError(`Category is ${category.type}`, 400);
    }

    const transaction = await Transaction.create({
      amount,
      type,
      categoryId,
      date: date || Date.now(),
      note,
      userId: req.user.id,
    });

    res.status(201).json({ success: true, data: transaction });

  } catch (err) {
    next(err);
  }
};

// =======================
// GET ALL
// =======================
export const getTransactions = async (req, res, next) => {
  try {
    const userId = req.user.id;

    // 🔹 Query params
    const {
      page = 1,
      limit = 20,
      type,
      category,
      startDate,
      endDate,
      month,
    } = req.query;

    // 🔹 Build filter
    const filter = { userId };

    if (type) {
      filter.type = type;
    }

    if (category) {
      filter.categoryId = category;
    }

    // 🔹 Date filtering
    if (month) {
      const start = new Date(`${month}-01`);
      const end = new Date(start);
      end.setMonth(end.getMonth() + 1);

      filter.date = {
        $gte: start,
        $lt: end,
      };
    } else {
      if (startDate || endDate) {
        filter.date = {};
        if (startDate) filter.date.$gte = new Date(startDate);
        if (endDate) filter.date.$lte = new Date(endDate);
      }
    }

    // 🔹 Pagination
    const skip = (page - 1) * limit;

    const transactions = await Transaction.find(filter)
      .populate("categoryId", "name type")
      .sort({ date: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Transaction.countDocuments(filter);

    res.json({
      data: transactions,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (err) {
    next(err);
  }
};

// =======================
// UPDATE
// =======================
export const updateTransaction = async (req, res, next) => {
  try {
    const { amount, type, categoryId, note } = req.body;

    if (!amount || !type || !categoryId) {
      throw new AppError("Required fields missing", 400);
    }

    const category = await Category.findOne({
      _id: categoryId,
      userId: req.user.id,
    });

    if (!category) {
      throw new AppError("Invalid category", 400);
    }

    if (category.type !== type) {
      throw new AppError("Category/type mismatch", 400);
    }

    const transaction = await Transaction.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { amount, type, categoryId, note },
      { new: true }
    );

    if (!transaction) {
      throw new AppError("Transaction not found", 404);
    }

    res.json({ success: true, data: transaction });

  } catch (err) {
    next(err);
  }
};

// =======================
// DELETE
// =======================
export const deleteTransaction = async (req, res, next) => {
  try {
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!transaction) {
      throw new AppError("Transaction not found", 404);
    }

    res.json({ success: true, message: "Transaction deleted" });

  } catch (err) {
    next(err);
  }
};

// =======================
// SUMMARY
// =======================
export const getSummary = async (req, res, next) => {
  try {
    const { month } = req.query;

    let matchStage = {
      userId: new mongoose.Types.ObjectId(req.user.id),
    };

    if (month) {
      const [year, m] = month.split("-");
      const start = new Date(year, m - 1, 1);
      const end = new Date(year, m, 1);

      matchStage.date = { $gte: start, $lt: end };
    }

    const result = await Transaction.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$type",
          total: { $sum: "$amount" },
        },
      },
    ]);

    res.json({ success: true, data: result });

  } catch (err) {
    next(err);
  }
};

// =======================
// CATEGORY SUMMARY
// =======================
export const getCategorySummary = async (req, res, next) => {
  try {
    const { month } = req.query;

    let matchStage = {
      userId: new mongoose.Types.ObjectId(req.user.id),
    };

    if (month) {
      const [year, m] = month.split("-");
      const start = new Date(year, m - 1, 1);
      const end = new Date(year, m, 1);

      matchStage.date = { $gte: start, $lt: end };
    }

    const result = await Transaction.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: "$categoryId",
          total: { $sum: "$amount" },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "_id",
          foreignField: "_id",
          as: "category",
        },
      },
      { $unwind: "$category" },
      {
        $project: {
          _id: 0,
          category: "$category.name",
          total: 1,
          type: "$category.type",
        },
      },
    ]);

    res.json({ success: true, data: result });

  } catch (err) {
    next(err);
  }
};