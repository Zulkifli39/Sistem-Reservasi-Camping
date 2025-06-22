import {supabase} from "@/SupabaseClient";
import {useState} from "react";
import Swal from "sweetalert2";
// Import Untuk Mengirimkan Informasi Pemesanan
import {sendWhatsAppNotif} from "./SendWhatsapp";

const Payment = ({totalAmount, onPaymentSuccess, onPaymentCancel, formData, cartItems}) => {
  const [errorMessage, setErrorMessage] = useState("");
  const [paymentProof, setPaymentProof] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [fileURL, setFileURL] = useState("");

  const handleFileChange = (e) => {
    setPaymentProof(e.target.files[0]);
  };

  const handlePaymentSubmit = async () => {
    if (!paymentProof) {
      setErrorMessage("Harap unggah bukti pembayaran.");
      return;
    }

    setUploading(true);

    const fileExt = paymentProof.name.split(".").pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `pembayaran/${fileName}`;

    try {
      // Ambil user yang sedang login
      const {
        data: {user},
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) throw new Error("Gagal mendapatkan informasi user.");

      // Upload bukti pembayaran ke Supabase
      const {error: uploadError} = await supabase.storage.from("pembayaran").upload(filePath, paymentProof);
      if (uploadError) throw uploadError;

      const {data: publicURLData, error: urlError} = await supabase.storage.from("pembayaran").getPublicUrl(filePath);
      if (urlError || !publicURLData.publicUrl) throw new Error("Gagal mendapatkan URL publik.");
      const filePublicURL = publicURLData.publicUrl;

      // Simpan data reservasi ke Supabase, termasuk user_id
      for (const item of cartItems) {
        const {error: insertError} = await supabase.from("reservasi_data").insert({
          user_id: user.id,
          NamaLengkap: formData.fullName,
          Email: formData.email,
          NoHp: formData.phone,
          JenisAlat: item.name,
          JumlahAlat: item.quantity,
          Harga: item.harga,
          TotalHarga: item.totalPrice,
          TglReservasi: formData.reservationDate,
          TglPengembalian: formData.returnDate,
          BuktiPembayaran: filePublicURL,
          gambar: item.image_url,
          status: "Menunggu Konfirmasi", // <-- pastikan baris ini ada
        });

        if (insertError) throw insertError;
      }

      // Update stok
      const updateStock = cartItems.map(async (item) => {
        const newStock = item.stockProduct - item.quantity;
        const {error: updateError} = await supabase.from("products").update({stockProduct: newStock}).eq("id", item.id);

        if (updateError) throw updateError;
      });

      await Promise.all(updateStock);

      // Format dan kirim notifikasi WhatsApp
      const produkFormatted = cartItems.map((item) => `${item.quantity}x ${item.name}`).join(", ");
      const waktuTransaksi = new Intl.DateTimeFormat("id-ID", {
        dateStyle: "full",
        timeStyle: "short",
      }).format(new Date());

      try {
        await sendWhatsAppNotif({
          nama: formData.fullName,
          produk: produkFormatted,
          total: `Rp ${totalAmount.toLocaleString()}`,
          waktu: waktuTransaksi,
        });

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Pembayaran berhasil disimpan, stok diperbarui, dan notifikasi dikirim!",
        });
      } catch (notifError) {
        console.error("WhatsApp error:", notifError);
        Swal.fire({
          icon: "warning",
          title: "Pembayaran Berhasil",
          text: "Data disimpan, tapi gagal kirim notifikasi WhatsApp.",
        });
      }

      onPaymentSuccess();
    } catch (error) {
      console.error("Error:", error.message);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: `Gagal memproses pembayaran: ${error.message}`,
      });
      setErrorMessage("Terjadi kesalahan saat memproses pembayaran.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-4 md:p-5 rounded-lg shadow-xl w-full max-w-md dark:text-white">
        <h1 className="text-xl font-bold mb-3 text-center text-[#f19647] dark:text-[#f19647]">
          Reservasi Belopa Outdoor
        </h1>

        {/* Informasi Biodata */}
        <div className="mb-3 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <h2 className="text-base font-semibold border-b pb-1 mb-2 text-[#f19647] dark:text-[#f19647]">
            Informasi Biodata
          </h2>
          <div className="space-y-1 text-sm">
            <p>
              <span className="font-medium">Nama:</span> {formData.fullName}
            </p>
            <p>
              <span className="font-medium">Email:</span> {formData.email}
            </p>
            <p>
              <span className="font-medium">Nomor Telepon:</span> {formData.phone}
            </p>
            <p>
              <span className="font-medium">Tanggal Reservasi:</span> {formData.reservationDate}
            </p>
            <p>
              <span className="font-medium">Tanggal Pengembalian:</span> {formData.returnDate}
            </p>
          </div>
        </div>

        {/* Detail Produk yang Dipesan */}
        <div className="mb-3 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <h2 className="text-base font-semibold border-b pb-1 mb-2 text-[#f19647] dark:text-[#f19647]">
            Detail Produk
          </h2>
          <div className="overflow-x-auto text-sm">
            <table className="w-full">
              <thead>
                <tr className="border-b dark:border-gray-600">
                  <th className="text-left py-1">Jenis Alat</th>
                  <th className="text-center py-1">Jumlah</th>
                  <th className="text-right py-1">Harga</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item, index) => (
                  <tr key={index} className="border-b dark:border-gray-600">
                    <td className="py-2">{item.name}</td>
                    <td className="text-center py-2">{item.quantity}</td>
                    <td className="text-right py-2">Rp. {item.totalPrice.toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Total Harga */}
        <div className="mb-3 bg-[#f19647] dark:bg-emerald-900/30 p-2 rounded-lg">
          <p className="text-base font-bold text-center text-white dark:text-[#f19647]">
            Total Pembayaran: Rp. {totalAmount.toLocaleString()}
          </p>
        </div>

        <div className="mb-3">
          <label className="block text-gray-700 dark:text-gray-200 font-medium mb-1 text-sm">
            Unggah Bukti Pembayaran
          </label>
          <div className="relative">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="w-full text-sm border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 focus:outline-none focus:ring-1 focus:ring-emerald-500"
            />
            {paymentProof && (
              <span className="text-xs text-black dark:text-black mt-1 block">File terpilih: {paymentProof.name}</span>
            )}
          </div>
        </div>

        {errorMessage && (
          <div className="mb-3 p-2 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg text-sm">
            {errorMessage}
          </div>
        )}

        <div className="space-y-2">
          <button
            onClick={handlePaymentSubmit}
            className="w-full px-3 py-2 bg-[#f19647] text-white text-sm rounded-lg hover:bg-[#f19647] transition-colors duration-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:ring-offset-1 disabled:opacity-50"
            disabled={uploading}>
            {uploading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Mengunggah...
              </span>
            ) : (
              "Konfirmasi Pembayaran"
            )}
          </button>

          <button
            onClick={onPaymentCancel}
            className="w-full px-3 py-2 border border-red-500 text-red-500 text-sm bg-transparent rounded-lg hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors duration-300 focus:outline-none focus:ring-1 focus:ring-red-500 focus:ring-offset-1">
            Batalkan
          </button>
        </div>
      </div>
    </div>
  );
};

export default Payment;
