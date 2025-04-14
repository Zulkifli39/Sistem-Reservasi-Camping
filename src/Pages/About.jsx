import {aboutImages} from "../DataPages/DataPages";
import {imagesAbout} from "../DataPages/DataPages";

import {Card, CardContent} from "@/Components/ui/card";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel";

const About = () => {
  return (
    <>
      {/* About Section */}
      <div className="py-20">
        <div className="container mx-auto px-6 lg:px-32">
          <div className="grid gap-16">
            {/* About Images */}
            <div className="flex flex-wrap justify-between mx-2 lg:mx-0 space-y-6 lg:space-y-0 ">
              {aboutImages.map((item, index) => (
                <div
                  key={index}
                  className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 max-w-xs w-full sm:w-72">
                  <img src={item.img} alt={item.title} className="w-16 h-16 mb-4" />
                  <h3 className="text-sm text-green-500 font-medium text-center">{item.subtitle}</h3>
                  <p className="text-base text-gray-800 font-semibold text-center">{item.title}</p>
                </div>
              ))}
            </div>

            {/* Carousel Section */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:gap-12 px-4 lg:px-0">
              <div className="w-full lg:w-2/3 xl:w-1/2 mx-auto relative">
                <Carousel className="w-full max-w-lg mx-auto">
                  <CarouselContent>
                    {imagesAbout.map((item, index) => (
                      <CarouselItem key={index}>
                        <Card className="overflow-hidden rounded-xl shadow-md">
                          <CardContent className="p-4">
                            <img src={item.img} alt={item.alt || "Image"} className="w-full h-64 object-cover" />
                          </CardContent>
                        </Card>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  {/* Tombol Previous dan Next */}
                  <div className="absolute mt-6 left-12 flex gap-2">
                    <CarouselPrevious className="bg-gray-200 p-2 rounded-full hover:bg-gray-300" />
                    <CarouselNext className="bg-gray-200 p-2 rounded-full hover:bg-gray-300" />
                  </div>
                </Carousel>
              </div>

              {/* About Text */}
              <div className="mt-14 lg:mt-0 w-full px-4 lg:px-0">
                <h2 className="font-bold text-2xl text-left">About Us</h2>
                <p className="text-base mt-4 text-justify leading-relaxed">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur, maiores! Lorem ipsum, dolor sit
                  amet consectetur adipisicing elit. Eum, hic ea. Consequatur ad architecto aliquid.x Lorem ipsum dolor
                  sit amet consectetur adipisicing elit. Consequatur, maiores! Lorem ipsum, dolor sit amet consectetur
                  adipisicing elit. Eum, hic ea. Consequatur ad architecto aliquid.x Lorem ipsum dolor sit amet
                  consectetur adipisicing elit. Consequatur, maiores! Lorem ipsum, dolor sit amet consectetur
                  adipisicing elit. Eum, hic ea. Consequatur ad architecto aliquid.x Lorem ipsum dolor sit amet
                  consectetur adipisicing elit. Consequatur, maiores! Lorem ipsum
                </p>
                <div className="mt-6 flex justify-start w-full">
                  <button className="bg-green-500 w-full lg:w-36 text-white px-8 py-3 rounded-lg hover:bg-green-600">
                    <p className="text-lg font-semibold">More Info</p>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
