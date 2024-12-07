import {useEffect, useState} from "react";
import {supabase} from "../SupabaseClient";
import {FaEdit, FaTrash} from "react-icons/fa";
import TambahProduct from "./FormProduct/TambahProduct";
import EditProduct from "./FormProduct/EditProduct";
// SweetAlert
import Swal from "sweetalert2";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false); // State untuk form edit
  const [selectedProduct, setSelectedProduct] = useState(null); // State untuk produk yang akan diedit

  // Fetch data from Supabase
  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      let {data, error} = await supabase.from("products").select();
      if (error) throw error;
      setProducts(data); // Set the products in state
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleToggleAddProduct = () => {
    setShowAddProduct(!showAddProduct);
  };

  const handleProductAdded = () => {
    fetchProducts();
    setShowAddProduct(false);
  };

  const handleEditClick = (product) => {
    setSelectedProduct(product);
    setShowEditProduct(true);
  };

  const handleProductUpdated = () => {
    fetchProducts();
    setShowEditProduct(false);
    setSelectedProduct(null);
  };

  const deleteProduct = async (product) => {
    try {
      const confirmation = await Swal.fire({
        title: "Are you sure?",
        text: "Do you really want to delete this product?",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Yes, delete it!",
      });

      if (!confirmation.isConfirmed) return;

      const {error} = await supabase.from("products").delete().eq("id", product.id);
      if (error) throw error;

      Swal.fire("Deleted!", "The product has been deleted.", "success");
      fetchProducts(); // Refresh data setelah penghapusan
    } catch (error) {
      Swal.fire("Error!", error.message, "error");
    }
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen mt-12">
      <h2 className="text-3xl font-semibold text-gray-700 mb-6">Product Management</h2>

      <button
        onClick={handleToggleAddProduct}
        className="bg-green-600 text-white px-6 py-2 rounded-lg mb-6 hover:bg-blue-700 transition-colors duration-200">
        Tambah Product
      </button>

      {/* Untuk Mengatur Open dan Close Tambah Produk Dan Menampilkan bagian Tambah Product yang sudah dibuat  */}
      {showAddProduct && (
        <TambahProduct onProductAdded={handleProductAdded} isOpen={showAddProduct} onClose={handleToggleAddProduct} />
      )}

      {/* Untuk Mengatur open dan close Edit Produk Sama dengan Tambah Produk */}
      {showEditProduct && selectedProduct && (
        <EditProduct
          product={selectedProduct}
          isOpen={showEditProduct}
          onClose={() => setShowEditProduct(false)}
          onProductUpdated={handleProductUpdated}
        />
      )}

      <div className="overflow-x-auto mt-4">
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="  bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-center text-gray-600 font-semibold">ID</th>
              <th className="px-6 py-3 text-center text-gray-600 font-semibold">Name</th>
              <th className="px-6 py-3 text-center text-gray-600 font-semibold">Description</th>
              <th className="px-6 py-3 text-center text-gray-600 font-semibold">Stock</th>
              <th className="px-6 py-3 text-center text-gray-600 font-semibold">Harga</th>
              <th className="px-6 py-3 text-center  text-gray-600 font-semibold">Image</th>
              <th className="px-6 py-3 text-center text-gray-600 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products && products.length > 0 ? (
              products.map((product) => (
                <tr key={product.id} className="border-t hover:bg-gray-100 transition-colors duration-150">
                  <td className="px-6 py-4 text-center text-black">{product.id}</td>
                  <td className="px-6 py-4 text-center text-black">{product.name}</td>
                  <td className="px-6 py-4 text-center text-black">{product.description}</td>
                  <td className="px-6 py-4 text-center text-black">{product.stockProduct}</td>
                  <td className="px-6 py-4 text-center text-black">{product.harga}</td>
                  <td className="px-6 py-4   ">
                    <div className="flex justify-center">
                      {product.image_url ? (
                        <img
                          src={product.image_url} // Gunakan image_url dari database
                          alt={product.name}
                          className="h-16 w-20  object-cover rounded-md "
                        />
                      ) : (
                        <span className="text-gray-500">No image</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-cemter justify-center space-x-2">
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
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center text-gray-500 py-6">
                  No products available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProductPage;
