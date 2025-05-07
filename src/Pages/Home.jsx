import {motion} from "framer-motion";
import NavBg from "../assets/about4.webp";

const Home = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden" id="home">
      {/* Background Image with Overlay */}
      <img
        className="absolute inset-0 w-full h-full object-cover transform scale-105 filter brightness-75"
        src={NavBg}
        alt="Navbar Background"
      />

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full mt-12 px-6 md:px-12 lg:px-20">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <motion.div
            initial={{opacity: 0, y: 50}}
            animate={{opacity: 1, y: 0}}
            transition={{duration: 0.8, ease: "easeOut"}}
            className="space-y-6">
            {/* Main Heading */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-tight">
              Selamat Datang Di{" "}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#f19647] to-[#ea6726]">
                Sistem Reservasi
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-lg md:text-xl text-gray-200 max-w-lg mx-auto">
              Temukan pengalaman camping terbaik dengan peralatan berkualitas
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8">
              <motion.button
                whileHover={{scale: 1.05}}
                whileTap={{scale: 0.95}}
                className="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-white/20 transition duration-300 border border-white/30">
                Mulai Reservasi
              </motion.button>
            </div>
          </motion.div>
        </div>
        {/* Scroll Indicator */}
        {/* <motion.div
          initial={{opacity: 0, y: 0}}
          animate={{opacity: 1, y: 10}}
          transition={{duration: 1, repeat: Infinity, repeatType: "reverse"}}
          className="absolute bottom-8">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center p-2">
            <motion.div
              animate={{y: [0, 12, 0]}}
              transition={{duration: 1.5, repeat: Infinity}}
              className="w-1 h-1 bg-white rounded-full"
            />
          </div>
        </motion.div> */}
      </div>
    </div>
  );
};

export default Home;
