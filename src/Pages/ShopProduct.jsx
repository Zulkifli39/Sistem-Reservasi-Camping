const ShopProduct = () => {
  return (
    <div className="flex flex-col lg:flex-row items-center justify-between p-6 lg:p-12 bg-gray-100 min-h-screen">
      {/* Shopping Cart Section */}
      <div className="w-full lg:w-2/3 bg-white rounded-lg shadow-md p-6 mb-6 lg:mb-0">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Shopping Cart</h2>
        <table className="w-full text-left">
          <thead>
            <tr className="border-b">
              <th className="py-2 text-gray-600">Product</th>
              <th className="py-2 text-gray-600">Size</th>
              <th className="py-2 text-gray-600">Quantity</th>
              <th className="py-2 text-gray-600">Total Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {[
              {
                name: "Henley T-Shirt",
                color: "Dark Gray",
                sizeOptions: ["S", "M", "L"],
                quantity: 2,
                price: "$39.98",
              },
              {
                name: "High Top Sneakers",
                color: "Brown",
                sizeOptions: ["8", "9", "10"],
                quantity: 1,
                price: "$69.99",
              },
              {
                name: "Sweater Hooded",
                color: "Light Gray",
                sizeOptions: ["S", "M", "L"],
                quantity: 1,
                price: "$39.99",
              },
            ].map((product, index) => (
              <tr key={index} className="border-b hover:bg-gray-50">
                <td className="py-3">
                  <div>
                    <p className="font-medium text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.color}</p>
                  </div>
                </td>
                <td className="py-3">
                  <select className="border border-gray-300 rounded-lg p-1">
                    {product.sizeOptions.map((size, i) => (
                      <option key={i}>{size}</option>
                    ))}
                  </select>
                </td>
                <td className="py-3 flex items-center space-x-2">
                  <button className="bg-gray-200 px-2 py-1 rounded">-</button>
                  <span>{product.quantity}</span>
                  <button className="bg-gray-200 px-2 py-1 rounded">+</button>
                </td>
                <td className="py-3">{product.price}</td>
                <td className="py-3 text-red-500 cursor-pointer">×</td>
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
        <button className="mt-6 bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300">
          ← Continue Shopping
        </button>
      </div>

      {/* Payment Info Section */}
      <div className="w-full lg:w-1/3  bg-blue-900 text-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">Payment Info</h2>
        <div className="flex mb-4">
          <button className="flex-1 bg-blue-700 text-white py-2 rounded-l-lg focus:ring focus:ring-blue-500">
            Credit Card
          </button>
          <button className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-r-lg hover:bg-gray-200">PayPal</button>
        </div>
        <form className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Name On Card:</label>
            <input
              type="text"
              className="w-full bg-white text-gray-800 p-2 rounded-lg focus:ring focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm mb-1">Card Number:</label>
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
  );
};

export default ShopProduct;
