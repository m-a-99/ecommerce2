import { AnimationEvent, ReactElement, useEffect, useRef, useState } from "react";

type props = {
  children: ReactElement<any, any> | ReactElement<any, any>[];
};

function Slider({ children }: props) {
  const [CurrentSlideIndex, setCurrentSlideIndex] = useState(0);
  const prevSlideIndex = useRef((Array.isArray(children)?children.length-1:0));
  const [AnimationEnd, setAnimationEnd] = useState(false);
  const [en, seten] = useState(true);
  const animateIn = useRef("animate-fadein");
  const animateOut = useRef("");
  function next() {
    if (en && Array.isArray(children)) {
      setAnimationEnd(false);
      animateIn.current = "animate-slideinleft";
      animateOut.current = "animate-slideoutright";
      prevSlideIndex.current = CurrentSlideIndex;
      setCurrentSlideIndex((v) => (v + 1) % children.length);
      // seten(false);
    }
  }
  function prev() {
    if (en && Array.isArray(children)) {
      setAnimationEnd(false);
      animateIn.current = "animate-slideinright";
      animateOut.current = "animate-slideoutleft";
      prevSlideIndex.current = CurrentSlideIndex;
      setCurrentSlideIndex((v) => (v - 1 < 0 ? children.length-1 : v - 1));
      // seten(false);
    }
  }
  // function AnimatiInEnd() {
  //   seten(true);
  // }
  function AnimatiOutEnd() {
    // seten(true);
    setAnimationEnd(true);
  }
  return (
    <div className="relative w-full h-full overflow-hidden">
      <div className="w-full h-full">
        {Array.isArray(children) ? (
          <>
            {children.map((child, index) => {
              if (index === CurrentSlideIndex) {
                return (
                  <div  key={index} className={`w-full  h-full absolute top-0 right-0 ${animateIn.current}`}>
                    {child}
                  </div>
                );
              } else if (index === prevSlideIndex.current) {
                return (
                  <div key={index}>
                    {!AnimationEnd && animateOut.current && (
                      <div onAnimationEnd={AnimatiOutEnd} className={`w-full h-full absolute top-0 right-0  ${animateOut.current}`}>
                        {child}
                      </div>
                    )}
                  </div>
                );
              }
            })}
            <div onClick={next} className="absolute z-20  cursor-pointer top-1/2 right-2 p-4  text-white text-4xl">
              <i className="fal fa-chevron-right"></i>
            </div>
            <div onClick={prev} className="absolute z-20  cursor-pointer top-1/2 left-2 p-4 text-white text-4xl">
              <i className="fal fa-chevron-left"></i>
            </div>
          </>
        ) : (
          <div className={`w-full h-full absolute top-0 right-0`}>{children}</div>
        )}
      </div>
    </div>
  );
}

export default Slider;
