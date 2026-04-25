import mongoose from "mongoose";
import Transaction from "../models/Transaction.js";

export const getStatsSummary = async (req, res) => {
  try {
    const { month } = req.query;

    let matchStage = {
      userId: new mongoose.Types.ObjectId(req.user.id),
    };

    // ✅ Month filter
    if (month) {
      const [year, monthNum] = month.split("-");

      const start = new Date(year, monthNum - 1, 1);
      const end = new Date(year, monthNum, 1);

      matchStage.date = {
        $gte: start,
        $lt: end,
      };
    }

    // 🔹 Aggregate everything in ONE pipeline
    const result = await Transaction.aggregate([
      { $match: matchStage },

      {
        $facet: {
          summary: [
            {
              $group: {
                _id: "$type",
                total: { $sum: "$amount" },
              },
            },
          ],
          categories: [
  {
    $group: {
      _id: {
        categoryId: "$categoryId",
        type: "$type", // ✅ include type
      },
      total: { $sum: "$amount" },
    },
  },
  {
    $lookup: {
      from: "categories",
      localField: "_id.categoryId",
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
      type: "$_id.type", // ✅ send to frontend
    },
  },
  { $sort: { total: -1 } },
],
        },
      },
    ]);

    const summaryData = result[0].summary;

    const income =
      summaryData.find((s) => s._id === "income")?.total || 0;

    const expense =
      summaryData.find((s) => s._id === "expense")?.total || 0;

    res.json({
      totalIncome: income,
      totalExpense: expense,
      net: income - expense,
      categories: result[0].categories,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};