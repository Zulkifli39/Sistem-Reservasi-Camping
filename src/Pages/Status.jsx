import {useState, useEffect} from "react";
import {supabase} from "@/SupabaseClient";

const Status = () => {
  const [informasi, setInformasi] = useState([]);
  const [userId, setUserId] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    fetchUserId();
  }, []);

  useEffect(() => {
    if (userId) {
      fetchInformasi();
    }
  }, [userId]);

  // Fungsi untuk mendapatkan user_id pengguna yang sedang login
  const fetchUserId = async () => {
    try {
      const {
        data: {session},
      } = await supabase.auth.getSession();

      if (session) {
        setUserId(session.user.id); // Simpan user_id dari sesi pengguna
      } else {
        console.error("Pengguna tidak login.");
      }
    } catch (error) {
      console.error("Error fetching user ID:", error);
    }
  };

  // Fungsi untuk mengambil data reservasi berdasarkan user_id
  const fetchInformasi = async () => {
    try {
      let {data, error} = await supabase.from("reservasi_data").select().eq("user_id", userId); // Filter berdasarkan user_id

      if (error) throw error;
      // Urutkan data berdasarkan TglReservasi terbaru
      const sortedData = data.sort((a, b) => new Date(b.TglReservasi) - new Date(a.TglReservasi));
      setInformasi(sortedData);
    } catch (error) {
      console.error("Error fetching reservasi:", error);
    }
  };

  const openImageModal = (imageUrl) => {
    setSelectedImage(imageUrl);
    setShowImageModal(true);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8 mt-16">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-gray-900 text-center mb-12 animate-fade-in">Informasi Reservasi</h1>

        {informasi.length > 0 ? (
          <div className="space-y-6">
            {informasi.map((item) => (
              <div
                key={item.id}
                className="bg-white p-6 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 animate-slide-up">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-gray-700">
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-500">Nama Pemesan</span>
                    <span className="text-lg font-medium">{item.NamaLengkap}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-500">Nomor HP</span>
                    <span className="text-lg font-medium">{item.NoHp}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-500">Jenis Alat</span>
                    <div className="text-lg font-medium">
                      {Array.isArray(item.JenisAlat)
                        ? item.JenisAlat.map((alat, index) => (
                            <div key={index}>
                              {alat.quantity}x {alat.name}
                            </div>
                          ))
                        : item.JenisAlat}
                    </div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-500">Jumlah Total Alat</span>
                    <span className="text-lg font-medium">
                      {Array.isArray(item.JenisAlat)
                        ? item.JenisAlat.reduce((sum, alat) => sum + alat.quantity, 0)
                        : item.JumlahAlat}
                    </span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-500">Tanggal Reservasi</span>
                    <span className="text-lg font-medium">{item.TglReservasi}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-500">Tanggal Pengembalian</span>
                    <span className="text-lg font-medium">{item.TglPengembalian}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-500">Total Harga</span>
                    <span className="text-lg font-medium">Rp {item.TotalHarga.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-500">Bukti Pembayaran</span>
                    {item.BuktiPembayaran ? (
                      <div className="cursor-pointer mt-1" onClick={() => openImageModal(item.BuktiPembayaran)}>
                        <img
                          src={item.BuktiPembayaran}
                          alt="Bukti Pembayaran"
                          className="h-12 w-16 object-cover rounded-md hover:opacity-80 transition-opacity"
                        />
                        <span className="text-xs text-blue-600 block mt-1">Lihat</span>
                      </div>
                    ) : (
                      <span className="text-gray-500 text-sm mt-1">Belum ada</span>
                    )}
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold text-gray-500">Status Alat</span>
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-sm font-semibold mt-1 ${
                        item.status === "Silahkan Diambil"
                          ? "bg-blue-100 text-blue-700"
                          : item.status === "Sudah Dikembalikan"
                          ? "bg-green-100 text-green-600"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                      {item.status || "Menunggu Konfirmasi"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center bg-white p-8 rounded-2xl shadow-lg animate-fade-in">
            <p className="text-lg text-gray-500">No reservasi data available</p>
            <p className="text-sm text-gray-400 mt-2">Silakan buat reservasi baru untuk memulai.</p>
          </div>
        )}
      </div>

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded-lg max-w-3xl w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Bukti Pembayaran</h3>
              <button onClick={closeImageModal} className="text-gray-500 hover:text-gray-700">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="flex justify-center">
              <img src={selectedImage} alt="Bukti Pembayaran" className="max-h-96 object-contain" />
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={closeImageModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors">
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Animation Styles */}
      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fade-in {
          animation: fadeIn 0.5s ease-in-out;
        }
        @keyframes slideUp {
          from {
            transform: translateY(10px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slideUp 0.5s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Status;
