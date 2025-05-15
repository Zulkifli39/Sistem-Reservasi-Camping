import {useState, useEffect} from "react";
import {jsPDF} from "jspdf";
import {supabase} from "@/SupabaseClient";
import autoTable from "jspdf-autotable";

const Laporan = () => {
  const [dataReservasi, setDataReservasi] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  const itemsPerPage = 5;
  const months = [
    {value: "01", label: "Januari"},
    {value: "02", label: "Februari"},
    {value: "03", label: "Maret"},
    {value: "04", label: "April"},
    {value: "05", label: "Mei"},
    {value: "06", label: "Juni"},
    {value: "07", label: "Juli"},
    {value: "08", label: "Agustus"},
    {value: "09", label: "September"},
    {value: "10", label: "Oktober"},
    {value: "11", label: "November"},
    {value: "12", label: "Desember"},
  ];

  const currentYear = new Date().getFullYear();
  const years = Array.from({length: 5}, (_, i) => currentYear - i);

  const fetchReservasiData = async () => {
    try {
      const {data, error} = await supabase.from("reservasi_data").select("*");
      if (error) throw error;
      setDataReservasi(data);
      setFilteredData(data);
    } catch (error) {
      console.error("Error fetching reservasi data:", error);
    }
  };

  useEffect(() => {
    fetchReservasiData();
  }, []);

  useEffect(() => {
    filterData();
  }, [selectedMonth, selectedYear, dataReservasi]);

  const filterData = () => {
    let filtered = [...dataReservasi];

    if (selectedMonth && selectedYear) {
      filtered = filtered.filter((item) => {
        const date = new Date(item.TglReservasi);
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear().toString();
        return month === selectedMonth && year === selectedYear;
      });
    } else if (selectedMonth) {
      filtered = filtered.filter((item) => {
        const date = new Date(item.TglReservasi);
        const month = String(date.getMonth() + 1).padStart(2, "0");
        return month === selectedMonth;
      });
    } else if (selectedYear) {
      filtered = filtered.filter((item) => {
        const date = new Date(item.TglReservasi);
        const year = date.getFullYear().toString();
        return year === selectedYear;
      });
    }

    setFilteredData(filtered);
    setCurrentPage(1);
  };

  const handlePrintPDF = () => {
    const doc = new jsPDF();

    let title = "Laporan Reservasi";
    if (selectedMonth && selectedYear) {
      const monthName = months.find((m) => m.value === selectedMonth)?.label;
      title = `Laporan Reservasi ${monthName} ${selectedYear}`;
    } else if (selectedMonth) {
      const monthName = months.find((m) => m.value === selectedMonth)?.label;
      title = `Laporan Reservasi ${monthName}`;
    } else if (selectedYear) {
      title = `Laporan Reservasi Tahun ${selectedYear}`;
    }

    doc.setFontSize(16);
    doc.text(title, 14, 20);

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
      body: filteredData.map((item) => [
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
      headStyles: {fillColor: [41, 128, 185]},
    });

    doc.save(
      `laporan-reservasi${selectedMonth ? `-${selectedMonth}` : ""}${selectedYear ? `-${selectedYear}` : ""}.pdf`
    );
  };

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="mx-auto max-w-6xl p-6 bg-white shadow-lg rounded-2xl">
      <h1 className="text-3xl font-bold text-center mb-8">Laporan Reservasi</h1>

      <div className="flex flex-wrap gap-4 mb-6">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Bulan</label>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md">
            <option value="">Semua Bulan</option>
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-medium text-gray-700 mb-1">Tahun</label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md">
            <option value="">Semua Tahun</option>
            {years.map((year) => (
              <option key={year} value={year.toString()}>
                {year}
              </option>
            ))}
          </select>
        </div>

        <div className="flex-1 min-w-[200px] flex items-end">
          <button
            onClick={handlePrintPDF}
            className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Unduh Laporan
          </button>
        </div>
      </div>

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
            {currentItems.length > 0 ? (
              currentItems.map((item, index) => (
                <tr key={index} className="text-center">
                  <td className="py-2 px-4 border-b">{item.NamaLengkap}</td>
                  <td className="py-2 px-4 border-b">{item.NoHp}</td>
                  <td className="py-2 px-4 border-b">{item.JenisAlat}</td>
                  <td className="py-2 px-4 border-b">{item.JumlahAlat}</td>
                  <td className="py-2 px-4 border-b">{formatDate(item.TglReservasi)}</td>
                  <td className="py-2 px-4 border-b">{formatDate(item.TglPengembalian)}</td>
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

      {/* Pagination */}
      <div className="flex justify-between items-center mt-6">
        <div className="text-sm text-gray-600">
          Menampilkan {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredData.length)} dari {filteredData.length}{" "}
          data
        </div>
        <div className="flex space-x-2">
          <button
            onClick={prevPage}
            disabled={currentPage === 1}
            className={`px-4 py-2 rounded-lg ${
              currentPage === 1
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            } transition`}>
            &larr; Sebelumnya
          </button>
          <button
            onClick={nextPage}
            disabled={currentPage === totalPages || totalPages === 0}
            className={`px-4 py-2 rounded-lg ${
              currentPage === totalPages || totalPages === 0
                ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            } transition`}>
            Selanjutnya &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default Laporan;
