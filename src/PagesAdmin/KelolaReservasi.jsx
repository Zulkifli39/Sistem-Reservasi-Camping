import {useState, useEffect} from "react";
import {supabase} from "@/SupabaseClient";
import Swal from "sweetalert2";

const KelolaReservasi = () => {
  const [reservasi, setReservasi] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const [isUpdating, setIsUpdating] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showImageModal, setShowImageModal] = useState(false);

  useEffect(() => {
    fetchReservasi();
  }, []);

  const fetchReservasi = async () => {
    try {
      let {data, error} = await supabase.from("reservasi_data").select().eq("isHidden", false); // Hanya ambil data yang tidak disembunyikan
      if (error) throw error;
      const sortedData = data.sort((a, b) => new Date(b.TglReservasi) - new Date(a.TglReservasi));
      setReservasi(sortedData);
    } catch (error) {
      console.error("Error fetching reservasi:", error);
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      setReservasi((prevReservasi) =>
        prevReservasi.map((item) => (item.id === id ? {...item, status: newStatus} : item))
      );
      setIsUpdating(true);

      const {error} = await supabase.from("reservasi_data").update({status: newStatus}).eq("id", id);
      if (error) throw error;

      let message = "";
      switch (newStatus) {
        case "Silahkan Diambil":
          message = "Reservasi berhasil diterima!";
          break;
        case "Sudah Dikembalikan":
          message = "Reservasi berhasil diselesaikan!";
          break;
        case "Ditolak":
          message = "Reservasi berhasil ditolak!";
          break;
        default:
          message = "Status berhasil diupdate!";
      }

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: message,
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      console.error("Error updating status:", error);
      fetchReservasi();
    } finally {
      setIsUpdating(false);
    }
  };

  const handleAcceptReservation = (id) => {
    Swal.fire({
      title: `Konfirmasi`,
      text: "Apakah Anda yakin ingin menerima reservasi ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, terima!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        updateStatus(id, "Silahkan Diambil");
      }
    });
  };

  const handleRejectReservation = (id) => {
    Swal.fire({
      title: `Konfirmasi`,
      text: "Apakah Anda yakin ingin menolak reservasi ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, tolak!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        updateStatus(id, "Ditolak");
      }
    });
  };

  const handleCompleteReservation = (id) => {
    Swal.fire({
      title: `Konfirmasi`,
      text: "Tandai reservasi ini sebagai selesai?",
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, selesaikan!",
      cancelButtonText: "Batal",
    }).then((result) => {
      if (result.isConfirmed) {
        updateStatus(id, "Sudah Dikembalikan");
      }
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Apakah kamu yakin?",
      text: "Reservasi ini akan disembunyikan dari tampilan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, sembunyikan!",
    }).then((result) => {
      if (result.isConfirmed) {
        hideReservasi(id);
      }
    });
  };

  const hideReservasi = async (id) => {
    try {
      setIsUpdating(true);
      // Perbarui isHidden menjadi true di database
      const {error} = await supabase.from("reservasi_data").update({isHidden: true}).eq("id", id);
      if (error) throw error;

      // Hapus dari state lokal
      setReservasi((prevReservasi) => prevReservasi.filter((item) => item.id !== id));

      Swal.fire({
        icon: "success",
        title: "Dihapus",
        text: "Data reservasi telah dihapus / disembunyikan dari tampilan Anda.",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      console.error("Error hiding reservation:", error);
      fetchReservasi();
    } finally {
      setIsUpdating(false);
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

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReservasi = reservasi.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(reservasi.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [reservasi, totalPages, currentPage]);

  return (
    <div className="-mt-10 lg:mt-4 min-h-screen px-2 lg:px-0">
      <div className="max-w-full mx-auto">
        <h2 className="text-xl md:text-3xl font-bold text-gray-800 dark:text-gray-200 mb-4 md:mb-6 px-2">
          Data Reservasi
        </h2>

        {/* Desktop Table View */}
        <div className="hidden lg:block rounded-lg border border-gray-200 bg-white">
          <div className="overflow-x-auto">
            <table className="w-full divide-y-2 divide-gray-200 text-sm">
              <thead className="bg-gray-200">
                <tr>
                  <th className="px-4 py-3 font-medium text-left text-gray-600">Nama</th>
                  <th className="px-4 py-3 font-medium text-left text-gray-600">Telepon</th>
                  <th className="px-4 py-3 font-medium text-left text-gray-600">Reservasi</th>
                  <th className="px-4 py-3 font-medium text-left text-gray-600">Pengembalian</th>
                  <th className="px-4 py-3 font-medium text-left text-gray-600">Alat</th>
                  <th className="px-4 py-3 font-medium text-center text-gray-600">Jumlah</th>
                  <th className="px-4 py-3 font-medium text-right text-gray-600">Total</th>
                  <th className="px-4 py-3 font-medium text-center text-gray-600">Pembayaran</th>
                  <th className="px-4 py-3 font-medium text-center text-gray-600">Status</th>
                  <th className="px-4 py-3 font-medium text-center text-gray-600">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {currentReservasi && currentReservasi.length > 0 ? (
                  currentReservasi.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-medium text-gray-700">{item.NamaLengkap}</td>
                      <td className="px-4 py-3 text-gray-700">{item.NoHp}</td>
                      <td className="px-4 py-3 text-gray-700">{item.TglReservasi}</td>
                      <td className="px-4 py-3 text-gray-700">{item.TglPengembalian}</td>
                      <td className="px-4 py-3 text-gray-700">
                        {Array.isArray(item.JenisAlat) ? (
                          <div className="space-y-1">
                            {item.JenisAlat.map((alat, index) => (
                              <div key={index}>
                                {alat.quantity}x {alat.name}
                              </div>
                            ))}
                          </div>
                        ) : (
                          item.JenisAlat
                        )}
                      </td>
                      <td className="px-4 py-3 text-center text-gray-700">
                        {Array.isArray(item.JenisAlat)
                          ? item.JenisAlat.reduce((sum, alat) => sum + alat.quantity, 0)
                          : item.JumlahAlat}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700 font-medium">
                        Rp {Number(item.TotalHarga).toLocaleString("id-ID")}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {item.BuktiPembayaran ? (
                          <div className="cursor-pointer" onClick={() => openImageModal(item.BuktiPembayaran)}>
                            <img
                              src={item.BuktiPembayaran}
                              alt="Bukti"
                              className="h-12 w-16 object-cover rounded-md mx-auto hover:opacity-80 transition-opacity"
                            />
                            <span className="text-xs text-blue-600 block mt-1">Lihat</span>
                          </div>
                        ) : (
                          <span className="text-gray-500">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            item.status === "Silahkan Diambil"
                              ? "bg-blue-100 text-blue-700"
                              : item.status === "Sudah Dikembalikan"
                              ? "bg-green-100 text-green-700"
                              : item.status === "Ditolak"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}>
                          {item.status || "Menunggu Konfirmasi"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-col space-y-2">
                          <button
                            onClick={() => handleAcceptReservation(item.id)}
                            disabled={
                              isUpdating ||
                              item.status === "Silahkan Diambil" ||
                              item.status === "Sudah Dikembalikan" ||
                              item.status === "Ditolak"
                            }
                            className={`px-3 py-1 text-white text-xs rounded transition-colors ${
                              isUpdating ||
                              item.status === "Silahkan Diambil" ||
                              item.status === "Sudah Dikembalikan" ||
                              item.status === "Ditolak"
                                ? "bg-green-300 cursor-not-allowed"
                                : "bg-green-500 hover:bg-green-600"
                            }`}>
                            Terima
                          </button>
                          <button
                            onClick={() => handleRejectReservation(item.id)}
                            disabled={isUpdating || item.status === "Ditolak" || item.status === "Sudah Dikembalikan"}
                            className={`px-3 py-1 text-white text-xs rounded transition-colors ${
                              isUpdating || item.status === "Ditolak" || item.status === "Sudah Dikembalikan"
                                ? "bg-red-300 cursor-not-allowed"
                                : "bg-red-500 hover:bg-red-600"
                            }`}>
                            Tolak
                          </button>
                          <button
                            onClick={() => handleCompleteReservation(item.id)}
                            disabled={
                              isUpdating ||
                              item.status === "Sudah Dikembalikan" ||
                              item.status === "Ditolak" ||
                              item.status !== "Silahkan Diambil"
                            }
                            className={`px-3 py-1 text-white text-xs rounded transition-colors ${
                              isUpdating ||
                              item.status === "Sudah Dikembalikan" ||
                              item.status === "Ditolak" ||
                              item.status !== "Silahkan Diambil"
                                ? "bg-green-300 cursor-not-allowed"
                                : "bg-green-700 hover:bg-green-800"
                            }`}>
                            Selesai
                          </button>
                          <button
                            onClick={() => handleDelete(item.id)}
                            disabled={isUpdating}
                            className={`px-3 py-1 text-white text-xs rounded transition-colors ${
                              isUpdating ? "bg-gray-300 cursor-not-allowed" : "bg-gray-500 hover:bg-gray-600"
                            }`}>
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="10" className="px-4 py-8 text-center text-gray-500">
                      Tidak ada data reservasi
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Mobile Card View */}
        <div className="lg:hidden space-y-4">
          {currentReservasi && currentReservasi.length > 0 ? (
            currentReservasi.map((item) => (
              <div key={item.id} className="bg-white border border-gray-200 rounded-lg shadow-sm">
                <div className="px-4 py-3 border-b border-gray-100 bg-gray-50 rounded-t-lg">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-800 text-sm">{item.NamaLengkap}</h3>
                      <p className="text-xs text-gray-600 mt-1">{item.NoHp}</p>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.status === "Silahkan Diambil"
                          ? "bg-blue-100 text-blue-700"
                          : item.status === "Sudah Dikembalikan"
                          ? "bg-green-100 text-green-700"
                          : item.status === "Ditolak"
                          ? "bg-red-100 text-red-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                      {item.status === "Silahkan Diambil"
                        ? "Siap Ambil"
                        : item.status === "Sudah Dikembalikan"
                        ? "Selesai"
                        : item.status === "Ditolak"
                        ? "Ditolak"
                        : "Menunggu"}
                    </span>
                  </div>
                </div>
                <div className="px-4 py-3 space-y-3">
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-gray-500 block">Tgl Reservasi</span>
                      <span className="font-medium text-gray-800">
                        {new Date(item.TglReservasi).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                        })}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 block">Tgl Kembali</span>
                      <span className="font-medium text-gray-800">
                        {new Date(item.TglPengembalian).toLocaleDateString("id-ID", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500 text-xs block mb-1">Alat</span>
                    <div className="text-sm text-gray-800">
                      {Array.isArray(item.JenisAlat) ? (
                        <div className="space-y-1">
                          {item.JenisAlat.map((alat, index) => (
                            <div key={index} className="flex justify-between">
                              <span>{alat.name}</span>
                              <span className="font-medium">{alat.quantity}x</span>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div>{item.JenisAlat}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div>
                      <span className="text-gray-500 text-xs block">Total Harga</span>
                      <span className="font-bold text-green-600 text-sm">
                        Rp {Number(item.TotalHarga).toLocaleString("id-ID")}
                      </span>
                    </div>
                    <div className="text-center">
                      {item.BuktiPembayaran ? (
                        <div className="cursor-pointer" onClick={() => openImageModal(item.BuktiPembayaran)}>
                          <img
                            src={item.BuktiPembayaran}
                            alt="Bukti"
                            className="h-12 w-16 object-cover rounded-md hover:opacity-80 transition-opacity"
                          />
                          <span className="text-xs text-blue-600 block mt-1">Lihat Bukti</span>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-500">Tidak ada bukti</span>
                      )}
                    </div>
                  </div>
                </div>
                <div className="px-4 py-3 border-t border-gray-100 bg-gray-50 rounded-b-lg">
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <button
                      onClick={() => handleAcceptReservation(item.id)}
                      disabled={
                        isUpdating ||
                        item.status === "Silahkan Diambil" ||
                        item.status === "Sudah Dikembalikan" ||
                        item.status === "Ditolak"
                      }
                      className={`py-2 text-white text-xs rounded transition-colors ${
                        isUpdating ||
                        item.status === "Silahkan Diambil" ||
                        item.status === "Sudah Dikembalikan" ||
                        item.status === "Ditolak"
                          ? "bg-green-300 cursor-not-allowed"
                          : "bg-green-500 hover:bg-green-600"
                      }`}>
                      Terima
                    </button>
                    <button
                      onClick={() => handleRejectReservation(item.id)}
                      disabled={isUpdating || item.status === "Ditolak" || item.status === "Sudah Dikembalikan"}
                      className={`py-2 text-white text-xs rounded transition-colors ${
                        isUpdating || item.status === "Ditolak" || item.status === "Sudah Dikembalikan"
                          ? "bg-red-300 cursor-not-allowed"
                          : "bg-red-500 hover:bg-red-600"
                      }`}>
                      Tolak
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => handleCompleteReservation(item.id)}
                      disabled={
                        isUpdating ||
                        item.status === "Sudah Dikembalikan" ||
                        item.status === "Ditolak" ||
                        item.status !== "Silahkan Diambil"
                      }
                      className={`py-2 text-white text-xs rounded transition-colors ${
                        isUpdating ||
                        item.status === "Sudah Dikembalikan" ||
                        item.status === "Ditolak" ||
                        item.status !== "Silahkan Diambil"
                          ? "bg-green-300 cursor-not-allowed"
                          : "bg-green-700 hover:bg-green-800"
                      }`}>
                      Selesai
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={isUpdating}
                      className={`py-2 text-white text-xs rounded transition-colors ${
                        isUpdating ? "bg-gray-300 cursor-not-allowed" : "bg-gray-500 hover:bg-gray-600"
                      }`}>
                      Sembunyikan
                    </button>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">Tidak ada data reservasi</div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {reservasi.length > 0 && (
        <div className="mt-4 bg-white rounded-lg border border-gray-200 px-4 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
            <div className="text-xs text-gray-500">
              Menampilkan {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, reservasi.length)} dari {reservasi.length}{" "}
              data
            </div>
            <ol className="flex gap-1 text-xs font-medium">
              <li>
                <button
                  onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                  <span className="sr-only">Prev Page</span>←
                </button>
              </li>
              {Array.from({length: Math.min(5, totalPages)}, (_, index) => {
                let pageNumber;
                if (totalPages <= 5) {
                  pageNumber = index + 1;
                } else if (currentPage <= 3) {
                  pageNumber = index + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + index;
                } else {
                  pageNumber = currentPage - 2 + index;
                }

                return (
                  <li key={pageNumber}>
                    <button
                      onClick={() => paginate(pageNumber)}
                      className={`inline-flex h-8 w-8 items-center justify-center rounded border ${
                        currentPage === pageNumber
                          ? "bg-black text-white border-black"
                          : "border-gray-100 hover:bg-gray-50"
                      }`}>
                      {pageNumber}
                    </button>
                  </li>
                );
              })}
              <li>
                <button
                  onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                  <span className="sr-only">Next Page</span>→
                </button>
              </li>
            </ol>
          </div>
        </div>
      )}

      {/* Image Modal */}
      {showImageModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-4 rounded-lg max-w-3xl w-full max-h-[90vh] overflow-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg md:text-xl font-semibold">Bukti Pembayaran</h3>
              <button onClick={closeImageModal} className="text-gray-500 hover:text-gray-700 p-1">
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
              <img
                src={selectedImage}
                alt="Bukti Pembayaran"
                className="max-h-[60vh] w-auto object-contain rounded-md"
              />
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
    </div>
  );
};

export default KelolaReservasi;
