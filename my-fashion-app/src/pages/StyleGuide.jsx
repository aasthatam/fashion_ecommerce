import React, { useState } from "react";
import axios from "axios";

const StyleGuide = () => {
  const [imageUploaded, setImageUploaded] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [bodyShape, setBodyShape] = useState(null);
  const [description, setDescription] = useState(null);
  const [resultImageBase64, setResultImageBase64] = useState(null);
  const [recommendedProducts, setRecommendedProducts] = useState([]); // New: Store recommended products
  const [loading, setLoading] = useState(false);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false); // New: loading for recommendations

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Preview locally
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setImageUploaded(true);
      };
      reader.readAsDataURL(file);

      // Send to backend
      const formData = new FormData();
      formData.append('image', file);
      formData.append('height', 160); // Default height

      try {
        setLoading(true);
        const response = await axios.post('http://localhost:5000/predict', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        // Update body shape prediction
        const shape = response.data.shape;
        setBodyShape(shape);
        setDescription(response.data.description);
        setResultImageBase64(response.data.result_image_base64);

        // Fetch Recommended Products
        setLoadingRecommendations(true);
        const recResponse = await axios.get(`http://localhost:4000/api/product/recommendations?shape=${shape.toLowerCase()}`);
        setRecommendedProducts(recResponse.data.products);
      } catch (error) {
        console.error('Error uploading image or fetching recommendations:', error);
      } finally {
        setLoading(false);
        setLoadingRecommendations(false);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-50">
      {/* Page Heading */}
      <h1 className="text-3xl font-semibold text-gray-900 mb-8 text-center">
        Find Your Perfect Style Based on Your Body Type
      </h1>

      <div className="max-w-5xl w-full flex flex-col md:flex-row gap-8 bg-white shadow-lg rounded-lg p-8">

        {/* Left: Upload and Preview */}
        <div className="flex flex-col items-center w-full md:w-1/3">
          <div className="w-full border-2 border-dashed border-gray-400 rounded-lg p-6 flex items-center justify-center h-64 bg-gray-100 relative">
            {loading ? (
              <div className="text-gray-500 animate-pulse">Processing...</div>
            ) : resultImageBase64 ? (
              <img
                src={`data:image/jpeg;base64,${resultImageBase64}`}
                alt="Result preview"
                className="w-full h-full object-cover rounded"
              />
            ) : imagePreview ? (
              <img
                src={imagePreview}
                alt="Uploaded preview"
                className="w-full h-full object-cover rounded"
              />
            ) : (
              <p className="text-gray-600 text-sm text-center">
                Upload your image here
              </p>
            )}
          </div>

          {/* Upload Button */}
          <label className="mt-4 w-full bg-black text-white text-center py-2 px-4 rounded cursor-pointer hover:bg-gray-700">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
            Upload Image
          </label>

          {imageUploaded && !loading && (
            <p className="text-center text-sm text-green-600 mt-3 font-medium">
              Upload Successful
            </p>
          )}
        </div>

        {/* Right: Prediction Result */}
        {imageUploaded && bodyShape && (
          <div className="flex flex-col w-full md:w-2/3">
            {/* Body Shape */}
            <h2 className="text-lg font-light text-gray-800 mb-3 text-center md:text-left">
              Your Body Type: <strong>{bodyShape}</strong>
            </h2>

            {/* Styling Description */}
            <p className="text-gray-600 mb-6">{description}</p>

            {/* Recommendations */}
            <h3 className="text-lg font-semibold text-gray-900 text-center mb-4">
              Our Recommendations
            </h3>

            {loadingRecommendations ? (
              <div className="text-center text-gray-500 animate-pulse">
                Loading Recommendations...
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {recommendedProducts.length > 0 ? (
                  recommendedProducts.map((product) => (
                    <div key={product._id} className="w-full bg-gray-100 rounded-lg flex flex-col items-center justify-center p-4">
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-40 object-cover rounded mb-2"
                      />
                      <p className="text-sm font-medium text-gray-800 text-center">{product.name}</p>
                      <p className="text-xs text-gray-600 text-center">{`$${product.price}`}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-gray-500 col-span-2 md:col-span-3">No Recommendations Found</p>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StyleGuide;
