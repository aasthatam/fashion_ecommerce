import React, { useState } from 'react'
import { assets } from '../assets/assets'
import axios from "axios"
import { backendUrl } from '../App'
import { toast } from "react-toastify"

const Add = ({token}) => {
  const [image1, setImage1] = useState(false)
  const [image2, setImage2] = useState(false)
  const [image3, setImage3] = useState(false)
  const [image4, setImage4] = useState(false)

  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("Tops");
  const [bestselling, setBestselling] = useState(false);
  const [sizes, setSizes] = useState([]);
  const [fabric, setFabric] = useState('');
  const [isNewArrival, setIsNewArrival] = useState(false);
  const [availability, setAvailability] = useState('In Stock');
  const [colors, setColors] = useState('');
  const [tags, setTags] = useState([]);
  const [suitableBodyType, setSuitableBodyType] = useState([]);

  const toggleBodyType = (type) => {
    setSuitableBodyType((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("details", details)
      formData.append("price", price)
      formData.append("category", category)
      formData.append("bestselling", bestselling)
      formData.append("sizes", JSON.stringify(sizes))
      formData.append("fabric", fabric)
      formData.append("tags", JSON.stringify(tags))
      formData.append("suitableBodyType", JSON.stringify(suitableBodyType));
      formData.append("isNewArrival", isNewArrival)
      formData.append("availability", availability)
      formData.append("colors", colors)

      image1 && formData.append("image1", image1)
      image2 && formData.append("image2", image2)
      image3 && formData.append("image3", image3)
      image4 && formData.append("image4", image4)

      const response = await axios.post(backendUrl + "/api/product/add", formData, {headers: {token}})
      if(response.data.success) {
        toast.success(response.data.message)
        setName('')
        setDetails('')
        setImage1(false)
        setImage2(false)
        setImage3(false)
        setImage4(false)
        setPrice('')
        setBestselling(false)
        setSizes([])
        setFabric('')
        setIsNewArrival(false)
        setAvailability('In Stock')
        setColors('')
        setTags([])
        setSuitableBodyType([])
        
      } else {
        toast.error(response.data.message)
      }
      
    } catch (error) {
      console.log(error);
      toast.error(error.message);
      
    }
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col w-full items-start gap-3'>
      <div>
        <p className="text-md font-semibold mb-2">Upload Image</p>
        <div className='flex gap-2'>
          <label htmlFor="image1">
            <img className = 'w-20' src={!image1 ? assets.upload_area : URL.createObjectURL (image1)} alt =""/>
            <input onChange={(e) => setImage1(e.target.files[0])} type= "file" id = "image1" hidden/>
          </label>
          <label htmlFor="image2">
            <img className = 'w-20' src={!image2 ? assets.upload_area : URL.createObjectURL (image2)} alt =""/>
            <input onChange={(e) => setImage2(e.target.files[0])} type= "file" id = "image2" hidden/>
          </label>
          <label htmlFor="image3">
            <img className = 'w-20' src={!image3 ? assets.upload_area : URL.createObjectURL (image3)} alt =""/>
            <input onChange={(e) => setImage3(e.target.files[0])} type= "file" id = "image3" hidden/>
          </label>
          <label htmlFor="image4">
            <img className = 'w-20' src={!image4 ? assets.upload_area : URL.createObjectURL (image4)} alt =""/>
            <input onChange={(e) => setImage4(e.target.files[0])} type= "file" id = "image4" hidden/>
          </label>
        </div>
      
      </div>
      <div className='w-full'>
        <p className="text-md font-semibold mb-2">Product Name</p>
        <input onChange={(e)=>setName(e.target.value)} value={name} className="w-full max-w-[500px] px-3 py-2" type="text" placeholder='Type here' required/>
      </div>
      <div className='w-full'>
        <p className="text-md font-semibold mb-2">Product Details</p>
        <textarea onChange={(e)=>setDetails(e.target.value)} value={details} className="w-full max-w-[500px] px-3 py-2" type="text" placeholder='Write content here' required/>
      </div>
      <div className ="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="text-md font-semibold mb-2">Product Category</p>
          <select onChange={(e)=>setCategory(e.target.value)} value={category} className='w-full px-3 py-2'>
             <option value="Tops">Tops</option>
             <option value="Shirts">Shirts</option>
             <option value="Sweaters">Sweaters</option>
             <option value="Outerwears">Outerwears</option>
             <option value="Pants">Pants</option>
             <option value="Dresses">Dresses</option>
             <option value="Bottoms">Bottoms</option>
             <option value="Bodysuits & Jumpsuits">Bodysuits & Jumpsuits</option>
          </select>
        </div>
      </div>
      <div>
        <p className="text-md font-semibold mb-2">Product Price</p>
        <input onChange={(e)=>setPrice(e.target.value)} value={price} className="w-full px-3 py-2 sm:w-[120px]" type="number" placeholder='20' />
      </div>
      <div>
        <p className="text-md font-semibold mb-2">Product Sizes</p>
        <div className="flex gap-3">
          <div onClick={()=>setSizes(prev => prev.includes("S") ? prev.filter( item => item !== "S" ) : [...prev, "S"])}>
            <p className= {`${sizes.includes("S") ? "bg-gray-200" : "bg-slate-300"} px-3 py-1 cursor-pointer`}>S</p>
          </div>

          <div onClick={()=>setSizes(prev => prev.includes("M") ? prev.filter( item => item !== "M" ) : [...prev, "M"])}>
            <p className= {`${sizes.includes("M") ? "bg-gray-200" : "bg-slate-300"} px-3 py-1 cursor-pointer`}>M</p>
          </div>

          <div onClick={()=>setSizes(prev => prev.includes("L") ? prev.filter( item => item !== "L" ) : [...prev, "L"])}>
            <p className= {`${sizes.includes("L") ? "bg-gray-200" : "bg-slate-300"} px-3 py-1 cursor-pointer`}>L</p>
          </div>

          <div onClick={()=>setSizes(prev => prev.includes("XL") ? prev.filter( item => item !== "XL" ) : [...prev, "XL"])}>
            <p className= {`${sizes.includes("XL") ? "bg-gray-200" : "bg-slate-300"} px-3 py-1 cursor-pointer`}>XL</p>
          </div>

          <div onClick={()=>setSizes(prev => prev.includes("XXL") ? prev.filter( item => item !== "XXL" ) : [...prev, "XXL"])}>
            <p className= {`${sizes.includes("XXL") ? "bg-gray-200" : "bg-slate-300"} px-3 py-1 cursor-pointer`}>XXL</p>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-2">
        <input onChange={() => setBestselling(prev => !prev)} checked = {bestselling} type="checkbox" id="bestselling"/>
        <label className ="cursor-pointer" htmlFor="bestselling">Add to bestselling</label>
      </div>

      {/* New fields start here */}
      <div className="flex gap-2 mt-2">
        <input onChange={() => setIsNewArrival(prev => !prev)} checked={isNewArrival} type="checkbox" id="isNewArrival" />
        <label className="cursor-pointer" htmlFor="isNewArrival">Mark as New Arrival</label>
      </div>

      <div className='w-full'>
        <p className="text-md font-semibold mb-2">Fabric</p>
        <input onChange={(e) => setFabric(e.target.value)} value={fabric} className="w-full max-w-[500px] px-3 py-2" type="text" placeholder='Cotton, Silk, etc.' />
      </div>

      <div className='w-full'>
        <p className="text-md font-semibold mb-2">Availability</p>
        <select onChange={(e) => setAvailability(e.target.value)} value={availability} className="w-full max-w-[500px] px-3 py-2">
          <option value="In Stock">In Stock</option>
          <option value="Out of Stock">Out of Stock</option>
          <option value="Preorder">Preorder</option>
        </select>
      </div>

      <div className='w-full'>
        <p className="text-md font-semibold mb-2">Colors</p>
        <input
          onChange={(e) => setColors(e.target.value)}
          value={colors}
          className="w-full max-w-[500px] px-3 py-2"
          type="text"
          placeholder='#000000, #ffffff, #ff0000'
        />
      </div>

      <div className="w-full">
        <p className="text-md font-semibold mb-2">Tag</p>
        <select
          onChange={(e) => setTags([e.target.value])}
          value={tags[0] || ""}
          className="w-full max-w-[500px] px-3 py-2"
        >
          <option value="">Select a tag</option>
          <option value="Save 10%">Save 10%</option>
          <option value="Save 20%">Save 20%</option>
          <option value="Save 30%">Save 30%</option>
          <option value="Save 40%">Save 40%</option>
          <option value="Save 50%">Save 50%</option>
        </select>
      </div>
      <div className="w-full">
          <p className="text-md font-semibold mb-2">Suitable Body Types</p>
          <div className="flex flex-wrap gap-3">
            {["rectangle", "triangle", "inverted triangle", "spoon", "hourglass"].map((type) => (
              <div
                key={type}
                onClick={() => toggleBodyType(type)}
                className={`cursor-pointer px-3 py-1 rounded border ${
                  suitableBodyType.includes(type) ? "bg-gray-200" : "bg-slate-300"
                }`}
              >
                {type}
              </div>
            ))}
          </div>
        </div>

      <button type='submit' className='w-28 py-3 mt-4 bg-black text-white rounded-md hover:bg-white hover:text-black hover:border hover:border-black transition duration-200'> ADD </button>
    </form>
    
  )
}

export default Add
