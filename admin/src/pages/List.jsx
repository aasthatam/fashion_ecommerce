import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { backendUrl } from '../App'
import { toast } from "react-toastify"
import { currency } from "../App"
import Modal from 'react-modal';
Modal.setAppElement('#root');

const List = ({token}) => {
  const [ list, setList] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };
  
  const closeModal = () => {
    setSelectedProduct(null);
    setIsModalOpen(false);
  };

  const fetchList = async () => {
    try {
      const response = await axios.get( backendUrl + '/api/product/list')
      if (response.data.success) {
        setList(response.data.products);

      } else{
        toast.error(response.data.message)

      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }

  }

  const removeProduct = async (id) => {
    try {
      const response = await axios.post( backendUrl + '/api/product/remove', {id} ,{ headers: {token} })
      if(response.data.success) {
        toast.success(response.data.message)
        await fetchList();
      } else {
        toast.error(response.data.message)
      }
    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }

  }
  useEffect(() => {
    fetchList()

  }, [])

  const deleteReview = async (productId, reviewId) => {
    try {
      const response = await axios.post(`${backendUrl}/api/product/delete-review`, {
        productId,
        reviewId,
      });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchList(); // refresh product list
        closeModal(); // optionally close modal
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete review");
    }
  };
    return (
      <>
        <p className="text-lg font-semibold mb-4">All Products List</p>
        <div className="flex flex-col gap-2">
          {/* ---------- List Table Title -----------*/}
          <div className='hidden md:grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center py-1 px-2 bg-gray-100 text-sm'>
          <b>Image</b>
          <b>Name</b>
          <b>Category</b>
          <b>Price</b>
          <b className="text-center">Action</b>
          </div>
        </div>
  
        {/* ----- Product List -------*/}
        {list.map((item, index) => (
          <div
            className="grid grid-cols-[1fr_3fr_1fr_1fr_1fr] items-center gap-2 py-1 px-2 bg-white shadow-sm text-sm border-b border-gray-300"
            key={index}
          >
            <img className='w-12' src={item.images[0]} alt={item.name} />
            <p>{item.name}</p>
            <p>{item.category}</p>
            <p>{currency}{item.price}</p>
            <p className="flex justify-end md:justify-center gap-2">
            <button
            onClick={() => openModal(item)}
            className="text-green-600 underline cursor-pointer"
          >
            View Reviews
          </button>
            <button onClick={() => removeProduct(item._id)} className="text-red-600 font-bold cursor-pointer">X</button>
            <a
              href={`/admin/edit/${item._id}`}
              className="text-blue-500 underline"
            >
              Edit
            </a>
          </p>
       </div>  
        ))}
        {selectedProduct && (
          <Modal
            isOpen={isModalOpen}
            onRequestClose={closeModal}
            contentLabel="Product Reviews"
            className="bg-white p-5 rounded-md w-full max-w-lg mx-auto mt-20 outline-none"
            overlayClassName="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm"
          >
            <h2 className="text-lg font-semibold mb-4">
              Reviews for: <span className="text-gray-700">{selectedProduct.name}</span>
            </h2>

            {selectedProduct.reviews && selectedProduct.reviews.length > 0 ? (
              <div className="space-y-3 max-h-80 overflow-y-auto text-sm text-gray-800">
                {selectedProduct.reviews.map((review) => (
          <div key={review._id} className="border-b pb-3 text-sm">
            <p className="font-semibold">{review.username}</p>
            <div className="text-yellow-500 mb-1">
              {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
            </div>
            <p>{review.comment}</p>
            <button
              onClick={() => deleteReview(selectedProduct._id, review._id)}
              className="text-red-500 text-sm mt-1 hover:underline"
            >
              Delete
            </button>
          </div>
        ))}
                
              </div>
            ) : (
              <p className="text-sm text-gray-500 italic">No reviews available.</p>
            )}

            <button
              onClick={closeModal}
              className="mt-5 text-sm px-4 py-1 bg-gray-700 text-white rounded hover:bg-gray-800"
            >
              Close
            </button>
          </Modal>
        )}
      </>
    )
}

export default List
