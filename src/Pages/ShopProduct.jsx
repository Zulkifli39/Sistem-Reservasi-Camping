import {Link} from "react-router-dom";
import {IoMdAdd, IoMdRemove} from "react-icons/io";

const ShopProduct = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between lg:p-12 bg-gray-100 min-h-screen">
      {/* Shopping Cart Section */}
      <div className="flex w-full flex-col lg:flex-row">
        <div className="w-full lg:w-2/3 bg-white rounded-lg shadow-md p-6 lg:mb-0">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 mt-20 text-center lg:text-start lg:mt-0">
            Reservasi Cart
          </h2>
          <hr className="border-2 border-gray-200" />
          <table className="w-full text-left mt-2 lg:mt-0">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-gray-600">Product</th>
                <th className="py-2 text-gray-600">Price</th>
                <th className="py-2 text-gray-600">Total</th>
              </tr>
            </thead>
            <tbody>
              {[
                {
                  name: "Henley T-Shirt",
                  img: "https://i.pinimg.com/736x/32/9a/79/329a79dc185a4c8ef8c66035e19f860d.jpg",
                  price: "$39.98",
                },
                {
                  name: "High Top Sneakers",
                  img: "https://i.pinimg.com/736x/32/9a/79/329a79dc185a4c8ef8c66035e19f860d.jpg",
                  price: "$69.99",
                },
                {
                  name: "Sweater Hooded",
                  img: "https://i.pinimg.com/736x/32/9a/79/329a79dc185a4c8ef8c66035e19f860d.jpg",
                  price: "$39.99",
                },
              ].map((product, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3">
                    <div className="flex flex-col lg:flex-row lg:items-center">
                      <img className="w-16 h-16 rounded-md" src={product.img} alt={`${product.name}`} />
                      <div className="w-28 lg:ml-4 mt-4 lg:mt-0">
                        <p className="font-medium text-gray-800">{product.name}</p>
                      </div>
                      <div className="flex w-full items-center ">
                        <div className="flex lg:mx-auto ">
                          <IoMdAdd className="w-5 h-5 bg-green-800 rounded-md text-white" />
                          <span className="mx-2 text-gray-600">1</span>
                          <IoMdRemove className="w-5 h-5 bg-red-800  rounded text-white" />
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-gray-800">{product.price}</td>
                  <td className="py-3 text-red-500 cursor-pointer">Rp.0000</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-6">
            <div className="flex justify-between text-gray-700">
              <p>Subtotal:</p>
              <p>$149.96</p>
            </div>
            <div className="flex justify-between text-gray-700">
              <p>Shipping:</p>
              <p>$0</p>
            </div>
            <div className="flex justify-between text-gray-800 font-bold text-lg mt-2">
              <p>Total:</p>
              <p>$149.96</p>
            </div>
          </div>
          <button className="mt-6 bg-blue-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300">
            <Link to="/">← Continue Reservation</Link>
          </button>
        </div>

        {/* Payment Info Section */}
        <div className="w-full lg:w-1/3 bg-blue-900 text-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Reservasi Info</h2>
          {/* <div className="flex mb-4 mt-6">
            <button className="flex-1 bg-blue-700 text-white py-2 rounded-l-lg focus:ring focus:ring-blue-500">
              Credit Card
            </button>
            <button className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-r-lg hover:bg-gray-200">PayPal</button>
          </div> */}
          <form className="space-y-8">
            {/* <div>
              <label className="block text-sm mb-1">Name On Card:</label>
              <input
                type="text"
                className="w-full bg-white text-gray-800 p-2 rounded-lg focus:ring focus:ring-blue-500"
              />
            </div> */}
            <div>
              <label className="block text-sm mb-1">Full Name Reservasi:</label>
              <input
                type="text"
                className="w-full bg-white text-gray-800 p-2 rounded-lg focus:ring focus:ring-blue-500"
              />
            </div>
            <div className="flex space-x-4">
              <div className="flex-1">
                <label className="block text-sm mb-1">Expiration Date:</label>
                <input
                  type="text"
                  className="w-full bg-white text-gray-800 p-2 rounded-lg focus:ring focus:ring-blue-500"
                />
              </div>
              <div className="flex-1">
                <label className="block text-sm mb-1">CVV:</label>
                <input
                  type="text"
                  className="w-full bg-white text-gray-800 p-2 rounded-lg focus:ring focus:ring-blue-500"
                />
              </div>
            </div>
            <button className="w-full bg-blue-500 py-2 rounded-lg hover:bg-blue-600">Check Out</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShopProduct;
