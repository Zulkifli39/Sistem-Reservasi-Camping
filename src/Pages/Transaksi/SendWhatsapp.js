import axios from "axios";

export async function sendWhatsAppNotif({nama, produk, total, waktu}) {
  const apiKey = import.meta.env.VITE_FONNTE_API_KEY;
  const sender = import.meta.env.VITE_FONNTE_SENDER;
  const target = import.meta.env.VITE_FONNTE_TARGET;

  // Format the message with better readability
  const message = `*RESERVASI BARU BELOPA OUTDOOR*\n\n*Nama*: ${nama}\n*Produk*: ${produk}\n*Total*: ${total}\n*Waktu*: ${waktu} \n*Konfirmasi Sekarang Di Dashnoard Admini*`;

  const body = {
    target,
    sender,
    message,
  };

  try {
    // Using the correct FONNTE API URL
    const res = await axios.post("https://api.fonnte.com/send", body, {
      headers: {
        Authorization: apiKey,
        "Content-Type": "application/json",
      },
    });

    console.log("✅ Notifikasi WA terkirim:", res.data);
    return res.data;
  } catch (error) {
    console.error("❌ Gagal kirim WA:", error.response?.data || error.message);
    throw error;
  }
}
