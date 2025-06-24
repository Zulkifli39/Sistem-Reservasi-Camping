import {ArrowRight, Check, ShoppingCart, CalendarDays, CreditCard, ThumbsUp, ClipboardList} from "lucide-react";
import {Link} from "react-router-dom";
import tutorial from "../assets/tutorial.avif";

const CaraReservasi = () => {
  const steps = [
    {
      id: 1,
      text: "Pilih alat yang ingin di reservasi pada menu Alat Camping",
      icon: <CalendarDays className="w-6 h-6" />,
    },
    {
      id: 2,
      text: "Klik tombol reservasi pada alat yang tersedia",
      icon: <Check className="w-6 h-6" />,
    },
    {
      id: 3,
      text: "Lengkapi form reservasi pada icon keranjang",
      icon: <ShoppingCart className="w-6 h-6" />,
    },
    {
      id: 4,
      text: "Klik tombol bayar untuk melakukan pembayaran",
      icon: <CreditCard className="w-6 h-6" />,
    },
    {
      id: 5,
      text: "Setelah pembayaran berhasil, reservasi akan otomatis terkonfirmasi",
      icon: <ThumbsUp className="w-6 h-6" />,
    },
    {
      id: 6,
      text: "Untuk mengecek status reservasi, kunjungi menu Status",
      icon: <ClipboardList className="w-6 h-6" />,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto  px-4 py-16 ">
      <div className="text-center mb-10">
        <h1 className="mt-10 text-2xl  font-extrabold text-gray-900 sm:text-3xl">Cara Reservasi</h1>
        <p className="mt-4 text-sm text-gray-500 max-w-2xl mx-auto">
          Ikuti langkah-langkah sederhana berikut untuk mereservasi alat camping Anda
        </p>
      </div>

      <div className="grid md:grid-cols-2  gap-12 items-center">
        <div className="rounded-md overflow-hidden shadow-xl hidden lg:block">
          <img src={tutorial} alt="Tutorial" className="w-full h-auto object-cover" />
        </div>

        <div className="space-y-6">
          {steps.map((step) => (
            <div key={step.id} className="flex items-start">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center w-12 h-12 rounded-md bg-[#eb6725] text-white">
                  {step.icon}
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Langkah {step.id}</h3>
                <p className="mt-1 text-gray-500">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-10 text-center">
        <Link
          to="/"
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-[#f19647] hover:bg-black shadow-lg">
          Mulai Reservasi Sekarang
          <ArrowRight className="ml-2 w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};

export default CaraReservasi;
