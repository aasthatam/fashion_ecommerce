import { createContext } from "react";
// import { products } from "../assets/assets.js";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const ShopContext = createContext();

const ShopContextProvider = (props) => {
    const currency = 'Rs.';
    const delivery_fee = 10;
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(true);
    const [token, setToken] = useState('');
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    // Load cartItems from localStorage on initial render
    const [cartItems, setCartItems] = useState(() => {
        const savedCart = localStorage.getItem("cartItems");
        return savedCart ? JSON.parse(savedCart) : {};
    });

    // Load wishlistItems from localStorage on initial render
    const [wishlistItems, setWishlistItems] = useState(() => {
        const savedWishlist = localStorage.getItem("wishlistItems");
        return savedWishlist ? JSON.parse(savedWishlist) : [];
    });

    // Save cartItems and wishlistItems to localStorage whenever they change
    useEffect(() => {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
    }, [cartItems]);

    useEffect(() => {
        localStorage.setItem("wishlistItems", JSON.stringify(wishlistItems));
    }, [wishlistItems]);

    // Add item to cart
    const addToCart = async (itemId, size) => {
        if (!size) {
            toast.error('Select product size');
            return;
        }

        let cartData = structuredClone(cartItems);

        if (cartData[itemId]) {
            if (cartData[itemId][size]) {
                cartData[itemId][size] += 1;
            } else {
                cartData[itemId][size] = 1;
            }
        } else {
            cartData[itemId] = {};
            cartData[itemId][size] = 1;
        }

        setCartItems(cartData);

        if (token) {
            try {
                await axios.post(backendUrl + '/api/cart/add', {itemId, size}, {headers: {token}} ) 
                
            } catch (error) {
                console.error(error)
                toast.error(error.message)
                
            }
        }
    };

    const removeFromCart = async (itemId, size) => {
        let cartData = structuredClone(cartItems);
        const key = String(itemId);
      
        if (cartData[key] && cartData[key][size]) {
          delete cartData[key][size];
      
          if (Object.keys(cartData[key]).length === 0) {
            delete cartData[key];
          }
      
          setCartItems(cartData);
      
          if (token) {
            try {
              await axios.post(backendUrl + '/api/cart/remove', {
                itemId,
                size,
                userId: localStorage.getItem("userId")
              }, {
                headers: { token }
              });
            } catch (error) {
              console.error("Remove cart error:", error);
              toast.error(error.message);
            }
          }
        }
      };
      

    // Update cart item quantity
    const updateCartItem = async (itemId, size, quantity) => {
        let cartData = structuredClone(cartItems);
        cartData[itemId][size] = quantity;
        setCartItems(cartData);

        if (token) {
            try {
               await axios.post(backendUrl + '/api/cart/update', {itemId, size, quantity}, {headers: {token}})
            } catch (error) {
                console.log(error)
                toast.error(error.message)

            }
        }
        
    };

    // Add item to wishlist
    const addToWishlist = (itemId, size) => {
        if (!size) {
            toast.error('Select product size');
            return;
        }

        const alreadyInWishlist = wishlistItems.some(item => item.id === itemId && item.size === size);
        if (alreadyInWishlist) {
            toast.info('Item is already in wishlist');
            return;
        }

        const product = products.find(p => p.id === itemId);
        if (product) {
            setWishlistItems((prevWishlist) => [
                ...prevWishlist,
                { ...product, size }
            ]);
        }
    };

    // Remove item from wishlist
    const removeFromWishlist = (itemId, size) => {
        setWishlistItems((prevWishlist) =>
            prevWishlist.filter(item => !(item.id === itemId && item.size === size))
        );
    };

    // Get total count of items in cart
    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            for (const size in cartItems[items]) {
                try {
                    if (cartItems[items][size] > 0) {
                        totalCount += cartItems[items][size];
                    }
                } catch (error) {
                    console.error("Error while counting cart items:", error);
                }
            }
        }
        return totalCount;
    };

    const getUserCart = async (token) => {
        try {
            const response = await axios.post(backendUrl + '/api/cart/get', {}, {headers: {token}})
            if (response.data.success) {
                setCartItems(response.data.cartData)
            }
            
        } catch (error) {
            console.log(error)
            toast.error(error.message)
            
        }
    }
      

    useEffect(() => {
        if (!token && localStorage.getItem('token')) {
            setToken(localStorage.getItem('token'))
            getUserCart(localStorage.getItem('token'))
        }
    })

    // Get total count of items in wishlist
    const getWishlistCount = () => {
        return wishlistItems.length;
    };

    // Debugging cart and wishlist updates
    useEffect(() => {
        console.log("Cart updated:", cartItems);
    }, [cartItems]);

    useEffect(() => {
        console.log("Wishlist updated:", wishlistItems);
    }, [wishlistItems]);

    // Products fetch from backend 
    const getProductsData = async () => {
      try {
        const response = await axios.get(backendUrl + '/api/product/list')
        if(response.data.success){
          setProducts(response.data.products)
        } else{
          toast.error(response.data.message)
        }
        
      } catch (error) {
        console.log(error)
        toast.error(error.message)
        
      }
    }
    useEffect(() => {
        getProductsData()
    }, [])
    
    useEffect(() => {
    if (!token && localStorage.getItem('token')) {
        setToken(localStorage.getItem('token'))
    }
    })

    const value = {
        products,
        currency,
        delivery_fee,
        search,
        setSearch,
        showSearch,
        setShowSearch,
        cartItems,
        setCartItems,
        addToCart,
        removeFromCart,
        updateCartItem,
        getCartCount,
        wishlistItems,
        setWishlistItems,
        addToWishlist,
        removeFromWishlist,
        getWishlistCount, 
        navigate,
        backendUrl,
        setToken,
        token
    };

    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;
