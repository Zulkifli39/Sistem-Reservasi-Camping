import {useEffect, useState} from "react";
import {supabase} from "@/SupabaseClient";
import {FaClock, FaStar} from "react-icons/fa";
import {BsFire} from "react-icons/bs";

const PopularProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const {data, error} = await supabase.from("reservasi_data").select("JenisAlat, JumlahAlat, TglReservasi, gambar");

      // console.log("Data dari Supabase:", data);
      if (error) throw error;

      const today = new Date();
      const sevenDaysAgo = new Date(today);
      sevenDaysAgo.setDate(today.getDate() - 7);

      const popularItems = [];
      data.forEach((item) => {
        // Pastikan JenisAlat adalah array dan ambil elemen pertama
        const jenisArray = Array.isArray(item.JenisAlat) ? item.JenisAlat : [];
        const jenis = jenisArray.length > 0 ? jenisArray[0] : null;

        if (jenis) {
          const quantity = jenis.quantity || item.JumlahAlat || 0; // Gunakan quantity dari JSON atau JumlahAlat sebagai fallback
          if (quantity > 10) {
            // Kriteria populer
            popularItems.push({
              title: jenis.name || "Tidak diketahui",
              total: quantity,
              img: jenis.image_url || item.gambar || "https://via.placeholder.com/150",
              price: `${quantity}x Reservasi`,
              isPopular: true,
              days: "Populer minggu ini",
            });
          }
        }
      });

      // console.log("Popular items:", popularItems);
      setProducts(popularItems);
    } catch (err) {
      console.error("Gagal mengambil data:", err.message, err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white pt-4 pb-14 px-4 lg:px-8" id="popular">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <div className="inline-block px-3 py-2 rounded-full bg-black text-[#f19647] text-xs font-medium uppercase tracking-wider mb-3">
            Top Reservasi
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Reservasi Populer Minggu Ini</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading && <div className="col-span-full text-center text-gray-500">Memuat data...</div>}
          {!loading && products.length === 0 && (
            <div className="col-span-full text-center text-gray-500">Tidak ada alat populer minggu ini.</div>
          )}
          {!loading &&
            products.map((item, index) => (
              <div
                key={index}
                className="bg-white border border-gray-200 rounded-lg shadow hover:shadow-lg transition relative">
                <div className="relative">
                  <img src={item.img} className="h-40 w-full object-cover rounded-t-lg" alt={item.title} />
                  <div className="absolute bottom-3 left-3 bg-[#f19647] text-white text-xs font-bold px-2 py-1 rounded-lg">
                    {item.price}
                  </div>
                  {item.isPopular && (
                    <div className="absolute top-3 right-3 flex items-center gap-1 bg-yellow-500 text-white text-xs px-2 py-1 rounded-full shadow-md animate-pulse">
                      <BsFire className="text-white" />
                      <span>Populer</span>
                    </div>
                  )}
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
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default PopularProduct;
