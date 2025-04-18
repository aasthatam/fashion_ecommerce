import userModel from '../models/userModel.js';

const addToWishlist = async (req, res) => {
  try {
    const { userId, itemId, size } = req.body;
    const user = await userModel.findById(userId);

    const exists = user.wishlistData.find(item => item.itemId === itemId && item.size === size);
    if (exists) return res.json({ success: false, message: "Already in wishlist" });

    const wishlistData = [...user.wishlistData, { itemId, size }];
    await userModel.findByIdAndUpdate(userId, { wishlistData });

    res.json({ success: true, message: "Added to wishlist" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { userId, itemId, size } = req.body;
    const user = await userModel.findById(userId);

    const wishlistData = user.wishlistData.filter(item => !(item.itemId === itemId && item.size === size));
    await userModel.findByIdAndUpdate(userId, { wishlistData });

    res.json({ success: true, message: "Removed from wishlist" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const getUserWishlist = async (req, res) => {
  try {
    const { userId } = req.body;
    const user = await userModel.findById(userId);
    res.json({ success: true, wishlistData: user.wishlistData });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { addToWishlist, removeFromWishlist, getUserWishlist };
