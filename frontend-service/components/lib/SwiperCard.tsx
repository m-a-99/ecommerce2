import { motion } from "framer-motion";
function SwiperCard({ key }: any) {
  return (
    <motion.div
      className="absolute z-10 w-full h-full"
      key={key}
      drag="x"
      dragConstraints={{
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}
      //  initial={{ x: "100%" }}
      //  animate={{x:0}}
      //  exit={{x:"-100%"}}
      //  transition={{duration:0.4}}
      animate={{
        x: ["100%", "-10%", "0%"],
        opacity: [0.7, 0.8, 1],
        scale: [2, 1.5, 1],
      }}
      transition={{
        duration: 1,
        ease: "easeInOut",
        times: [0, 0.7, 1],
        repeatDelay: 1,
      }}
      exit={{ x: "-100%", transition: { delay: 0.5, duration: 2 } }}
    >
      <div className="w-full h-screen bg-home bg-cover bg-center "></div>
    </motion.div>
  );
}

export default SwiperCard;
