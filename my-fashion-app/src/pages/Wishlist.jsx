import React, { useState } from 'react'

const Wishlist = () => {
    // Sample wishlist data (initially empty)
    const [wishlistItems, setWishlistItems] = useState([]);

    // Function to remove an item from the wishlist
    const removeItem = (id) => {
        setWishlistItems(wishlistItems.filter((item) => item.id !== id));
    };

    // Function to move an item to the cart (placeholder function)
    const moveToCart = (id) => {
        console.log(`Item ${id} moved to cart`);
        removeItem(id);
    }

  return (
    <div className="min-h-screen flex flex-col justify-between p-6 font-sans">
        {/* Header */}
        <header className="text-center pt-20">
            <h1 className="text-2xl font-semibold mb-6">Wishlist</h1>
        </header>

        {/* Main Content */}
        <main className="flex-grow flex flex-col justify-center">
            {/* Display message if wishlist is empty */}
            {wishlistItems.length === 0 ? (
                <div className="text-center py-15">
                    <p className="text-gray-600 text-lg">Your wishlist is empty.</p>
                    <p className="text-gray-500 mt-2">Add products to your wislist to save them for later!</p>

                </div>
            ) : (
                <>
                {/* Wishlist Table */}
                <div className="overflow-x-auto">
                    <table className="min-u-full bg-white border border-gray-200">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="py-2 px-4 border-b">No.</th>
                                <th className="py-2 px-4 border-b">Preview</th>
                                <th className="py-2 px-4 border-b">Product</th>
                                <th className="py-2 px-4 border-b">Size</th>
                                <th className="py-2 px-4 border-b">Price</th>
                                <th className="py-2 px-4 border-b">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {wishlistItems.map((item, index) => (
                                <tr key={item.id} className="hover:bg-gray-50">
                                    <td className="py-2 px-4 border-b text-center">{index + 1}</td>
                                    <td className="py-2 px-4 border-b text-center">
                                        {/* Replace with actual image */}
                                    <div className="w-12 h-12 bg-gray-200 rounded"></div>
                                    </td>
                                    <td className="py-2 px-4 border-b">{item.name}</td>
                                    <td className="py-2 px-4 border-b text-center">{item.size}</td>
                                    <td className="py-2 px-4 border-b text-center">Rs {item.price.toFixed(2)}</td>
                                    <td className="py-2 px-4 border-b text-center">
                                    <button
                                        onClick={() => moveToCart(item.id)}
                                        className="mr-2 text-blue-500 hover:text-blue-700"
                                    >
                                    Move to Cart
                                    </button>
                                    <button
                                    onClick={() => removeItem(item.id)}
                                    className="text-gray-500 hover:text-red-500"
                                    >
                                        🗑️
                                    </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                </>
            )}
        </main>
    </div>
  )
}

export default Wishlist;
