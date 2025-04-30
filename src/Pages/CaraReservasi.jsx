const CaraReservasi = () => {
  return (
    <div>
      <h1 className="text-2xl font-bold mt-24 text-center">Cara Reservasi</h1>
      <div>
        <div className="flex justify-center mt-10">
          <img src="https://i.ibb.co/9YbS8qS/cara-reservasi.png" alt="Cara Reservasi" className="w-1/2 h-auto" />
        </div>
        <div className="mt-10 text-center text-lg font-semibold">
          <p>1. Pilih alat yang ingin di reservasi pada menua Alat Camping</p>
          <p>2. Klik tombol reservasi pada alat yang tersedia</p>
          <p>3. Lengkapi form reservasi pada icon keranjang</p>
          <p>4. Klik tombol bayar untuk melakukan pembayaran</p>
          <p>5. Setelah pembayaran berhasil, reservasi akan otomatis terkonfirmasi</p>
          <p>5. Untuk mengecek status reservasi, kunjungi menu Status</p>
        </div>
      </div>
    </div>
  );
};

export default CaraReservasi;
