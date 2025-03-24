import React, { useState } from "react";

const Search = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [showPopup, setShowPopup] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      console.log("Search Results:", data);
    } catch (error) {
      console.error("Error uploading image:", error);
    }
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  return (
    <div className="flex flex-col items-center py-10">
      {/* Search Bar */}
      <div className="relative flex items-center border-b border-gray-500 w-80">
        <input
          type="text"
          placeholder="What are you looking for?"
          className="outline-none border-none w-full text-center"
        />
       {/* Plus Button */}
       <button
        className="ml-2 w-8 h-8 flex items-center justify-center rounded-full border hover:bg-gray-100 transition-colors mb-2"
        onClick={togglePopup}
       >
       +
  </button>
        {/* Popup */}
        {showPopup && (
          <div className="absolute bottom-12 right-0 bg-white border border-gray-200 rounded-lg shadow-lg p-4 w-48">
            <p className="text-sm text-gray-700">Upload image for search</p>
            <input
              type="file"
              className="hidden"
              id="fileInput"
              onChange={handleFileChange}
            />
            <label
              htmlFor="fileInput"
              className="block mt-2 text-sm text-gray-500 cursor-pointer hover:underline"
            >
              Choose File
            </label>
          </div>
        )}
      </div>

      {/* Search by Image Button */}
      {selectedFile && (
        <button
          className="mt-4 bg-black text-white px-4 py-2 rounded"
          onClick={handleUpload}
        >
          Search by Image
        </button>
      )}
    </div>
  );
};

export default Search;