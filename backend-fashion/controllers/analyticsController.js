import userBehaviorModel from "../models/userBehaviorModel.js";

const getBehaviorStats = async (req, res) => {
  try {
    const stats = await userBehaviorModel.aggregate([
      {
        $group: {
          _id: {
            productId: "$productId",
            action: "$action"
          },
          count: { $sum: 1 }
        }
      },
      {
        $lookup: {
          from: "products", // Confirm this matches your actual MongoDB collection name
          localField: "_id.productId",
          foreignField: "_id",
          as: "productInfo"
        }
      },
      {
        $unwind: "$productInfo"
      },
      {
        $project: {
          productId: "$_id.productId",
          action: "$_id.action",
          count: 1,
          productName: "$productInfo.name"
        }
      }
    ]);

    res.json({ success: true, stats });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { getBehaviorStats };
