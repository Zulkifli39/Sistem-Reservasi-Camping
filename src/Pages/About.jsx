import {aboutImages, imagesAbout} from "../DataPages/DataPages";
import {Card, CardContent} from "@/Components/ui/card";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel";
import {motion} from "framer-motion";

const About = () => {
  return (
    <section className="py-20 bg-gray-50">
      {/* Background Image */}
      <div className="container mx-auto px-4 lg:px-8 max-w-7xl">
        <motion.div
          initial={{opacity: 0}}
          whileInView={{opacity: 1}}
          transition={{duration: 0.5}}
          className="grid gap-16"
          id="tentangkami">
          {/* Feature Cards Section */}
          <div>
            <h2 className="text-3xl font-bold text-center mb-12">Layanan Kami</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {aboutImages.map((item, index) => (
                <motion.div
                  key={index}
                  whileHover={{y: -5}}
                  transition={{type: "spring", stiffness: 300}}
                  className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow duration-300">
                  <div className=" p-4 rounded-full mb-4">
                    <img src={item.img} alt={item.title} className="w-12 h-12" />
                  </div>
                  <h3 className="text-sm text-black font-medium text-center mb-2">{item.subtitle}</h3>
                  <p className="text-lg text-black font-semibold text-center">{item.title}</p>
                </motion.div>
              ))}
            </div>
          </div>

          {/* About Us Section */}
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Carousel */}
            <motion.div
              initial={{x: -50, opacity: 0}}
              whileInView={{x: 0, opacity: 1}}
              transition={{duration: 0.5}}
              className="w-full">
              <div className="relative">
                <Carousel className="w-full max-w-xl mx-auto">
                  <CarouselContent>
                    {imagesAbout.map((item, index) => (
                      <CarouselItem key={index}>
                        <Card className="overflow-hidden rounded-xl shadow-md border-0">
                          <CardContent className="p-0">
                            <img
                              src={item.img}
                              alt={item.alt || "About Image"}
                              className="w-full h-64 sm:h-80 object-cover"
                            />
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>

                  {/* Navigation buttons - Hidden on mobile, visible on desktop */}
                  <CarouselPrevious className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 shadow-lg hover:bg-white border-0 w-10 h-10 rounded-full" />
                  <CarouselNext className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 shadow-lg hover:bg-white border-0 w-10 h-10 rounded-full" />
                </Carousel>

                {/* Mobile navigation dots */}
                <div className="flex sm:hidden justify-center gap-2 mt-4">
                  {imagesAbout.map((_, index) => (
                    <div key={index} className="w-2 h-2 bg-gray-300 rounded-full"></div>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* About Text */}
            <motion.div
              initial={{x: 50, opacity: 0}}
              whileInView={{x: 0, opacity: 1}}
              transition={{duration: 0.5, delay: 0.2}}
              className="space-y-4">
              <h2 className="font-bold text-3xl md:text-4xl">Tentang Kami</h2>
              <div className="w-20 h-1 bg-[#f19647]"></div>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed text-justify">
                Belopa Outdoor adalah penyedia perlengkapan outdoor dan adventure yang berbasis di Belopa, Kabupaten
                Luwu. Kami hadir untuk mendukung segala aktivitas luar ruang seperti camping, hiking, tracking, dan
                kegiatan alam lainnya dengan produk dan layanan terbaik.
              </p>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed text-justify">
                Sejak didirikan, Belopa Outdoor telah menjadi pilihan utama para pecinta alam di wilayah Luwu dan
                sekitarnya. Kami percaya bahwa setiap perjalanan adalah pengalaman berharga, dan perlengkapan yang tepat
                akan menjadikannya semakin aman dan berkesan.
              </p>
              <p className="text-base md:text-lg text-gray-600 leading-relaxed text-justify">
                Kami berkomitmen untuk terus menghadirkan produk berkualitas, pelayanan ramah, serta harga yang
                terjangkau untuk mendukung gaya hidup aktif dan cinta alam. Dengan semangat petualang, kami siap menjadi
                bagian dari cerita perjalanan Anda.
              </p>
              <div className="pt-4"></div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default About;
