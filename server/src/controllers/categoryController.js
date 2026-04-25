import Category from "../models/category.js";
import AppError from "../utils/AppError.js";

// CREATE
export const createCategory = async (req, res, next) => {
  try {
    let { name, type } = req.body;

    name = name?.trim();

    if (!name || !type) {
      throw new AppError("Name and type are required", 400);
    }

    if (name.length < 2) {
      throw new AppError("Category name too short", 400);
    }

    if (!["income", "expense"].includes(type)) {
      throw new AppError("Invalid category type", 400);
    }

    const existing = await Category.findOne({
      name,
      type,
      userId: req.user.id,
    });

    if (existing) {
      throw new AppError("Category already exists", 400);
    }

    const category = await Category.create({
      name,
      type,
      userId: req.user.id,
    });

    res.status(201).json({ success: true, data: category });

  } catch (err) {
    next(err);
  }
};

// GET
export const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find({
      userId: req.user.id,
    }).sort({ name: 1 });

    res.json({ success: true, data: categories });

  } catch (err) {
    next(err);
  }
};

// UPDATE
export const updateCategory = async (req, res, next) => {
  try {
    const { name, type } = req.body;

    const category = await Category.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      { name, type },
      { new: true }
    );

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    res.json({ success: true, data: category });

  } catch (err) {
    next(err);
  }
};

// DELETE
export const deleteCategory = async (req, res, next) => {
  try {
    const category = await Category.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    res.json({ success: true, message: "Deleted" });

  } catch (err) {
    next(err);
  }
};