import {useState, useEffect} from "react";
import {supabase} from "@/SupabaseClient";

const KelolaReservasi = () => {
  const [reservasi, setReservasi] = useState([]);

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

  return (
    <div className="p-6 bg-gray-100 min-h-screen mt-12">
      <h2 className="text-3xl font-semibold text-gray-700 mb-6">Data Reservasi</h2>

      <button className="bg-green-600 text-white px-6 py-2 rounded-lg mb-6 hover:bg-blue-700 transition-colors duration-200">
        Edit Reservasi
      </button>

      {/* Tabel Reservasi */}
      {reservasi && reservasi.length > 0 ? (
        <table className="min-w-full bg-white shadow-md rounded-lg overflow-hidden">
          <thead className="bg-gray-200">
            <tr>
              <th className="px-6 py-3 text-center text-gray-600 font-semibold">Nama</th>
              <th className="px-6 py-3 text-center text-gray-600 font-semibold">Telepon</th>
              <th className="px-6 py-3 text-center text-gray-600 font-semibold">Tanggal Reservasi</th>
              <th className="px-6 py-3 text-center text-gray-600 font-semibold">Tanggal Pengembalian</th>
              <th className="px-6 py-3 text-center text-gray-600 font-semibold">Jenis Alat</th>
              <th className="px-6 py-3 text-center text-gray-600 font-semibold">Jumlah Alat</th>
              <th className="px-6 py-3 text-center text-gray-600 font-semibold">Total</th>
              <th className="px-6 py-3 text-center text-gray-600 font-semibold">Bukti Pembayaran</th>
              <th className="px-6 py-3 text-center text-gray-600 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {reservasi.map((item) => (
              <tr key={item.id}>
                <td className="text-black">{item.NamaLengkap}</td>
                <td>{item.NoHp}</td>
                <td>{item.TglReservasi}</td>
                <td>{item.TglPengembalian}</td>
                <td>{item.JenisAlat}</td>
                <td>{item.JumlahAlat}</td>
                <td>{item.TotalHarga}</td>
                <td>
                  {item.BuktiPembayaran ? (
                    <img src={item.BuktiPembayaran} alt="Bukti Pembayaran" className="w-16 h-16" />
                  ) : (
                    <p>No Image</p>
                  )}
                </td>
                <td>{item.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No products available</p>
      )}
    </div>
  );
};

export default KelolaReservasi;
