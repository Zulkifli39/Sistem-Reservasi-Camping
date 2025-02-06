import {motion} from "framer-motion";
import NavBg from "../assets/NavbarBg.png";
const Home = () => {
  return (
    <div className="relative w-full h-screen">
      <img className="absolute inset-0 w-full h-full object-cover" src={NavBg} alt="Navbar Background" />
      <div className="relative z-10 flex flex-col items-center justify-center h-full bg-black bg-opacity-50 px-6 md:px-12 lg:px-20 space-y-4">
        <div className="max-w-lg space-y-6 text-center">
          <motion.p
            initial={{opacity: 0, x: -50}}
            whileInView={{opacity: 1, x: 0}}
            transition={{duration: 1}}
            viewport={{once: true}}
            className="text-white font-bold text-3xl  ">
            Welcome Campers
          </motion.p>
          <motion.h2
            initial={{opacity: 0, y: 50}}
            whileInView={{opacity: 1, y: 0}}
            transition={{duration: 1}}
            viewport={{once: true}}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-white">
            Selamat Datang Di Sistem Reservasi
          </motion.h2>
          <button className="text-white  bg-grennCol font-bold p-4 rounded-xl ">Get Started</button>
        </div>
      </div>
    </div>
  );
};
export default Home;
