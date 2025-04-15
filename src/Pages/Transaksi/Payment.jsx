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
      // Upload bukti pembayaran ke Supabase
      const {error: uploadError} = await supabase.storage.from("pembayaran").upload(filePath, paymentProof);
      if (uploadError) throw uploadError;

      // Ambil URL publik
      const {data: publicURLData} = await supabase.storage.from("pembayaran").getPublicUrl(filePath);
      const filePublicURL = publicURLData.publicUrl;
      setFileURL(filePublicURL);

      // Simpan data reservasi
      for (const item of cartItems) {
        const {error} = await supabase.from("reservasi_data").insert({
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
        });

        if (error) throw error;
      }

      // Update stok
      const updatePromises = cartItems.map(async (product) => {
        const {error} = await supabase
          .from("products")
          .update({stockProduct: product.stockProduct - product.quantity})
          .eq("id", product.id);

        if (error) throw error;
      });

      await Promise.all(updatePromises);

      // Format produk jadi satu string
      const produkFormatted = cartItems.map((item) => `${item.quantity}x ${item.name}`).join(", ");
      const waktuTransaksi = new Intl.DateTimeFormat("id-ID", {
        dateStyle: "full",
        timeStyle: "short",
      }).format(new Date());

      try {
        // Kirim notifikasi WhatsApp
        await sendWhatsAppNotif({
          nama: formData.fullName,
          produk: produkFormatted,
          total: `Rp ${totalAmount.toLocaleString()}`,
          waktu: waktuTransaksi,
        });

        onPaymentSuccess();

        Swal.fire({
          icon: "success",
          title: "Berhasil",
          text: "Pembayaran berhasil disimpan, stok diperbarui, dan notifikasi dikirim!",
        });
      } catch (whatsappError) {
        console.error("WhatsApp notification error:", whatsappError);

        // Still consider the payment successful even if WhatsApp fails
        onPaymentSuccess();

        Swal.fire({
          icon: "warning",
          title: "Pembayaran Berhasil",
          text: "Data pembayaran tersimpan, tetapi gagal mengirim notifikasi WhatsApp.",
        });
      }
    } catch (error) {
      console.error("Error during payment process:", error);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: `Gagal menyimpan data atau memperbarui stok: ${error.message}`,
      });
      setErrorMessage("Terjadi kesalahan saat menyimpan data reservasi.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 p-4 md:p-5 rounded-lg shadow-xl w-full max-w-md dark:text-white">
        <h1 className="text-xl font-bold mb-3 text-center text-emerald-600 dark:text-emerald-400">
          Reservasi Belopa Outdoor
        </h1>

        {/* Informasi Biodata */}
        <div className="mb-3 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
          <h2 className="text-base font-semibold border-b pb-1 mb-2 text-emerald-600 dark:text-emerald-400">
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
          <h2 className="text-base font-semibold border-b pb-1 mb-2 text-emerald-600 dark:text-emerald-400">
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
        <div className="mb-3 bg-emerald-50 dark:bg-emerald-900/30 p-2 rounded-lg">
          <p className="text-base font-bold text-center text-emerald-700 dark:text-emerald-300">
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
              <span className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 block">
                File terpilih: {paymentProof.name}
              </span>
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
            className="w-full px-3 py-2 bg-emerald-600 text-white text-sm rounded-lg hover:bg-emerald-700 transition-colors duration-300 focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:ring-offset-1 disabled:opacity-50"
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
