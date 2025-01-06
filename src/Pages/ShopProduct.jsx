import {useState, useEffect} from "react";
import {IoMdAdd, IoMdRemove} from "react-icons/io";
import {supabase} from "@/SupabaseClient";

const ShopProduct = () => {
  const [cart, setCart] = useState([]);
  const [user, setUser] = useState(null);

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
      // Hapus item jika quantity mencapai 0
      updatedCart.splice(index, 1);
      updateCart(updatedCart);
    }
  };

  const getTotalPrice = () => {
    return cart.reduce((total, item) => total + item.totalPrice, 0);
  };

  const checkout = async () => {
    if (cart.length === 0) {
      alert("Cart kosong, silakan tambahkan produk.");
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
    <div className="flex flex-col lg:flex-row items-center justify-between lg:p-12 bg-gray-100 min-h-screen">
      <div className="flex w-full flex-col lg:flex-row">
        <div className="w-full lg:w-2/3 bg-white rounded-lg shadow-md p-6 lg:mb-0">
          <h2 className="text-xl font-semibold text-gray-800 mb-4 mt-20 text-center lg:text-start lg:mt-0">
            Reservasi Cart
          </h2>
          <hr className="border-2 border-gray-200" />
          <table className="w-full text-left mt-2 lg:mt-0">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-gray-600">Product</th>
                <th className="py-2 text-gray-600">Price</th>
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
                        <div className="flex w-full items-center ">
                          <div className="flex lg:mx-auto ">
                            <button onClick={() => handleAdd(index)}>
                              <IoMdAdd className="w-5 h-5 bg-green-800 rounded-md text-white" />
                            </button>
                            <span className="mx-2 text-gray-600">{product.quantity}</span>
                            <button onClick={() => handleRemove(index)}>
                              <IoMdRemove className="w-5 h-5 bg-red-800 rounded text-white" />
                            </button>
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 text-gray-800">Rp. {product.harga ? product.harga.toLocaleString() : "0"}</td>
                    <td className="py-3 text-red-500">Rp. {product.totalPrice.toLocaleString()}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-700">
                    Cart is empty.
                  </td>
                </tr>
              )}
              {cart.length > 0 && (
                <tr className="border-t-2">
                  <td colSpan="2" className="py-4 text-right font-bold">
                    Total:
                  </td>
                  <td className="py-4 text-red-500 font-bold">Rp. {getTotalPrice().toLocaleString()}</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <div className="w-full text-center mt-8">
        <button
          className={`px-6 py-3 text-lg font-medium text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-300 ${
            cart.length === 0 ? "cursor-not-allowed opacity-50" : ""
          }`}
          onClick={checkout}
          disabled={cart.length === 0}>
          Checkout & Pay
        </button>
      </div>
    </div>
  );
};

export default ShopProduct;
