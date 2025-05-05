import {useEffect, useState} from "react";
import {supabase} from "../SupabaseClient";
import {FaEdit, FaTrash} from "react-icons/fa";
import TambahProduct from "./FormProduct/TambahProduct";
import EditProduct from "./FormProduct/EditProduct";
import Swal from "sweetalert2";

const ProductPage = () => {
  const [products, setProducts] = useState([]);
  const [showAddProduct, setShowAddProduct] = useState(false);
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      let {data, error} = await supabase.from("products").select();
      if (error) throw error;
      setProducts(data);
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
      fetchProducts();
    } catch (error) {
      Swal.fire("Error!", error.message, "error");
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="min-h-screen -mt-10 lg:mt-4 ">
      <div className="flex justify-between mb-6">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200">Data Product</h2>
        <button
          onClick={handleToggleAddProduct}
          className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors duration-200">
          Tambah Alat
        </button>
      </div>

      {showAddProduct && (
        <TambahProduct onProductAdded={handleProductAdded} isOpen={showAddProduct} onClose={handleToggleAddProduct} />
      )}

      {showEditProduct && selectedProduct && (
        <EditProduct
          product={selectedProduct}
          isOpen={showEditProduct}
          onClose={() => setShowEditProduct(false)}
          onProductUpdated={handleProductUpdated}
        />
      )}

      <div className="relative overflow-x-auto">
        <table className="w-full text-sm text-center text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-1 md:px-4 py-3">
                Id
              </th>
              <th scope="col" className="px-1 md:px-4 py-3">
                Nama
              </th>
              <th scope="col" className="px-1 md:px-4 py-3 hidden md:table-cell">
                Deskripsi
              </th>
              <th scope="col" className="px-1 md:px-4 py-3">
                Stock
              </th>
              <th scope="col" className="px-1 md:px-4 py-3">
                Harga
              </th>
              <th scope="col" className="px-1 md:px-4 py-3 hidden md:table-cell">
                Image
              </th>
              <th scope="col" className="px-1 md:px-4 py-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentProducts && currentProducts.length > 0 ? (
              currentProducts.map((product) => (
                <tr
                  key={product.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600">
                  <th scope="row" className="px-4 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                    {product.id}
                  </th>
                  <td className="px-2 md:px-4 py-4">{product.name}</td>
                  <td className="px-2 md:px-4 py-4 hidden md:table-cell">{product.description}</td>
                  <td className="px-2 md:px-4 py-4">{product.stockProduct}</td>
                  <td className="px-2  md:px-4 py-4">{product.harga}</td>
                  <td className="px-2 md:px-4 py-4 hidden md:table-cell">
                    {product.image_url ? (
                      <div className="flex justify-center">
                        <img src={product.image_url} alt={product.name} className="h-12 w-16 object-cover rounded-md" />
                      </div>
                    ) : (
                      <span className="text-gray-500">No image</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex flex-col md:flex-row items-center justify-center space-y-2 md:space-y-0 md:space-x-2">
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
                <td colSpan="7" className="px-4 py-4 text-center text-gray-500">
                  No products available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {products.length > 0 && (
        <div className="flex justify-end mt-4">
          <nav aria-label="Page navigation">
            <ul className="flex items-center -space-x-px h-10 text-base">
              <li>
                <button
                  onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="flex items-center justify-center px-4 h-10 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                  <span className="sr-only">Previous</span>
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10">
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 1 1 5l4 4"
                    />
                  </svg>
                </button>
              </li>
              {[...Array(totalPages).keys()].map((number) => (
                <li key={number + 1}>
                  <button
                    onClick={() => paginate(number + 1)}
                    className={`flex items-center justify-center px-4 h-10 leading-tight ${
                      currentPage === number + 1
                        ? "text-blue-600 border border-gray-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
                        : "text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
                    }`}>
                    {number + 1}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="flex items-center justify-center px-4 h-10 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                  <span className="sr-only">Next</span>
                  <svg
                    className="w-3 h-3"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10">
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                </button>
              </li>
            </ul>
          </nav>
        </div>
      )}
    </div>
  );
};

export default ProductPage;
