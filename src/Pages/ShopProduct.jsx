import {useState, useEffect} from "react";
import {IoMdAdd, IoMdRemove} from "react-icons/io";
import {supabase} from "@/SupabaseClient";
import {IoReturnDownBackOutline} from "react-icons/io5";
import {FaShoppingCart, FaCalendarAlt, FaUser, FaEnvelope, FaPhone} from "react-icons/fa";
import Payment from "./Transaksi/Payment";

const ShopProduct = () => {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

  // Biodata Reservasi
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    reservationDate: "",
    returnDate: "",
    paymentProof: null,
  });
  const [showPayment, setShowPayment] = useState(false);
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem("cart"));
    if (savedCart) {
      const cartWithQuantity = savedCart.map((item) => ({
        ...item,
        quantity: 1,
        totalPrice: item.harga,
      }));
      setCart(cartWithQuantity);
    }
    checkUser();
  }, []);

  const checkUser = async () => {
    const {
      data: {session},
    } = await supabase.auth.getSession();
    if (session) {
      setUser(session.user);
    }
  };

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
  };

  const handleAdd = (index) => {
    const updatedCart = [...cart];
    updatedCart[index].quantity += 1;
    updatedCart[index].totalPrice = updatedCart[index].harga * updatedCart[index].quantity;
    updateCart(updatedCart);
  };

  const handleRemove = (index) => {
    const updatedCart = [...cart];
    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
      updatedCart[index].totalPrice = updatedCart[index].harga * updatedCart[index].quantity;
      updateCart(updatedCart);
    } else {
      updatedCart.splice(index, 1);
      updateCart(updatedCart);
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.totalPrice, 0);
  };

  const handleInputChange = (e) => {
    const {name, value, files} = e.target;
    if (name === "paymentProof") {
      setFormData({...formData, [name]: files[0]});
    } else {
      setFormData({...formData, [name]: value});
    }
    setIsFormValid(validateForm());
  };

  const validateForm = () => {
    const {fullName, email, phone, reservationDate, returnDate} = formData;
    return (
      fullName.trim() !== "" &&
      email.trim() !== "" &&
      phone.trim() !== "" &&
      reservationDate.trim() !== "" &&
      returnDate.trim() !== ""
    );
  };

  const handleSubmit = async (e = null) => {
    if (e) {
      e.preventDefault();
    }

    try {
      if (!validateForm()) {
        console.error("Form tidak valid. Harap isi semua biodata.");
        return;
      }
      setShowPayment(true);
    } catch (error) {
      console.error("Error during checkout:", error);
    }
  };

  const handlePaymentSuccess = () => {
    localStorage.removeItem("cart");
    setCart([]);
    setShowPayment(false);
  };

  return (
    <div className="bg-gray-50 mt-8 min-h-screen pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Reservasi Alat Camping</h1>
          <div className="h-1 w-20 bg-[#f19647] mt-2 mb-6"></div>
          <p className="text-gray-600">
            Selesaikan reservasi alat camping Anda dengan mengisi biodata dan melakukan pembayaran
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Cart Section */}
          <div className="w-full lg:w-3/5">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                    <FaShoppingCart className="mr-2 text-[#f19647]" /> Keranjang Reservasi
                  </h2>
                  <span className="bg-[#f19647] text-white text-xs font-medium px-2.5 py-1 rounded-full">
                    {cart.length} item
                  </span>
                </div>
              </div>

              <div className="hidden lg:block">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="py-4 px-6 text-sm font-medium text-gray-600">Jenis Alat</th>
                      <th className="py-4 px-6 text-sm font-medium text-gray-600">Jumlah</th>
                      <th className="py-4 px-6 text-sm font-medium text-gray-600">Harga</th>
                      <th className="py-4 px-6 text-sm font-medium text-gray-600">Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cart.length > 0 ? (
                      cart.map((product, index) => (
                        <tr key={index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                          <td className="py-4 px-6">
                            <div className="flex items-center">
                              <img
                                className="w-16 h-16 rounded-lg object-cover"
                                src={product.image_url}
                                alt={`${product.name}`}
                              />
                              <div className="ml-4">
                                <p className="font-medium text-gray-800">{product.name}</p>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-6">
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => handleRemove(index)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 transition-colors">
                                <IoMdRemove />
                              </button>
                              <span className="w-10 text-center font-medium">{product.quantity}</span>
                              <button
                                onClick={() => handleAdd(index)}
                                className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-green-100 text-gray-600 hover:text-green-600 transition-colors">
                                <IoMdAdd />
                              </button>
                            </div>
                          </td>
                          <td className="py-4 px-6 text-gray-800 font-medium">
                            Rp. {product.harga ? product.harga.toLocaleString() : "0"}
                          </td>
                          <td className="py-4 px-6 text-[#f19647] font-semibold">
                            Rp. {product.totalPrice.toLocaleString()}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="4" className="text-center py-8 text-gray-500">
                          <div className="flex flex-col items-center">
                            <FaShoppingCart className="text-4xl text-gray-300 mb-3" />
                            <p>Keranjang Anda masih kosong</p>
                            <p className="text-sm text-gray-400 mt-1">
                              Tambahkan alat camping untuk melanjutkan reservasi
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Mobile View */}
              <div className="block lg:hidden p-4">
                {cart.length > 0 ? (
                  cart.map((product, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 mb-4 shadow-sm border border-gray-100">
                      <div className="flex items-center">
                        <img
                          className="w-16 h-16 rounded-lg object-cover"
                          src={product.image_url}
                          alt={`${product.name}`}
                        />
                        <div className="ml-4">
                          <p className="font-medium text-gray-800">{product.name}</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Rp. {product.harga ? product.harga.toLocaleString() : "0"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() => handleRemove(index)}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 text-gray-600 hover:text-red-600 transition-colors">
                            <IoMdRemove />
                          </button>
                          <span className="w-8 text-center font-medium">{product.quantity}</span>
                          <button
                            onClick={() => handleAdd(index)}
                            className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-green-100 text-gray-600 hover:text-green-600 transition-colors">
                            <IoMdAdd />
                          </button>
                        </div>
                        <p className=" font-medium">Rp. {product.totalPrice.toLocaleString()}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FaShoppingCart className="text-4xl text-gray-300 mx-auto mb-3" />
                    <p>Keranjang Anda masih kosong</p>
                    <p className="text-sm text-gray-400 mt-1">Tambahkan alat camping untuk melanjutkan reservasi</p>
                  </div>
                )}
              </div>

              {cart.length > 0 && (
                <>
                  <div className="p-6 bg-gray-50 border-t border-gray-100">
                    <div className="flex justify-between items-center">
                      <span className="text-lg font-medium text-[#f19647]">Total</span>
                      <span className="text-2xl font-bold text-[#f19647]">Rp. {getTotalPrice().toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="p-6 bg-[#f19647]-50 border-t border-gray-100">
                    <div className="flex items-center">
                      <div className="bg-[#f19647] text-white p-3 rounded-lg">
                        <IoReturnDownBackOutline className="text-xl" />
                      </div>
                      <div className="ml-4">
                        <h3 className="font-medium text-gray-800">Penting:</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          Nomor Rekening | BRI | : 4991-0104-7157-530 - MUHAMMAD ZULKIFLI
                        </p>
                        <p className="text-sm text-gray-600 mt-1">
                          Silakan sediakan KTP Anda saat pengambilan alat camping sebagai jaminan reservasi.
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Biodata Reservasi */}
          <div className="w-full lg:w-2/5">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-6 border-b border-gray-100">
                <h2 className="text-xl font-semibold text-gray-800">Biodata Reservasi</h2>
              </div>

              <div className="p-6">
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label className="flex items-center text-gray-700 text-sm font-medium mb-2" htmlFor="fullName">
                      <FaUser className="mr-2 text-[#f19647]" /> Nama Lengkap
                    </label>
                    <input
                      type="text"
                      id="fullName"
                      name="fullName"
                      placeholder="Masukkan nama lengkap Anda"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-[#f19647] transition-colors"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="flex items-center text-gray-700 text-sm font-medium mb-2" htmlFor="email">
                        <FaEnvelope className="mr-2 text-[#f19647]" /> Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder="email@example.com"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200  focus:ring-[#f19647] transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="flex items-center text-gray-700 text-sm font-medium mb-2" htmlFor="phone">
                        <FaPhone className="mr-2 text-[#f19647]" /> Nomor Telepon
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        placeholder="08xxxxxxxxxx"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200   focus:ring-[#f19647] transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <div>
                      <label
                        className="flex items-center text-gray-700 text-sm font-medium mb-2"
                        htmlFor="reservationDate">
                        <FaCalendarAlt className="mr-2 text-[#f19647]" /> Tanggal Reservasi
                      </label>
                      <input
                        type="date"
                        id="reservationDate"
                        name="reservationDate"
                        value={formData.reservationDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200   focus:ring-[#f19647] transition-colors"
                        required
                      />
                    </div>
                    <div>
                      <label className="flex items-center text-gray-700 text-sm font-medium mb-2" htmlFor="returnDate">
                        <FaCalendarAlt className="mr-2 text-[#f19647]" /> Tanggal Pengembalian
                      </label>
                      <input
                        type="date"
                        id="returnDate"
                        name="returnDate"
                        value={formData.returnDate}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 rounded-lg border border-gray-200  focus:ring-[#f19647]  transition-colors"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className={`w-full px-6 py-4 text-lg font-medium text-white bg-[#f19647] rounded-lg hover:bg-[#f19647] transition-colors focus:outline-none focus:ring-4 focus:ring-[#f19647] ${
                      cart.length === 0 || !isFormValid ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={cart.length === 0 || !isFormValid}>
                    Lanjutkan ke Pembayaran
                  </button>

                  {!isFormValid && cart.length > 0 && (
                    <p className="text-red-500 text-sm mt-3 text-center">
                      Harap lengkapi semua biodata sebelum melanjutkan.
                    </p>
                  )}

                  {cart.length === 0 && (
                    <p className="text-red-500 text-sm mt-3 text-center">
                      Tambahkan alat camping ke keranjang untuk melanjutkan reservasi.
                    </p>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPayment && (
        <Payment
          totalAmount={getTotalPrice()}
          onPaymentSuccess={handlePaymentSuccess}
          onPaymentCancel={() => setShowPayment(false)}
          formData={formData}
          cartItems={cart}
        />
      )}
    </div>
  );
};

export default ShopProduct;
