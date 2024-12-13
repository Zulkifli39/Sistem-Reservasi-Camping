function PopularProduct() {
  return (
    <div className="flex flex-wrap  lg:my-28 py-10 px-4">
      {/* Text Section */}
      <div className="w-full lg:w-2/5 px-4 lg:px-12 mb-6 lg:mb-0">
        <div className="space-y-6">
          <h2 className="font-bold text-2xl">Popular Product</h2>
          <p className="font-light text-sm lg:text-base">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam ex sed sapiente alias ullam labore assumenda
            minima veritatis ipsa aliquam sit voluptatum nulla nihil eveniet saepe accusamus doloribus rerum omnis,
            vitae suscipit id fugiat? Porro, recusandae repellat! Esse, provident corrupti?
          </p>
          <button className="p-3 border rounded-md bg-white hover:bg-gray-200">
            <span className="font-semibold text-black">Check Now</span>
          </button>
        </div>
      </div>

      {/* Carousel Section */}
      <div className="w-full lg:w-3/5 px-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          <div className="carousel-item">
            <img
              src="https://img.daisyui.com/images/stock/photo-1559703248-dcaaec9fab78.webp"
              className="rounded-lg object-cover w-full h-40 sm:h-48 lg:h-64"
              alt="Product 1"
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://img.daisyui.com/images/stock/photo-1565098772267-60af42b81ef2.webp"
              className="rounded-lg object-cover w-full h-40 sm:h-48 lg:h-64"
              alt="Product 2"
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://img.daisyui.com/images/stock/photo-1572635148818-ef6fd45eb394.webp"
              className="rounded-lg object-cover w-full h-40 sm:h-48 lg:h-64"
              alt="Product 3"
            />
          </div>
          <div className="carousel-item">
            <img
              src="https://img.daisyui.com/images/stock/photo-1494253109108-2e30c049369b.webp"
              className="rounded-lg object-cover w-full h-40 sm:h-48 lg:h-64"
              alt="Product 4"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default PopularProduct;
