import {useState, useEffect} from "react";
import {supabase} from "@/SupabaseClient";

const KelolaReservasi = () => {
  const [reservasi, setReservasi] = useState([]);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Number of items to display per page

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

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentReservasi = reservasi.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(reservasi.length / itemsPerPage);

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

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
                    <td className="px-4 py-2 whitespace-nowrap text-gray-700">{item.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="px-4 py-4 text-center text-gray-500">
                    No reservasi data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {reservasi.length > 0 && (
          <div className="rounded-b-lg border-t border-gray-200 px-4 py-2">
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

export default KelolaReservasi;
