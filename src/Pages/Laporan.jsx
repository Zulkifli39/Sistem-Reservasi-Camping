import {useEffect, useState} from "react";
import {jsPDF} from "jspdf";
import {supabase} from "@/SupabaseClient";
import autoTable from "jspdf-autotable";

const Laporan = () => {
  const [dataReservasi, setDataReservasi] = useState([]);

  const fetchReservasiData = async () => {
    try {
      const {data, error} = await supabase.from("reservasi_data").select("*");
      if (error) throw error;
      setDataReservasi(data);
    } catch (error) {
      console.error("Error fetching reservasi data:", error);
    }
  };

  const handlePrintPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Laporan Reservasi", 14, 20);

    autoTable(doc, {
      startY: 30,
      head: [
        [
          "Nama Lengkap",
          "Nomor HP",
          "Jenis Alat",
          "Jumlah Alat",
          "Tanggal Reservasi",
          "Tanggal Pengembalian",
          "Total Harga",
          "Status",
        ],
      ],
      body: dataReservasi.map((item) => [
        item.NamaLengkap,
        item.NoHp,
        item.JenisAlat,
        item.JumlahAlat,
        item.TglReservasi,
        item.TglPengembalian,
        `Rp. ${item.TotalHarga}`,
        item.status,
      ]),
      styles: {fontSize: 10},
      headStyles: {fillColor: [41, 128, 185]}, // Warna biru untuk header
    });

    doc.save("laporan-reservasi.pdf");
  };

  useEffect(() => {
    fetchReservasiData();
  }, []);

  return (
    <div className=" mx-auto max-w-6xl p-6 bg-white shadow-lg rounded-2xl">
      <h1 className="text-3xl font-bold text-center mb-8">Laporan Reservasi</h1>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Nama Lengkap</th>
              <th className="py-2 px-4 border-b">Nomor HP</th>
              <th className="py-2 px-4 border-b">Jenis Alat</th>
              <th className="py-2 px-4 border-b">Jumlah Alat</th>
              <th className="py-2 px-4 border-b">Tanggal Reservasi</th>
              <th className="py-2 px-4 border-b">Tanggal Pengembalian</th>
              <th className="py-2 px-4 border-b">Total Harga</th>
              <th className="py-2 px-4 border-b">Status</th>
            </tr>
          </thead>
          <tbody>
            {dataReservasi.length > 0 ? (
              dataReservasi.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="py-2 px-4 border-b">{item.NamaLengkap}</td>
                  <td className="py-2 px-4 border-b">{item.NoHp}</td>
                  <td className="py-2 px-4 border-b">{item.JenisAlat}</td>
                  <td className="py-2 px-4 border-b">{item.JumlahAlat}</td>
                  <td className="py-2 px-4 border-b">{item.TglReservasi}</td>
                  <td className="py-2 px-4 border-b">{item.TglPengembalian}</td>
                  <td className="py-2 px-4 border-b">Rp. {item.TotalHarga}</td>
                  <td className="py-2 px-4 border-b">{item.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="py-4 text-gray-500 text-center">
                  Tidak ada data reservasi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={handlePrintPDF}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Cetak PDF
        </button>
      </div>
    </div>
  );
};

export default Laporan;
