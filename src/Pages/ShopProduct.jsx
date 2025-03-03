import {useState, useEffect} from "react";
import {IoMdAdd, IoMdRemove} from "react-icons/io";
import {supabase} from "@/SupabaseClient";
import {IoReturnDownBackOutline} from "react-icons/io5";

const ShopProduct = () => {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    reservationDate: "",
    returnDate: "",
    paymentProof: null,
  });

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
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (cart.length === 0) {
      alert("Cart kosong, silakan tambahkan produk.");
      return;
    }

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.phone ||
      !formData.reservationDate ||
      !formData.returnDate ||
      !formData.paymentProof
    ) {
      alert("Harap lengkapi semua field dan upload bukti pembayaran.");
      return;
    }

    try {
      const paymentSuccessful = true;

      if (paymentSuccessful) {
        for (const product of cart) {
          const {data, error} = await supabase
            .from("products")
            .update({stockProduct: product.stockProduct - product.quantity})
            .eq("id", product.id);

          if (error) throw error;
        }
        localStorage.removeItem("cart");
        setCart([]);
        alert("Pembayaran berhasil dan stok telah diperbarui!");
      } else {
        alert("Pembayaran gagal, silakan coba lagi.");
      }
    } catch (error) {
      console.error("Error during checkout:", error);
      alert("Terjadi kesalahan saat memproses pembayaran.");
    }
  };

  return (
    // <div className="flex w-full flex-col lg:flex-row items-center justify-between lg:p-12 min-h-screen">
    //   <div className="flex w-full flex-col lg:flex-row">
    //     <div className="w-3/5 bg-white rounded-lg shadow-md p-6 lg:mb-0">
    //       <h2 className="text-xl font-semibold text-gray-800 mb-4 mt-20 text-center lg:text-start lg:mt-0">
    //         Reservasi Cart
    //       </h2>
    //       <hr className="border-2 border-gray-200" />
    //       <table className="w-full text-left mt-2 lg:mt-0">
    //         <thead>
    //           <tr className="border-b">
    //             <th className="py-2 text-gray-600">Jenis Alat</th>
    //             <th>Jumlah Alat</th>
    //             <th className="py-2 text-gray-600">Harga</th>
    //             <th className="py-2 text-gray-600">Total</th>
    //           </tr>
    //         </thead>
    //         <tbody>
    //           {cart.length > 0 ? (
    //             cart.map((product, index) => (
    //               <tr key={index} className="border-b hover:bg-gray-50">
    //                 <td className="py-3">
    //                   <div className="flex flex-col lg:flex-row lg:items-center">
    //                     <img className="w-16 h-16 rounded-md" src={product.image_url} alt={`${product.name}`} />
    //                     <div className="w-28 lg:ml-4 mt-4 lg:mt-0">
    //                       <p className="font-medium text-gray-800">{product.name}</p>
    //                     </div>
    //                   </div>
    //                 </td>
    //                 <td>
    //                   <div className="flex w-full items-center">
    //                     <hr />
    //                     <div className="flex lg:mx-auto">
    //                       <button onClick={() => handleAdd(index)}>
    //                         <IoMdAdd className="w-5 h-5 bg-green-800 rounded-md text-white" />
    //                       </button>
    //                       <span className="mx-2 text-gray-600">{product.quantity}</span>
    //                       <button onClick={() => handleRemove(index)}>
    //                         <IoMdRemove className="w-5 h-5 bg-red-800 rounded text-white" />
    //                       </button>
    //                     </div>
    //                   </div>
    //                 </td>
    //                 <td className="py-3 text-gray-800">Rp. {product.harga ? product.harga.toLocaleString() : "0"}</td>
    //                 <td className="py-3 text-red-500">Rp. {product.totalPrice.toLocaleString()}</td>
    //               </tr>
    //             ))
    //           ) : (
    //             <tr>
    //               <td colSpan="4" className="text-center py-4 text-gray-700">
    //                 Cart is empty.
    //               </td>
    //             </tr>
    //           )}

    //           {cart.length > 0 && (
    //             <>
    //               {/* Baris Total Harga */}
    //               <tr className="border-t-2 w-full">
    //                 <td colSpan="2" className="py-4 font-bold">
    //                   Total Harga:
    //                 </td>
    //                 <td className="text-red-500 font-bold">Rp. {getTotalPrice().toLocaleString()}</td>
    //               </tr>

    //               {/* Container untuk Informasi Tambahan */}
    //               <tr>
    //                 <td colSpan="4" className="py-4">
    //                   <div className="rounded-xl p-4 bg-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
    //                     {/* Bagian Kiri: Ikon dan Teks */}
    //                     <div className="flex items-center bg-green-500 rounded-md p-3 text-white">
    //                       <IoReturnDownBackOutline className="text-3xl mr-3" />
    //                       <span className="text-md font-bold">Alat Camping</span>
    //                     </div>

    //                     {/* Bagian Kanan: Catatan */}
    //                     <div className="flex-1 text-gray-700">
    //                       <h2 className="text-lg font-semibold">Note:</h2>
    //                       <p className="text-sm">
    //                         Untuk Jaminan Reservasi, Silahkan Sediakan KTP Saat Pengambilan Alat Camping
    //                       </p>
    //                     </div>
    //                   </div>
    //                 </td>
    //               </tr>
    //             </>
    //           )}
    //         </tbody>
    //       </table>
    //     </div>

    //     {/* Biodata Reservasi */}
    //     <div className="text-center  w-1/3 bg-white rounded-lg  shadow-md p-6">
    //       <h2 className="text-  xl font-semibold mb-4">Biodata Reservasi</h2>
    //       <hr className="border-2 border-gray-200 mb-4" />
    //       <form onSubmit={handleSubmit}>
    //         <div className="mb-4">
    //           <label className="block text-gray-700 text-sm font-bold mb-2 text-left" htmlFor="fullName">
    //             Nama Lengkap
    //           </label>
    //           <input
    //             type="text"
    //             id="fullName"
    //             name="fullName"
    //             value={formData.fullName}
    //             onChange={handleInputChange}
    //             className="w-full px-3 py-2 border rounded-lg"
    //             required
    //           />
    //         </div>
    //         <div className="mb-4 flex gap-4">
    //           <div className="w-1/2">
    //             <h1 className="text-left text-gray-700 text-sm font-bold">Email</h1>
    //             <input
    //               type="email"
    //               id="email"
    //               name="email"
    //               value={formData.email}
    //               onChange={handleInputChange}
    //               className="w-full mt-2 px-3 py-2 border rounded-lg"
    //               required
    //             />
    //           </div>
    //           <div className="w-1/2">
    //             <h1 className="text-left text-gray-700 text-sm font-bold ">Phone</h1>
    //             <input
    //               type="tel"
    //               id="phone"
    //               name="phone"
    //               value={formData.phone}
    //               onChange={handleInputChange}
    //               className="w-full mt-2 px-3 py-2 border rounded-lg"
    //               required
    //             />
    //           </div>
    //         </div>

    //         <div className="mb-4 gap-4 flex">
    //           <div className="w-1/2">
    //             <h1 className="text-left text-gray-700 text-sm font-bold">Reservasi</h1>
    //             <input
    //               type="date"
    //               id="reservationDate"
    //               name="reservationDate"
    //               value={formData.reservationDate}
    //               onChange={handleInputChange}
    //               className="w-full mt-2 px-3 py-2 border rounded-lg"
    //               required
    //             />
    //           </div>
    //           <div className="w-1/2">
    //             <h1 className="text-left text-gray-700 text-sm font-bold">Pengembalian</h1>
    //             <input
    //               type="date"
    //               id="reservationDate"
    //               name="reservationDate"
    //               // value={formData.reservationDate}
    //               // onChange={handleInputChange}
    //               className="w-full mt-2 px-3 py-2 border rounded-lg"
    //               required
    //             />
    //           </div>
    //         </div>
    //         <button
    //           type="submit"
    //           className={`w-full px-6 py-3 text-lg font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300 ${
    //             cart.length === 0 ? "cursor-not-allowed opacity-50" : ""
    //           }`}
    //           disabled={cart.length === 0}>
    //           Reservasi Now
    //         </button>
    //       </form>
    //     </div>
    //   </div>
    // </div>

    <div className="flex w-full flex-col lg:flex-row items-center justify-between lg:p-12 min-h-screen p-4">
      <div className="flex w-full flex-col lg:flex-row gap-6">
        {/* Cart Section */}
        <div className="w-full lg:w-3/5 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 text-center lg:text-start">Reservasi Cart</h2>
          <hr className="border-2 border-gray-200" />

          {/* Tabel untuk Desktop */}
          <div className="hidden lg:block">
            <table className="w-full text-left mt-2">
              <thead>
                <tr className="border-b">
                  <th className="py-2 text-gray-600">Jenis Alat</th>
                  <th>Jumlah Alat</th>
                  <th className="py-2 text-gray-600">Harga</th>
                  <th className="py-2 text-gray-600">Total</th>
                </tr>
              </thead>
              <tbody>
                {cart.length > 0 ? (
                  cart.map((product, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3">
                        <div className="flex flex-col lg:flex-row lg:items-center">
                          <img className="w-16 h-16 rounded-md" src={product.image_url} alt={`${product.name}`} />
                          <div className="w-28 lg:ml-4 mt-4 lg:mt-0">
                            <p className="font-medium text-gray-800">{product.name}</p>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="flex w-full items-center">
                          <div className="flex lg:mx-auto">
                            <button onClick={() => handleAdd(index)}>
                              <IoMdAdd className="w-5 h-5 bg-green-800 rounded-md text-white" />
                            </button>
                            <span className="mx-2 text-gray-600">{product.quantity}</span>
                            <button onClick={() => handleRemove(index)}>
                              <IoMdRemove className="w-5 h-5 bg-red-800 rounded text-white" />
                            </button>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 text-gray-800">Rp. {product.harga ? product.harga.toLocaleString() : "0"}</td>
                      <td className="py-3 text-red-500">Rp. {product.totalPrice.toLocaleString()}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-gray-700">
                      Cart is empty.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Tampilan Mobile untuk Cart */}
          <div className="block lg:hidden">
            {cart.length > 0 ? (
              cart.map((product, index) => (
                <div key={index} className="border-b py-4">
                  <div className="flex items-center">
                    <img className="w-16 h-16 rounded-md" src={product.image_url} alt={`${product.name}`} />
                    <div className="ml-4">
                      <p className="font-medium text-gray-800">{product.name}</p>
                      <p className="text-sm text-gray-600">
                        Rp. {product.harga ? product.harga.toLocaleString() : "0"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center">
                      <button onClick={() => handleRemove(index)}>
                        <IoMdRemove className="w-5 h-5 bg-red-800 rounded text-white" />
                      </button>
                      <span className="mx-2 text-gray-600">{product.quantity}</span>
                      <button onClick={() => handleAdd(index)}>
                        <IoMdAdd className="w-5 h-5 bg-green-800 rounded-md text-white" />
                      </button>
                    </div>
                    <p className="text-red-500">Rp. {product.totalPrice.toLocaleString()}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-4 text-gray-700">Cart is empty.</p>
            )}
          </div>

          {cart.length > 0 && (
            <>
              {/* Total Harga */}
              <div className="border-t-2 py-4">
                <p className="font-bold">
                  Total Harga: <span className="text-red-500">Rp. {getTotalPrice().toLocaleString()}</span>
                </p>
              </div>

              {/* Informasi Tambahan */}
              <div className="rounded-xl p-4 bg-gray-100 flex flex-col md:flex-row items-center justify-between gap-4 mt-4">
                <div className="flex items-center bg-green-500 rounded-md p-3 text-white">
                  <IoReturnDownBackOutline className="text-3xl mr-3" />
                  <span className="text-md font-bold">Alat Camping</span>
                </div>
                <div className="flex-1 text-gray-700">
                  <h2 className="text-lg font-semibold">Note:</h2>
                  <p className="text-sm">
                    Untuk Jaminan Reservasi, Silahkan Sediakan KTP Saat Pengambilan Alat Camping
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Biodata Reservasi */}
        <div className="w-full lg:w-1/3 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Biodata Reservasi</h2>
          <hr className="border-2 border-gray-200 mb-4" />
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2 text-left" htmlFor="fullName">
                Nama Lengkap
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border rounded-lg"
                required
              />
            </div>
            <div className="mb-4 flex flex-col gap-4">
              <div>
                <h1 className="text-left text-gray-700 text-sm font-bold">Email</h1>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full mt-2 px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <h1 className="text-left text-gray-700 text-sm font-bold">Phone</h1>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full mt-2 px-3 py-2 border rounded-lg"
                  required
                />
              </div>
            </div>
            <div className="mb-4 flex flex-col gap-4">
              <div>
                <h1 className="text-left text-gray-700 text-sm font-bold">Reservasi</h1>
                <input
                  type="date"
                  id="reservationDate"
                  name="reservationDate"
                  value={formData.reservationDate}
                  onChange={handleInputChange}
                  className="w-full mt-2 px-3 py-2 border rounded-lg"
                  required
                />
              </div>
              <div>
                <h1 className="text-left text-gray-700 text-sm font-bold">Pengembalian</h1>
                <input
                  type="date"
                  id="returnDate"
                  name="returnDate"
                  value={formData.returnDate}
                  onChange={handleInputChange}
                  className="w-full mt-2 px-3 py-2 border rounded-lg"
                  required
                />
              </div>
            </div>
            <button
              type="submit"
              className={`w-full px-6 py-3 text-lg font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300 ${
                cart.length === 0 ? "cursor-not-allowed opacity-50" : ""
              }`}
              disabled={cart.length === 0}>
              Reservasi Now
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ShopProduct;
