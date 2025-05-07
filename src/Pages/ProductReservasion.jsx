import {useEffect, useState} from "react";
import {supabase} from "@/SupabaseClient";
import {useNavigate} from "react-router-dom";
import {toast, ToastContainer} from "react-toastify";
import {FaSearch, FaShoppingCart, FaLeaf, FaCalendarAlt, FaTags, FaBoxOpen} from "react-icons/fa";

function ProductReservation() {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [userName, setUserName] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    ambilProduk();
    const storedUserName = sessionStorage.getItem("username");
    if (storedUserName) {
      setUserName(storedUserName);
    }

    // Mengambil keranjang dari localStorage saat komponen dimuat
    const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(savedCart);
  }, []);

  const ambilProduk = async () => {
    setLoading(true);
    try {
      let {data, error} = await supabase.from("products").select();
      if (error) throw error;
      setProducts(data);
    } catch (error) {
      console.error("Error mengambil produk:", error);
      toast.error("Gagal memuat produk, silakan coba lagi");
    } finally {
      setLoading(false);
    }
  };

  const tambahKeKeranjang = (product) => {
    if (!userName) {
      toast.info("Silakan login terlebih dahulu");
      navigate("/login");
      return;
    }

    if (product.stockProduct > 0) {
      const isProductInCart = cart.some((item) => item.id === product.id);

      if (isProductInCart) {
        toast.info(`${product.name} sudah ada di keranjang Anda`);
        return;
      }

      const keranjangBaru = [...cart, product];
      setCart(keranjangBaru);
      localStorage.setItem("cart", JSON.stringify(keranjangBaru));
      toast.success(`${product.name} ditambahkan ke keranjang!`);
    } else {
      toast.error("Produk ini sudah habis stok.");
    }
  };

  // Filter produk berdasarkan pencarian dan kategori
  const filteredProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  // Ekstrak kategori unik dari produk
  const categories = ["all", ...new Set(products.map((product) => product.category).filter(Boolean))];

  return (
    <div className="bg-gradient-to-b from-gray-50 to-gray-100 min-h-screen pb-16" id="product">
      <ToastContainer position="bottom-right" autoClose={3000} />

      {/* Hero Section */}
      <div className="bg-yellow-800 text-white py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <h1 className="text-3xl md:text-4xl font-bold mb-4">Sewa Perlengkapan Camping</h1>
              <p className="text-green-100 mb-6">
                Dapatkan perlengkapan camping berkualitas untuk petualangan luar ruang Anda. Reservasi mudah dengan
                harga terjangkau.
              </p>
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari perlengkapan camping..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-4 py-3 pr-10 rounded-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500"
                />
                <FaSearch className="absolute right-3 top-3.5 text-gray-500" />
              </div>
            </div>
            <div className="md:w-1/3">
              <div className="bg-white bg-opacity-20 p-6 rounded-lg backdrop-blur-sm">
                <div className="flex items-center mb-4">
                  <FaLeaf className="text-2xl mr-3" />
                  <div>
                    <h3 className="font-semibold">Ramah Lingkungan</h3>
                    <p className="text-sm text-green-100">Perlengkapan berkualitas dan terawat</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <FaCalendarAlt className="text-2xl mr-3" />
                  <div>
                    <h3 className="font-semibold">Reservasi Fleksibel</h3>
                    <p className="text-sm text-green-100">Pilih tanggal sesuai kebutuhan Anda</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="container mx-auto max-w-6xl px-4 pt-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center">
            <FaTags className="mr-2 text-[eb6725]" />
            Kategori Perlengkapan
          </h2>
          <div className="flex items-center">
            <span className="text-gray-600 mr-2">
              {cart.length > 0 && (
                <button
                  onClick={() => navigate("/shop")}
                  className="flex items-center px-4 py-2 bg-[#f19647] text-white rounded-lg  transition-colors">
                  <FaShoppingCart className="mr-2" />
                  <span>{cart.length} item</span>
                </button>
              )}
            </span>
          </div>
        </div>

        <div className="flex overflow-x-auto pb-4 scrollbar-hide space-x-2 mb-6">
          {categories.map((category, index) => (
            <button
              key={index}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-full whitespace-nowrap text-sm font-medium transition-colors ${
                selectedCategory === category ? "bg-[#f19647] text-white" : "bg-white text-gray-700 hover:bg-gray-100"
              }`}>
              {category === "all" ? "Semua Kategori" : category}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <div className="container mx-auto max-w-6xl px-4">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
          </div>
        ) : (
          <>
            {filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <div
                    key={product.id}
                    className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
                    <div className="relative">
                      <img
                        className="w-full h-48 object-cover"
                        src={product.image_url || "/api/placeholder/400/300"}
                        alt={product.name || "Gambar Produk"}
                      />
                      {/* Menampilkan Stok Terbatas Jika Kurang Dari 5  */}
                      {product.stockProduct <= 5 && product.stockProduct > 0 && (
                        <div className="absolute top-3 left-3 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-md">
                          Stok Terbatas
                        </div>
                      )}
                      {/* Menampilkan Informasi Jika Stok Sudah Habis */}
                      {product.stockProduct === 0 && (
                        <div className="absolute inset-0 bg-gray-900 bg-opacity-60 flex items-center justify-center">
                          <span className="bg-red-600 text-white px-3 py-1 rounded-md font-bold">Habis</span>
                        </div>
                      )}
                    </div>

                    <div className="p-5">
                      <div className="flex items-center text-xs text-gray-500 mb-2">
                        <span className="bg-gray-100 px-2 py-1 rounded">{product.category}</span>
                      </div>

                      <h3 className="text-lg font-semibold text-gray-800 mb-2">{product.name}</h3>

                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {product.description || "Tidak ada deskripsi"}
                      </p>

                      <div className="flex items-center justify-between mt-auto">
                        <div>
                          <p className="text-[#f19647] font-bold text-lg">
                            Rp {product.harga ? product.harga.toLocaleString() : "0"}
                          </p>
                          <p className="text-xs text-gray-500">per hari</p>
                        </div>

                        <div className="flex items-center">
                          <div className="flex items-center text-sm text-gray-500 mr-3">
                            <FaBoxOpen className="mr-1" />
                            <span>{product.stockProduct}</span>
                          </div>

                          {userName && product.stockProduct > 0 && (
                            <button
                              className="px-3 py-2 text-sm font-medium text-white bg-[#f19647] rounded-lg hover:bg-black transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                              onClick={() => tambahKeKeranjang(product)}>
                              Reservasi
                            </button>
                          )}

                          {!userName && product.stockProduct > 0 && (
                            <button
                              className="px-3 py-2 text-sm font-medium text-white bg-[#f19647] rounded-lg hover:bg-black transition-colors focus:outline-none focus:ring-2 focus:ring-green-500"
                              onClick={() => navigate("/login")}>
                              Login
                            </button>
                          )}

                          {/* Menampilkan Tombol Habis Jika Stok Sudah Habis */}
                          {product.stockProduct === 0 && (
                            <button
                              className="px-3 py-2 text-sm font-medium text-gray-500 bg-gray-200 rounded-lg cursor-not-allowed"
                              disabled>
                              Habis
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <FaSearch className="mx-auto text-4xl text-gray-300 mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">Produk tidak ditemukan</h3>
                <p className="text-gray-500">
                  Tidak ada produk yang sesuai dengan pencarian &quot;{searchTerm}&quot; dalam kategori{" "}
                  {selectedCategory === "all" ? "Semua Kategori" : selectedCategory}
                </p>
                <button
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                  }}
                  className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all">
                  Reset Pencarian
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

export default ProductReservation;
