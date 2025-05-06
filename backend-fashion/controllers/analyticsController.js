import userBehaviorModel from "../models/userBehaviorModel.js";
import mongoose from "mongoose";

const getBehaviorStats = async (req, res) => {
  try {
    const { userId } = req.query;
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    const matchStage = {
      timestamp: { $gte: sevenDaysAgo }
    };

    if (userId) {
      matchStage.userId = new mongoose.Types.ObjectId(userId);
    }

    const stats = await userBehaviorModel.aggregate([
      { $match: matchStage },
      {
        $group: {
          _id: {
            productId: "$productId",
            date: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
            action: "$action"
          },
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "products",
          let: { pid: "$_id.productId" },
          pipeline: [
            { $match: { $expr: { $eq: ["$_id", "$$pid"] } } }
          ],
          as: "productInfo"
        }
      },
      {
        $unwind: {
          path: "$productInfo",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          date: "$_id.date",
          action: "$_id.action",
          productId: "$_id.productId",
          productName: "$productInfo.name",
          userId: "$userId",
          count: 1
        }
      },
      {
        $sort: { date: 1 }
      }
    ]);

    res.json({ success: true, stats });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { getBehaviorStats };
