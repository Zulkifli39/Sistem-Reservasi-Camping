import {useState, useEffect} from "react";
import {supabase} from "@/SupabaseClient";
import Swal from "sweetalert2";

const KelolaReservasi = () => {
  const [reservasi, setReservasi] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    fetchReservasi();
  }, []);

  const fetchReservasi = async () => {
    try {
      let {data, error} = await supabase.from("reservasi_data").select();
      if (error) throw error;
      setReservasi(data);
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
    } catch (error) {
      console.error("Error updating status:", error);
      fetchReservasi();
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Apakah kamu yakin?",
      text: "Reservasi ini akan dihapus secara permanen!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
    }).then((result) => {
      if (result.isConfirmed) {
        deleteReservasi(id);
      }
    });
  };

  const deleteReservasi = async (id) => {
    try {
      setIsUpdating(true);
      setReservasi((prevReservasi) => prevReservasi.filter((item) => item.id !== id));

      const {error} = await supabase.from("reservasi_data").delete().eq("id", id);
      if (error) throw error;

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Reservasi berhasil dihapus!",
        showConfirmButton: false,
        timer: 2000,
      });
    } catch (error) {
      console.error("Error deleting reservation:", error);
      fetchReservasi();
    } finally {
      setIsUpdating(false);
    }
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
    <div className="p-6 bg-gray-100 min-h-screen ml-0 md:ml-64">
      <h2 className="text-3xl font-semibold text-gray-700 mb-6">Data Reservasi</h2>

      <div className="rounded-lg border border-gray-200">
        <div className="overflow-x-auto rounded-t-lg">
          <table className="min-w-full divide-y-2 divide-gray-200 bg-white text-sm">
            <thead className="ltr:text-left rtl:text-right bg-gray-200">
              <tr>
                <th className="px-4 py-2 font-medium whitespace-nowrap text-gray-600">Nama</th>
                <th className="px-4 py-2 font-medium whitespace-nowrap text-gray-600">Telepon</th>
                <th className="px-4 py-2 font-medium whitespace-nowrap text-gray-600">Reservasi</th>
                <th className="px-4 py-2 font-medium whitespace-nowrap text-gray-600">Pengembalian</th>
                <th className="px-4 py-2 font-medium whitespace-nowrap text-gray-600">Alat</th>
                <th className="px-4 py-2 font-medium whitespace-nowrap text-gray-600">Jumlah</th>
                <th className="px-4 py-2 font-medium whitespace-nowrap text-gray-600">Total</th>
                <th className="px-4 py-2 font-medium whitespace-nowrap text-gray-600">Pembayaran</th>
                <th className="px-4 py-2 font-medium whitespace-nowrap text-gray-600">Status</th>
                <th className="px-4 py-2 font-medium whitespace-nowrap text-gray-600">Aksi</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-200">
              {currentReservasi && currentReservasi.length > 0 ? (
                currentReservasi.map((item) => (
                  <tr key={item.id}>
                    <td className="px-4 py-2 text-center font-medium whitespace-nowrap text-gray-700">
                      {item.NamaLengkap}
                    </td>
                    <td className="px-4 py-2 text-center whitespace-nowrap text-gray-700">{item.NoHp}</td>
                    <td className="px-4 py-2 text-center whitespace-nowrap text-gray-700">{item.TglReservasi}</td>
                    <td className="px-4 py-2 text-center whitespace-nowrap text-gray-700">{item.TglPengembalian}</td>
                    <td className="px-4 py-2 text-center whitespace-nowrap text-gray-700">{item.JenisAlat}</td>
                    <td className="px-4 py-2 text-center whitespace-nowrap text-gray-700">{item.JumlahAlat}</td>
                    <td className="px-4 py-2 text-center whitespace-nowrap text-gray-700">{item.TotalHarga}</td>
                    <td className="px-4 py-2 text-center whitespace-nowrap text-gray-700">
                      {item.BuktiPembayaran ? (
                        <img
                          src={item.BuktiPembayaran}
                          alt="Bukti Pembayaran"
                          className="h-12 w-16 object-cover rounded-md mx-auto"
                        />
                      ) : (
                        <span className="text-gray-500">No Image</span>
                      )}
                    </td>
                    <td className="px-4 py-2 whitespace-nowrap">
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium 
                        ${
                          item.status === "Silahkan Diambil"
                            ? "bg-green-100 text-green-700"
                            : item.status === "Sudah Dikembalikan"
                            ? "bg-red-100 text-red-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}>
                        {item.status || "pending"}
                      </span>
                    </td>

                    <td className="px-4 py-2 whitespace-nowrap">
                      <div className="flex-col md:flex space-y-2">
                        <button
                          onClick={() => updateStatus(item.id, "Silahkan Diambil")}
                          disabled={isUpdating || item.status === "Silahkan Diambil"}
                          className={`w-full px-3 py-1 text-white text-xs rounded transition-colors ${
                            isUpdating || item.status === "Silahkan Diambil"
                              ? "bg-green-300 cursor-not-allowed"
                              : "bg-green-500 hover:bg-green-600"
                          }`}>
                          Approve
                        </button>
                        <button
                          onClick={() => updateStatus(item.id, "Sudah Dikembalikan")}
                          disabled={isUpdating || item.status === "Sudah Dikembalikan"}
                          className={`w-full px-3 py-1 text-white text-xs rounded transition-colors ${
                            isUpdating || item.status === "Sudah Dikembalikan"
                              ? "bg-green-300 cursor-not-allowed"
                              : "bg-green-700 hover:bg-green-800"
                          }`}>
                          Done
                        </button>
                        <button
                          onClick={() => handleDelete(item.id)}
                          disabled={isUpdating}
                          className={`w-full px-3 py-1 text-white text-xs rounded transition-colors 
                            ${isUpdating ? "bg-red-300 cursor-not-allowed" : "bg-red-500 hover:bg-red-600"}`}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="10" className="px-4 py-4 text-center text-gray-500">
                    No reservasi data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {reservasi.length > 0 && (
          <div className="rounded-b-lg border-t bg-white border-gray-200 px-4 py-2">
            <ol className="flex justify-end gap-1 text-xs font-medium">
              <li>
                <button
                  onClick={() => currentPage > 1 && paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100">
                  <span className="sr-only">Prev Page</span>
                  &larr;
                </button>
              </li>
              {Array.from({length: totalPages}, (_, index) => (
                <li key={index + 1}>
                  <button
                    onClick={() => paginate(index + 1)}
                    className={`inline-flex h-8 w-8 items-center justify-center rounded border ${
                      currentPage === index + 1 ? "bg-black text-white border-black" : "border-gray-100"
                    }`}>
                    {index + 1}
                  </button>
                </li>
              ))}
              <li>
                <button
                  onClick={() => currentPage < totalPages && paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="inline-flex h-8 w-8 items-center justify-center rounded border border-gray-100">
                  <span className="sr-only">Next Page</span>
                  &rarr;
                </button>
              </li>
            </ol>
          </div>
        )}
      </div>
    </div>
  );
};

export default KelolaReservasi;
