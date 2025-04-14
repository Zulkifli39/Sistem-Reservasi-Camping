import React from "react";
import {FaMapMarkerAlt, FaClock, FaStar, FaHeart} from "react-icons/fa";

function PopularProduct() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white py-16 px-4 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-medium uppercase tracking-wider mb-3">
            Top Selling
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Popular Destinations</h2>
          <p className="text-gray-600 max-w-lg mx-auto">
            Explore our most popular destinations with the best deals and experiences.
          </p>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Rome, Italy",
              img: "src/assets/about1.jpeg",
              region: "Europe",
              price: "$5.42k",
              days: "10 Days Trip",
              rating: 4.8,
            },
            {
              title: "London, UK",
              img: "src/assets/about1.jpeg",
              region: "Europe",
              price: "$4.2k",
              days: "12 Days Trip",
              rating: 4.7,
            },
            {
              title: "Full Europe",
              img: "src/assets/about1.jpeg",
              region: "Europe",
              price: "$15k",
              days: "28 Days Trip",
              rating: 4.9,
            },
            {
              title: "Bali, Indonesia",
              img: "src/assets/about1.jpeg",
              region: "Asia",
              price: "$3.8k",
              days: "7 Days Trip",
              rating: 4.8,
            },
            {
              title: "Rome, Italy",
              img: "src/assets/about1.jpeg",
              region: "Europe",
              price: "$5.42k",
              days: "10 Days Trip",
              rating: 4.8,
            },
            {
              title: "London, UK",
              img: "src/assets/about1.jpeg",
              region: "Europe",
              price: "$4.2k",
              days: "12 Days Trip",
              rating: 4.7,
            },
            {
              title: "Full Europe",
              img: "src/assets/about1.jpeg",
              region: "Europe",
              price: "$15k",
              days: "28 Days Trip",
              rating: 4.9,
            },
            {
              title: "Bali, Indonesia",
              img: "src/assets/about1.jpeg",
              region: "Asia",
              price: "$3.8k",
              days: "7 Days Trip",
              rating: 4.8,
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 max-w-xs mx-auto">
              <div className="relative">
                <img src={item.img} className="h-48 w-full object-cover" alt={item.title} />
                <button className="absolute top-3 right-3 bg-white bg-opacity-70 p-2 rounded-full hover:bg-opacity-100 transition-all">
                  <FaHeart className="text-gray-400 hover:text-red-500 transition-colors" />
                </button>
                <div className="absolute bottom-3 left-3 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-lg">
                  {item.price}
                </div>
              </div>

              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-400" />
                    <span className="text-sm font-medium">{item.rating}</span>
                  </div>
                </div>

                <div className="flex items-center text-gray-500 text-sm mb-3">
                  <FaMapMarkerAlt className="text-green-500 mr-1" />
                  <span>{item.region}</span>
                </div>

                <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                  <div className="flex items-center gap-1 text-gray-500 text-sm">
                    <FaClock className="text-gray-400" />
                    <span>{item.days}</span>
                  </div>
                  <button className="text-sm font-medium text-green-600 hover:text-green-700">View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PopularProduct;
