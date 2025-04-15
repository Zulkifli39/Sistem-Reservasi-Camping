import React from "react";
import {FaMapMarkerAlt, FaClock, FaStar, FaHeart} from "react-icons/fa";

function PopularProduct() {
  return (
    <div className="bg-gradient-to-b from-gray-50 to-white pt-4 pb-14 px-4 lg:px-8">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-600 text-xs font-medium uppercase tracking-wider mb-3">
            Top Reservasi
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Popular Reservasions</h2>
          <p className="text-gray-600 max-w-lg mx-auto">
            Explore our most popular reservasions with the best deals and experiences.
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
            },
            {
              title: "London, UK",
              img: "src/assets/about1.jpeg",
              price: "$4.2k",
              days: "12 Days Trip",
            },
            {
              title: "Full Europe",
              img: "src/assets/about1.jpeg",
              price: "$15k",
              days: "28 Days Trip",
            },
            {
              title: "Bali, Indonesia",
              img: "src/assets/about1.jpeg",
              price: "$3.8k",
              days: "7 Days Trip",
            },
          ].map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 w-full  mx-auto">
              <div className="relative">
                <img src={item.img} className="h-40 w-full object-cover" alt={item.title} />
                <div className="absolute bottom-3 left-3 bg-green-600 text-white text-xs font-bold px-2 py-1 rounded-lg">
                  {item.price}
                </div>
              </div>
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-lg font-semibold text-gray-800">{item.title}</h3>
                  <div className="flex items-center gap-1">
                    <FaStar className="text-yellow-400" />
                  </div>
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
