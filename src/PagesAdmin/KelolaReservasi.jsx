const KelolaReservasi = () => {
  return (
    <div className="p-6 bg-gray-100 min-h-screen mt-12">
      <h2 className="text-3xl font-semibold text-gray-700 mb-6">Product Management</h2>

      <button className="bg-green-600 text-white px-6 py-2 rounded-lg mb-6 hover:bg-blue-700 transition-colors duration-200">
        Tambah Product
      </button>

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-center text-gray-600 font-semibold">ID</th>
              <th className="px-6 py-3 text-center text-gray-600 font-semibold">Name</th>
              <th className="px-6 py-3 text-center text-gray-600 font-semibold">Description</th>
              <th className="px-6 py-3 text-center text-gray-600 font-semibold">Stock</th>
              <th className="px-6 py-3 text-center text-gray-600 font-semibold">Harga</th>
              <th className="px-6 py-3 text-center text-gray-600 font-semibold">Image</th>
              <th className="px-6 py-3 text-center text-gray-600 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr key={product.id} className="border-t hover:bg-gray-100 transition-colors duration-150">
              <td className="px-6 py-4 text-center text-black">{product.id}</td>
              <td className="px-6 py-4 text-center text-black">{product.name}</td>
              <td className="px-6 py-4 text-center text-black">{product.description}</td>
              <td className="px-6 py-4 text-center text-black">{product.stockProduct}</td>
              <td className="px-6 py-4 text-center text-black">{product.harga}</td>
              <td className="px-6 py-4">
                <div className="flex justify-center">
                  {product.image_url ? (
                    <img src={product.image_url} alt={product.name} className="h-16 w-20 object-cover rounded-md" />
                  ) : (
                    <span className="text-gray-500">No image</span>
                  )}
                </div>
              </td>
              <td className="px-6 py-4 text-center">
                <div className="flex items-center justify-center space-x-2">
                  <button
                    onClick={() => handleEditClick(product)}
                    className="bg-yellow-500 text-white px-3 py-1 rounded-full hover:bg-yellow-600 flex items-center">
                    <FaEdit className="mr-1" /> Edit
                  </button>
                  <button
                    onClick={() => deleteProduct(product)}
                    className="bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600 flex items-center">
                    <FaTrash className="mr-1" /> Delete
                  </button>
                </div>
              </td>
            </tr>
            <tr>
              <td colSpan="7" className="text-center text-gray-500 py-6">
                No products available
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default KelolaReservasi;
