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
  const [showEditProduct, setShowEditProduct] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Number of items to display per page

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

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentProducts = products.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="  -mt-10 lg:mt-4   min-h-screen">
      <div className="flex justify-between">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800 dark:text-gray-200">Data Product</h2>

        <button
          onClick={handleToggleAddProduct}
          className="bg-green-600 text-white px-6 py-2 rounded-lg mb-2 lg:mb-6 hover:bg-blue-700 transition-colors duration-200">
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

      <div className="rounded-lg border  border-gray-200">
        <div className="overflow-x-auto rounded-t-lg">
          <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
            <thead className="ltr:text-left rtl:text-right bg-gray-200">
              <tr>
                <th className="px-4 py-2 font-medium whitespace-nowrap text-gray-600">ID</th>
                <th className="px-4 py-2 font-medium whitespace-nowrap text-gray-600">NAMA</th>
                <th className="px-4 py-2 font-medium whitespace-nowrap text-gray-600">DESCRIPTION</th>
                <th className="px-4 py-2 font-medium whitespace-nowrap text-gray-600">STOCK</th>
                <th className="px-4 py-2 font-medium whitespace-nowrap text-gray-600">HARGA</th>
                <th className="px-4 py-2 font-medium whitespace-nowrap text-gray-600">IMAGE</th>
                <th className="px-4 py-2 font-medium whitespace-nowrap text-gray-600">ACTIONS</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {currentProducts && currentProducts.length > 0 ? (
                currentProducts.map((product) => (
                  <tr key={product.id}>
                    <td className="px-4 py-2 text-center font-medium whitespace-nowrap text-gray-700">{product.id}</td>
                    <td className="px-4 py-2 text-center whitespace-nowrap text-gray-700">{product.name}</td>
                    <td className="px-4 py-2 text-center whitespace-nowrap text-gray-700">{product.description}</td>
                    <td className="px-4 py-2 text-center whitespace-nowrap text-gray-700">{product.stockProduct}</td>
                    <td className="px-4 py-2 text-center whitespace-nowrap text-gray-700">{product.harga}</td>
                    <td className="px-4 py-2 text-center whitespace-nowrap text-gray-700">
                      <div className="flex justify-center">
                        {product.image_url ? (
                          <img
                            src={product.image_url}
                            alt={product.name}
                            className="h-12 w-16 object-cover rounded-md"
                          />
                        ) : (
                          <span className="text-gray-500">No image</span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap text-gray-700">
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
          <div className="rounded-b-lg border-t   border-gray-200 px-4 py-2">
            <ol className="flex justify-end gap-1 text-xs font-medium">
              <li>
                <button
                  onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="inline-flex size-8 items-center justify-center rounded-sm border border-gray-100 bg-white text-gray-900 rtl:rotate-180">
                  <span className="sr-only">Prev Page</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-3" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </li>

              {[...Array(totalPages).keys()].map((number) => (
                <li key={number + 1}>
                  {currentPage === number + 1 ? (
                    <span className="block size-8 rounded-sm border-blue-600 bg-blue-600 text-center leading-8 text-white">
                      {number + 1}
                    </span>
                  ) : (
                    <button
                      onClick={() => paginate(number + 1)}
                      className="block size-8 rounded-sm border border-gray-100 bg-white text-center leading-8 text-gray-900">
                      {number + 1}
                    </button>
                  )}
                </li>
              ))}

              <li>
                <button
                  onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="inline-flex size-8 items-center justify-center rounded-sm border border-gray-100 bg-white text-gray-900 rtl:rotate-180">
                  <span className="sr-only">Next Page</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="size-3" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductPage;
