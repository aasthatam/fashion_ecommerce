import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { backendUrl } from "../App";

const Edit = ({ token }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios
      .post(backendUrl + "/api/product/single", { productId: id })
      .then((res) => {
        if (res.data.success) {
          const p = res.data.product;
          setProduct({
            ...p,
            sizes: p.sizes || [],
            tags: p.tags || [],
            suitableBodyType: p.suitableBodyType || [],
          });
        } else {
          toast.error("Product not found");
        }
      })
      .catch((err) => {
        toast.error("Failed to load product");
        console.error(err);
      });
  }, [id]);

  const toggleArrayField = (key, value) => {
    setProduct((prev) => ({
      ...prev,
      [key]: prev[key].includes(value)
        ? prev[key].filter((v) => v !== value)
        : [...prev[key], value],
    }));
  };

  const updateHandler = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...product,
        id,
        sizes: JSON.stringify(product.sizes),
        tags: JSON.stringify(product.tags),
        suitableBodyType: JSON.stringify(product.suitableBodyType),
      };

      const res = await axios.post(backendUrl + "/api/product/update", payload, {
        headers: { token },
      });

      if (res.data.success) {
        toast.success("Product updated successfully");
        navigate("/admin");
      } else {
        toast.error(res.data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating product");
    }
  };

  if (!product) return <div className="p-4">Loading...</div>;

  return (
    <form onSubmit={updateHandler} className="flex flex-col w-full max-w-3xl p-6 gap-4 ml-0 sm:ml-8">
      <h2 className="text-xl font-semibold">Edit Product</h2>

      <input value={product.name} onChange={(e) => setProduct({ ...product, name: e.target.value })} className="w-full px-3 py-2 border rounded" placeholder="Product Name" required />

      <textarea value={product.details} onChange={(e) => setProduct({ ...product, details: e.target.value })} className="w-full px-3 py-2 border rounded" placeholder="Product Details" required />

      <input type="number" value={product.price} onChange={(e) => setProduct({ ...product, price: e.target.value })} className="w-full px-3 py-2 border rounded" placeholder="Price" />

      <input value={product.fabric} onChange={(e) => setProduct({ ...product, fabric: e.target.value })} className="w-full px-3 py-2 border rounded" placeholder="Fabric" />

      <input value={product.colors} onChange={(e) => setProduct({ ...product, colors: e.target.value })} className="w-full px-3 py-2 border rounded" placeholder="Colors" />

      <select value={product.category} onChange={(e) => setProduct({ ...product, category: e.target.value })} className="w-full px-3 py-2 border rounded">
        <option value="Tops">Tops</option>
        <option value="Shirts">Shirts</option>
        <option value="Sweaters">Sweaters</option>
        <option value="Outerwears">Outerwears</option>
        <option value="Pants">Pants</option>
        <option value="Dresses">Dresses</option>
        <option value="Bottoms">Bottoms</option>
        <option value="Bodysuits & Jumpsuits">Bodysuits & Jumpsuits</option>
      </select>

      <div className="w-full">
        <p className="mb-2 font-medium">Sizes</p>
        <div className="flex gap-3">
          {["S", "M", "L", "XL", "XXL"].map((size) => (
            <div
              key={size}
              onClick={() => toggleArrayField("sizes", size)}
              className={`px-3 py-1 rounded cursor-pointer ${product.sizes.includes(size) ? "bg-gray-700 text-white" : "bg-slate-200 text-black"}`}
            >
              {size}
            </div>
          ))}
        </div>
      </div>

      <div className="w-full">
        <p className="mb-2 font-medium">Suitable Body Types</p>
        <div className="flex flex-wrap gap-3">
          {[
            { label: "rectangle", tip: "Best for straight figures, adds shape" },
            { label: "triangle", tip: "Best for wider hips, balances upper body" },
            { label: "inverted triangle", tip: "Best for broad shoulders, adds volume to hips" },
            { label: "spoon", tip: "Similar to triangle but more defined lower body" },
            { label: "hourglass", tip: "Balanced top and bottom, defines the waist" }
          ].map(({ label, tip }) => (
            <div
              key={label}
              title={tip}
              onClick={() => toggleArrayField("suitableBodyType", label)}
              className={`cursor-pointer px-3 py-1 rounded border text-sm ${product.suitableBodyType.includes(label) ? "bg-gray-900 text-white" : "bg-slate-200 text-gray-800"}`}
            >
              {label}
            </div>
          ))}
        </div>
      </div>

      <div className="w-full">
        <p className="mb-2 font-medium">Tags</p>
        {["Save 10%", "Save 20%", "Save 30%", "Save 40%", "Save 50%"].map((tag) => (
          <label key={tag} className="mr-3">
            <input
              type="checkbox"
              checked={product.tags.includes(tag)}
              onChange={() => toggleArrayField("tags", tag)}
            />
            <span className="ml-1">{tag}</span>
          </label>
        ))}
      </div>

      <div className="flex gap-4 items-center">
        <label>
          <input type="checkbox" checked={product.bestselling} onChange={() => setProduct({ ...product, bestselling: !product.bestselling })} />
          <span className="ml-1">Bestselling</span>
        </label>
        <label>
          <input type="checkbox" checked={product.isNewArrival} onChange={() => setProduct({ ...product, isNewArrival: !product.isNewArrival })} />
          <span className="ml-1">New Arrival</span>
        </label>
      </div>

      <div className="w-full">
        <p className="mb-2 font-medium">Availability</p>
        <select value={product.availability} onChange={(e) => setProduct({ ...product, availability: e.target.value })} className="w-full px-3 py-2 border rounded">
          <option value="In Stock">In Stock</option>
          <option value="Out of Stock">Out of Stock</option>
          <option value="Preorder">Preorder</option>
        </select>
      </div>

      <button type="submit" className="w-40 mt-4 bg-black text-white py-2 rounded hover:bg-white hover:text-black hover:border hover:border-black transition">
        Update Product
      </button>
    </form>
  );
};

export default Edit;
