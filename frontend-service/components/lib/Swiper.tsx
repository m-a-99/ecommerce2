import { AnimatePresence, motion } from "framer-motion";
import { ReactElement, useState } from "react";

type props = {
  children: ReactElement<any, any> | ReactElement<any, any>[];
};

function Swiper({ children }: props) {
  const [currentCard, setcurrentCard] = useState(0);
  const initial = { opacity: 0.5 };
  const animate = { opacity: 1 };
  const exit = { opacity: 0.5 };
    // const initial = { x: "100%" };
    // const animate = { x: 0 };
    // const exit = { x: "-100%" };

  const transition = {
    duration: 0.4,
    ease: "easeInOut",
  };
  const dragConstraints = { top: 0, left: 0, right: 0, bottom: 0 };
  return (
    <div className="overflow-hidden relative w-full h-screen">
      {children && Array.isArray(children) ? (
        <>
          {children.map((card, i) => (
            <div key={i}>
              <AnimatePresence>
                {currentCard === i && (
                  <motion.div className="absolute z-10 w-full h-full" key={"" + i * Date.now()} dragConstraints={dragConstraints} initial={initial} animate={animate} transition={transition} exit={exit}>
                    {card}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
          <div onClick={() => setcurrentCard((v) => (v + 1) % children.length)} className="absolute top-1/2 -translate-y-1/2 text-white z-20 w-10 h-10 flex justify-center items-center ml-10 rounded-full cursor-pointer  bg-zinc-700">
            <i className="fa-solid fa-chevron-left"></i>
          </div>
          <div onClick={() => setcurrentCard((v) => (v - 1 < 0 ? children.length - 1 : v - 1))} className="absolute top-1/2  -translate-y-1/2 right-0 text-white z-20 w-10 h-10 flex justify-center items-center mr-10 rounded-full cursor-pointer  bg-zinc-700">
            <i className="fa-solid fa-chevron-right"></i>
          </div>
        </>
      ) : (
        <div>
          <AnimatePresence>
            <motion.div className="absolute z-10 w-full h-full" key={"" + Date.now()} drag="x" dragConstraints={dragConstraints} animate={animate} transition={transition} exit={exit}>
              {children}
            </motion.div>
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

export default Swiper;
