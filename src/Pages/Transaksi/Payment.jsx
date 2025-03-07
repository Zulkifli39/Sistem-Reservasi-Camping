import {supabase} from "@/SupabaseClient";
import {useState} from "react";
import Swal from "sweetalert2";

const Payment = ({totalAmount, onPaymentSuccess, onPaymentCancel, formData, cartItems}) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentProof, setPaymentProof] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fileURL, setFileURL] = useState("");

  const handleFileChange = (e) => {
    setPaymentProof(e.target.files[0]); // Menyimpan file yang diupload
  };

  const handlePaymentSubmit = async () => {
    if (!paymentProof) {
      setErrorMessage("Harap unggah bukti pembayaran.");
      return;
    }

    setUploading(true); // Menandai proses upload sedang berjalan

    const fileExt = paymentProof.name.split(".").pop(); // Mengambil ekstensi file
    const fileName = `${Date.now()}.${fileExt}`; // Memberi nama unik pada file
    const filePath = `pembayaran/${fileName}`; // Path di dalam storage Supabase

    try {
      // Mengunggah file ke Supabase storage
      const {error: uploadError} = await supabase.storage.from("pembayaran").upload(filePath, paymentProof);

      if (uploadError) {
        throw uploadError;
      }

      // Mendapatkan URL publik dari file yang telah diunggah
      const {data: publicURLData} = await supabase.storage.from("pembayaran").getPublicUrl(filePath);
      const filePublicURL = publicURLData.publicUrl;
      setFileURL(filePublicURL);

      // Untuk setiap item di cart, simpan data reservasi terpisah
      for (const item of cartItems) {
        const {error} = await supabase.from("reservasi_data").insert({
          NamaLengkap: formData.fullName,
          Email: formData.email,
          NoHp: formData.phone,
          JenisAlat: item.name, // Nama produk dari cart
          JumlahAlat: item.quantity, // Jumlah produk yang dipesan
          Harga: item.harga, // Harga satuan
          TotalHarga: item.totalPrice, // Total harga per item
          TglReservasi: formData.reservationDate,
          TglPengembalian: formData.returnDate,
          BuktiPembayaran: filePublicURL,
        });

        if (error) {
          throw error;
        }
      }

      // Update stok produk di database
      const updatePromises = cartItems.map(async (product) => {
        const {error} = await supabase
          .from("products")
          .update({stockProduct: product.stockProduct - product.quantity})
          .eq("id", product.id);

        if (error) throw error;
      });

      // Tunggu semua update selesai
      await Promise.all(updatePromises);

      // Jika berhasil, panggil callback untuk melanjutkan ke langkah selanjutnya
      onPaymentSuccess();

      Swal.fire({
        icon: "success",
        title: "Berhasil",
        text: "Pembayaran berhasil disimpan dan stok diperbarui!",
      });
    } catch (error) {
      console.error("Error during payment process:", error);
      // Jika ada error tampilkan pesan error
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: `Gagal menyimpan data atau memperbarui stok: ${error.message}`,
      });
      setErrorMessage("Terjadi kesalahan saat menyimpan data reservasi.");
    } finally {
      setUploading(false); // Menyelesaikan proses upload
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg">
        <h1 className="text-2xl font-bold mb-6 text-center">Reservasi Belopa Outdoor</h1>

        {/* Informasi Biodata */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Informasi Biodata</h2>
          <p>Nama Lengkap: {formData.fullName}</p>
          <p>Email: {formData.email}</p>
          <p>Nomor Telepon: {formData.phone}</p>
          <p>Tanggal Reservasi: {formData.reservationDate}</p>
          <p>Tanggal Pengembalian: {formData.returnDate}</p>
        </div>

        {/* Detail Produk yang Dipesan */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Detail Produk</h2>
          <table className="w-full mt-2 border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Jenis Alat</th>
                <th className="text-center py-2">Jumlah</th>
                <th className="text-right py-2">Harga</th>
              </tr>
            </thead>
            <tbody>
              {cartItems.map((item, index) => (
                <tr key={index} className="border-b">
                  <td className="py-2">{item.name}</td>
                  <td className="text-center py-2">{item.quantity}</td>
                  <td className="text-right py-2">Rp. {item.totalPrice.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total Harga */}
        <p className="text-lg font-bold mb-4">Total Pembayaran: Rp. {totalAmount.toLocaleString()}</p>

        <div className="mb-4">
          <label className="block text-gray-700 font-semibold mb-2">Unggah Bukti Pembayaran</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2"
          />
        </div>

        {errorMessage && <p className="text-red-500 mb-4">{errorMessage}</p>}

        <button
          onClick={handlePaymentSubmit}
          className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none"
          disabled={uploading}>
          {uploading ? "Mengunggah..." : "Konfirmasi Pembayaran"}
        </button>

        <button
          onClick={onPaymentCancel}
          className="w-full mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 focus:outline-none">
          Batalkan
        </button>
      </div>
    </div>
  );
};

export default Payment;
