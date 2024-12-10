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
      <div className=" bg-white pb-10">
        <div className="w-full pt-14 ">
          <h2 className="text-center font-bold text-2xl">
            Reservasion <span className="text-xl">Camp</span>
          </h2>
          <div></div>
        </div>

        <div className="grid px-10  grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 pt-12  ">
          {products.length > 0 ? (
            products.map((product) => (
              <div
                key={product.id}
                className="w-64 mx-auto max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                <a href="#">
                  <img className=" rounded-t-lg w-full h-44 " src={product.image_url} alt={product.name} />
                </a>
                <div className=" pb-5 mt-4">
                  <h5 className="text-xl font-semibold tracking-tight text-gray-900 dark:text-white">{product.name}</h5>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{product.description}</p>
                  <div className="flex items-center justify-between mt-2 mb-4">
                    <span className="font-bold text-xl">{product.stockProduct}</span>
                  </div>
                  <div className="flex items-center  justify-between">
                    <span className="text-xl font-bold text-gray-900 dark:text-white">Rp.{product.harga} / Day</span>
                    <button className="text-white font-medium  bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300  rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                      Add cart
                    </button>
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
