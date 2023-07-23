import { useEffect, useRef } from "react";
type props = {
  imgsrc: string;
  Animationend:()=>void
};

const FlyImg = ({imgsrc,Animationend}: props) => {
  const img = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const cartelemnt = document.querySelector(".cartelement");
    let cartrect = cartelemnt?.getBoundingClientRect();
    let imgrect = img.current?.getBoundingClientRect();
    // console.log("top", cartrect?.top, imgrect?.top);
    // console.log("right", cartrect?.right, imgrect?.right);
    if (imgrect && cartrect) {
      if (img.current) {
        img.current.style.setProperty(
          "--img-top",
          cartrect.top - imgrect.top + "px"
        );
        img.current.style.setProperty(
          "--img-right",
          imgrect?.right - cartrect?.right + "px"
        );
      }
    }
  }, []);

  // const imgg = useRef<HTMLImageElement | null>(null);
  // const imgtop=useRef(0);
  // const imgright=useRef(0);
  // const [visable,setvisable]=useState(false)

  // useEffect(()=>{
  //   if(visable){
  //     const cartelemnt = document.querySelector(".cartelement");
  //     let cart = cartelemnt?.getBoundingClientRect();
  //     let img = imgg.current?.getBoundingClientRect();
  //     let topdone=false;
  //     let rightdone=false;
  //     const animate = setInterval(() => {
  //       if (imgg.current && img && cart) {
  //         if (img.top > cart.top) {
  //           imgtop.current -= 5;
  //         }
  //         else{
  //           topdone=true;
  //         }
  //         if (cart.right > img.right) {
  //           imgright.current += 5;
  //         }
  //         else{
  //           rightdone=true;
  //         }
  //         imgg.current.style.top = `${imgtop.current}px`;
  //         imgg.current.style.left = `${imgright.current}px`;
  //         img = imgg.current?.getBoundingClientRect();
  //         cart = cartelemnt?.getBoundingClientRect();

  //         if (img && cart && topdone&&rightdone) {
  //           imgtop.current=0;
  //           imgright.current=0;
  //           setvisable(false);
  //           clearInterval(animate);
  //         }
  //       }
  //     }, 0);
  //   }
  // },[visable])
  // function move() {
  //   setvisable(true)
  // }
  
  return (
    <div className="w-full flex justify-center relative z-50">
      <div>
        <img
          onAnimationEnd={Animationend}
          ref={img}
          src={imgsrc}
          className="w-20 h-20 absolute z-10000 animate-flyto"
        /> 
     
      </div>
    </div>
  );
};

export default FlyImg;
