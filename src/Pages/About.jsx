// DataAbout
import {aboutImages} from "../DataPages/DataPages";
// Data ImageAbout
import {imagesAbout} from "../DataPages/DataPages";

// Carousel Components
import {Card, CardContent} from "@/Components/ui/card";
import {Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious} from "@/components/ui/carousel";

const About = () => {
  return (
    <>
      {/* About Section */}
      <div className="py-10 h-screen bg-gray-100">
        {/* About Images */}
        <div className="container mt-10 mx-auto flex justify-center gap-14">
          {aboutImages.map((item, index) => (
            <div key={index} className="flex flex-col items-center bg-white shadow-lg rounded-lg p-6 max-w-xs">
              <img src={item.img} alt={item.title} className="w-10 h-10 mb-2" />
              <h3 className="text-xs text-green-500 font-medium mt-2">{item.subtitle}</h3>
              <p className="text-sm text-gray-800 font-semibold text-center mt-2">{item.title}</p>
            </div>
          ))}
        </div>

        {/* Carousel Section images about */}
        <div className="w-full mt-24 flex justify-center ">
          <div className="w-1/2">
            <Carousel className="w-full max-w-xs mx-auto">
              <CarouselContent>
                {imagesAbout.map((item, index) => (
                  <CarouselItem key={index}>
                    <div className="w-full h-full">
                      {/* Card Component with Rounded Corners */}
                      <Card className="overflow-hidden rounded-tl-4xl rounded-bl-4xl rounded-br-4xl">
                        <CardContent className="p-0  ">
                          <img
                            src={item.img}
                            alt={item.alt || "Image"}
                            className="bg-gray-200  w-full h-full object-cover"
                          />
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>

          <div className="w-1/2 pl-10 flex items-center">
            <div className="w-2/3 flex flex-col justify-between space-y-6 ">
              <h2 className="font-bold text-xl">About Us</h2>
              <p className="text-sm mt-2 text-justify">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Consequatur, maiores! Lorem ipsum, dolor sit
                amet consectetur adipisicing elit. Eum, hic ea. Consequatur ad architecto aliquid.Lorem ipsum dolor sit
                amet consectetur adipisicing elit. Consequatur, maiores! Lorem ipsum, dolor sit amet consectetur
                adipisicing elit. Eum, hic ea. Consequatur ad architecto aliquid.maiores! Lorem ipsum, dolor sit amet
                consectetur adipisicing elit. Eum, hic ea. Consequatur ad architecto aliquid. Consequatur ad architecto
                aliquid.maiores! Lorem ipsum, dolor sit amet consectetur adipisicing elit. Eum, hic ea. Consequatur ad
                architecto aliquid.
              </p>
              <div>
                <button className="bg-green-500 text-white p-3 rounded-xl  mt-4 hover:bg-green-600">
                  <p className="text-lg font-semibold ">More Info</p>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;
