import {supabase} from "@/SupabaseClient";
import {useState, useEffect} from "react";

const Status = () => {
  const [informasi, setInformasi] = useState([]);

  useEffect(() => {
    fetchInformasi();
  }, []);

  const fetchInformasi = async () => {
    try {
      let {data, error} = await supabase.from("reservasi_data").select();
      if (error) throw error;
      setInformasi(data);
    } catch (error) {
      console.error("Error fetching reservasi:", error);
    }
  };

  return (
    <div className="mt-28 mx-auto max-w-4xl p-6 bg-white shadow-lg rounded-2xl">
      <h1 className="text-3xl font-bold text-center mb-8">Informasi Reservasi</h1>

      {informasi.map((item) => (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 text-lg">
            <div className="flex flex-col">
              <span className="font-semibold">Nama Pemesan:</span>
              <span>{item.NamaLengkap}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">Nomor HP:</span>
              <span>{item.NoHp}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">Jenis Alat:</span>
              <span>{item.JenisAlat}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">Jumlah Alat:</span>
              <span>{item.JumlahAlat}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">Tanggal Reservasi:</span>
              <span>{item.TglReservasi}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">Tanggal Pengembalian:</span>
              <span>{item.TglPengembalian}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">Total Harga:</span>
              <span>{item.TotalHarga}</span>
            </div>
            <div className="flex flex-col">
              <span className="font-semibold">Status Alat:</span>
              <span className={`font-bold text-white bg-green-500 px-2 py-1 rounded-md`}>{item.Status}</span>
            </div>
          </div>
          <hr className="mt-4 mb-4 border-black" />
        </>
      ))}
    </div>
  );
};

export default Status;
