import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import arrowupIcon from "../assets/weui_arrow-outlinedup.svg";

const CustomerSupport = () => {
  const { section } = useParams();
  const navigate = useNavigate();

  // Decode section name (Replace hyphens with spaces)
  const decodedSection = section ? section.replace(/-/g, " ") : null;

  const [selectedSection, setSelectedSection] = useState(decodedSection);
  const [openSubSection, setOpenSubSection] = useState(null);
  const [showFeedbackPopup, setShowFeedbackPopup] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState("");

  const handleFeedback = (message) => {
    setFeedbackMessage(message);
    setShowFeedbackPopup(true);
    setTimeout(() => {
      setShowFeedbackPopup(false);
    }, 1000); // Auto close after 1 seconds
  };

  useEffect(() => {
    setSelectedSection(decodedSection);
  }, [decodedSection]);

 // Sidebar items
const sidebarItems = [
  "Contact us",
  "How to shop",
  "Orders and delivery",
  "Payment and pricing",
  "Returns and refunds",
  "FAQs",
  "Terms and conditions",
  "Privacy policy",
];

// Subsections for each section
const sectionSubSections = {
  "Contact us": [
    {
      title: "Customer Support",
      content: (
        <div>
          <h3 className="font-medium mb-2">Email service hours:</h3>
          <ul className="list-disc pl-5 mb-4">
            <li>Sunday to Friday: 9am to 6pm NPT</li>
            <li>Closed on Saturdays and public holidays</li>
          </ul>
          <p>You can reach our support team at: <span className="font-medium">support@fashionfit.np</span></p>
        </div>
      )
    },
    {
      title: "Phone Support",
      content: (
        <div>
          <h3 className="font-medium mb-2">Phone service hours:</h3>
          <ul className="list-disc pl-5 mb-4">
            <li>Sunday to Friday: 10am to 5pm NPT</li>
          </ul>
          <p>Call us at: <span className="font-medium">+977-1-9876543</span> (Kathmandu)</p>
          <p className="mt-2">Toll-free: <span className="font-medium">1660-01-FAFASH</span></p>
        </div>
      )
    },
  ],
  "How to shop": [
    {
      title: "Creating an Account",
      content: (
        <div>
          <h3 className="font-medium mb-2">Getting started is easy:</h3>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Click 'Sign Up' in the top right corner</li>
            <li>Enter your email and create a password</li>
          </ol>
        </div>
      )
    },
    {
      title: "Finding Products",
      content: (
        <div>
          <h3 className="font-medium mb-2">Browse our collection:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Use the search bar for specific items</li>
            <li>Filter by category, fabric, color, or body shape</li>
            <li>Explore AI-recommended fashion styles</li>
            <li>Save items to your wishlist—even without logging in</li>
          </ul>
        </div>
      )
    },
    {
      title: "Get personalized style suggestions",
      content: (
        <div>
          <p>Upload a full-body photo and let our AI suggest outfits tailored to your body shape, preferences, and the latest trends.</p>
        </div>
      ),
    },
    {
      title: "Save your favorites",
      content: (
        <div>
          <p>You can add products to your wishlist with a single tap—even without logging in! Create an account later to save your list permanently.</p>
        </div>
      ),
    },
  ],
  "Orders and delivery": [
    {
      title: "Order Processing",
      content: (
        <div>
          <h3 className="font-medium mb-2">What to expect after ordering:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Order confirmation email immediately</li>
            <li>Processing time: 1-2 business days</li>
            <li>Kathmandu Valley: 1–3 days</li>
            <li>Outside Valley: 3–6 days</li>
            <li>AI bundle processing may take slightly longer</li>
          </ul>
          <p className="mt-3">Note: Delivery may delay during festivals and road blockades.</p>
        </div>
      )
    },
    {
      title: "Delivery support",
      content: (
        <div>
          <p>If your delivery is delayed or you face any issues, contact our support team with your order ID or AI request reference. We’ll resolve it promptly.</p>
        </div>
      ),
    },
  ],
  "Payment and pricing": [
    {
      title: "Accepted Payment Methods",
      content: (
        <div>
          <h3 className="font-medium mb-2">We currently support:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>PayPal (international payment)</li>
          </ul>
          <p className="mt-3">All transactions are securely processed via PayPal in US Dollars ($).</p>
        </div>
      )
    },
    {
      title: "Currency & Pricing",
      content: (
        <div>
          <h3 className="font-medium mb-2">Pricing details:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>All prices are displayed in US Dollars ($)</li>
            <li>PayPal handles currency conversion if your local currency is NPR</li>
            <li>Prices include applicable taxes and service fees</li>
            <li>Exchange rates may vary based on PayPal’s conversion rate</li>
          </ul>
          <p className="mt-3">Tip: You can use an exchange rate calculator to estimate NPR costs.</p>
        </div>
      )
    },
    {
      title: "Discounts & Coupons",
      content: (
        <div>
          <h3 className="font-medium mb-2">Available offers:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Festival promotions up to 30% off</li>
            <li>AI-recommended outfit bundle discounts</li>
            <li>Refer a friend and earn $1.50 in credits</li>
          </ul>
          <p className="mt-3">Enter promo codes during checkout to apply discounts.</p>
        </div>
      )
    },
  ],
  "Returns and refunds": [
    {
      title: "Returns Policy",
      content: (
        <div>
          <h3 className="font-medium mb-2">Our return guidelines:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>7-day return window from delivery date</li>
            <li>Items must be unused with original packaging</li>
            <li>Original invoice required</li>
            <li>Customized AI-recommended outfits are exchangeable only</li>
          </ul>
        </div>
      )
    },
    {
      title: "How to Return",
      content: (
        <div>
          <h3 className="font-medium mb-2">Return process:</h3>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Request a return via profile page or call us</li>
            <li>Provide order details and reason</li>
            <li>Wait for pickup confirmation</li>
            <li>Refund issued after item quality check</li>
          </ol>
        </div>
      )
    },
  ],
  "FAQs": [
    {
      title: "Common Questions",
      content: (
        <div>
          <h3 className="font-medium mb-2">Frequently asked:</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Do I need an account to use AI suggestions?</h4>
              <p className="text-gray-600">No, but login helps save your preferences permanently.</p>
            </div>
            <div>
              <h4 className="font-medium">What is your COD limit?</h4>
              <p className="text-gray-600">We do not support COD currently. All payments go through PayPal.</p>
            </div>
            <div>
              <h4 className="font-medium">Can I track my AI outfit order?</h4>
              <p className="text-gray-600">Yes. We will SMS/email tracking details once shipped.</p>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Troubleshooting",
      content: (
        <div>
          <h3 className="font-medium mb-2">Problem solving:</h3>
          <div className="space-y-4">
            <div>
              <h4 className="font-medium">Didn’t receive order confirmation?</h4>
              <p className="text-gray-600">Check your SMS or email. If not received, please contact support.</p>
            </div>
            <div>
              <h4 className="font-medium">AI suggestion doesn't look accurate?</h4>
              <p className="text-gray-600">Try re-uploading your image or contact us for manual suggestions.</p>
            </div>
            <div>
              <h4 className="font-medium">Received damaged/wrong item?</h4>
              <p className="text-gray-600">Please send us a photo within 24 hours of delivery.</p>
            </div>
          </div>
        </div>
      )
    },
  ],
  "Terms and conditions": [
    {
      title: "Usage Policies",
      content: (
        <div>
          <h3 className="font-medium mb-2">Website terms:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>By using our site, you agree to these terms</li>
            <li>Content is for personal, non-commercial use only</li>
            <li>You must be 18+ to place an order</li>
            <li>Uploading images for AI suggestions implies data processing consent</li>
          </ul>
        </div>
      )
    },
    {
      title: "Legal Agreements",
      content: (
        <div>
          <h3 className="font-medium mb-2">Important notices:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>All products are sold "as is"</li>
            <li>AI suggestions are advisory and not guaranteed to fit</li>
            <li>Disputes resolved under Kathmandu jurisdiction</li>
            <li>Governing law: Nepal laws</li>
          </ul>
        </div>
      )
    },
  ],
  "Privacy policy": [
    {
      title: "Data Collection",
      content: (
        <div>
          <h3 className="font-medium mb-2">Information we collect:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Email and contact info</li>
            <li>Shipping address</li>
            <li>Body images for AI suggestions (deleted after 24 hrs unless consented)</li>
            <li>Order and search history</li>
          </ul>
        </div>
      )
    },
    {
      title: "Your Rights",
      content: (
        <div>
          <h3 className="font-medium mb-2">Your privacy controls:</h3>
          <ul className="list-disc pl-5 space-y-2">
            <li>Access and modify your data</li>
            <li>Request account or data deletion</li>
            <li>Revoke image processing consent</li>
            <li>Unsubscribe from email promotions</li>
          </ul>
        </div>
      )
    },
  ],
};


  return (
    <div className="flex flex-col md:flex-row p-8 space-x-10">
      {/* Sidebar */}
      <div className="w-full md:w-1/4">
        <ul className="space-y-3 text-gray-700">
          {sidebarItems.map((item) => (
            <li
              key={item}
              className={`cursor-pointer hover:underline ${
                selectedSection === item ? "font-bold" : ""
              }`}
              onClick={() => navigate(`/${item.replace(/\s+/g, "-")}`)} // Convert spaces to hyphens
            >
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Main Content */}
      <div className="w-full md:w-3/4">
        <h1 className="text-2xl font-semibold mb-6">{selectedSection || "Select a section"}</h1>

        {/* Expandable subsections */}
        {selectedSection && sectionSubSections[selectedSection] ? (
          sectionSubSections[selectedSection].map((subSection, index) => (
            <div key={index} className="border-b py-4">
              <button
                className="flex justify-between items-center w-full text-lg font-medium cursor-pointer"
                onClick={() =>
                  setOpenSubSection(openSubSection === index ? null : index)
                }
              >
                {subSection.title}
                <img
                  src={arrowupIcon}
                  alt="arrow"
                  className={`ml-2 w-4 h-4 transform transition-transform ${
                    openSubSection === index ? "rotate-180" : "rotate-0"
                  }`}
                />
              </button>
              {openSubSection === index && (
                <p className="mt-2 text-gray-600">{subSection.content}</p>
              )}
            </div>
          ))
        ) : (
          <p className="text-gray-600">Please select a valid section from the sidebar.</p>
        )}
        {/* Feedback Section */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold mb-3">Tell us what you think</h2>
          <p className="text-gray-600">Was this content helpful?</p>
          <div className="mt-2 space-x-4">
          <button
            onClick={() => handleFeedback("Thank you so much for your positive feedback! We're glad this information was helpful to you.")}
            className="px-4 py-2 border rounded-md hover:bg-gray-200 cursor-pointer"
          >
            Yes
          </button>
          <button
            onClick={() => handleFeedback("Thank you for your feedback. We're sorry this wasn't helpful - we'll keep working to improve your experience.")}
            className="px-4 py-2 border rounded-md hover:bg-gray-200 cursor-pointer"
          >
            Not really
          </button>
        </div>
        </div>
        {showFeedbackPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Semi-transparent background to reduce brightness */}
          <div className="absolute inset-0 bg-black/20 backdrop-blur-sm"></div>

          {/* Actual popup */}
          <div className="relative bg-white px-6 py-4 rounded-lg shadow-lg z-10 max-w-sm w-full text-center">
            <p className="text-gray-800 font-medium">{feedbackMessage}</p>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default CustomerSupport;
