import {useEffect, useState} from "react";
import {supabase} from "../SupabaseClient"; // Pastikan jalur impor benar

function ProductReservasion() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      let {data, error} = await supabase.from("products").select();
      if (error) throw error;
      setProducts(data); // Set data produk ke state
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  return (
    <>
      <div className="bg-gray-100 pb-10">
        <div className="w-full pt-14">
          <h2 className="text-center font-bold text-2xl text-gray-800">
            Reservasion <span className="text-xl text-gray-600">Camp</span>
          </h2>
        </div>

        <div className="grid px-10 md:px-28 grid-cols-1 gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 pt-10">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.id}
                className="bg-white border  border-gray-200 rounded-lg shadow-md hover:shadow-lg transition-shadow dark:bg-gray-800 dark:border-gray-700">
                <a href="#">
                  <img
                    className="rounded-t-lg w-full h-48 object-cover"
                    src={product.image_url || "https://via.placeholder.com/300"}
                    alt={product.name || "Product Image"}
                  />
                </a>
                <div className="p-5">
                  <h5 className="text-lg font-semibold text-gray-900 dark:text-white">{product.name}</h5>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between mt-4">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                      Rp. {product.harga ? product.harga.toLocaleString() : "0"} <span className="text-sm">/ Day</span>
                    </span>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-300">
                      Add to Cart
                    </button>
                  </div>
                  <div className="mt-3 text-sm text-gray-500 dark:text-gray-400">
                    <span>Stock: {product.stockProduct}</span>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <h2 className="text-center col-span-full text-gray-700 dark:text-gray-300">Tidak ada produk tersedia</h2>
          )}
        </div>
      </div>
    </>
  );
}

export default ProductReservasion;
