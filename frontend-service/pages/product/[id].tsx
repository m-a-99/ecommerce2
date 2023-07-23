import { GetServerSideProps } from "next";
import Image from "next/image";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";
import Headder from "../../components/layout/headder";
import { addProductWithQuantity, FetchCart } from "../../Redux/cart";
import { useAppDispatch } from "../../Redux/hooks";
import { store } from "../../Redux/store";
import { FetchUserInfo } from "../../Redux/userInfo";
import { Attribute, AttributeValue } from "../../types/OptionTypes";
import { ProductType } from "../../types/ProductType";
import { ParseCookies } from "../../utils/ParseCookies";
import { VariableProductType } from "../../types/VariableProductTypes";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const productId: string = (context.params && (context.params.id as string)) || "";
  const cookies = ParseCookies(context.req.headers.cookie || "");
  await store.dispatch(FetchUserInfo(cookies["jwt"] || ""));
  if (["Admin", "Seller"].includes(store.getState().userInfo.value?.AccountType || "")) {
    return {
      redirect: {
        permanent: true,
        destination: "/account",
      },
    };
  }
  const resData = await Promise.all([(await fetch("http://nginx-proxy/products-service/products/" + productId)).json(), store.dispatch(FetchCart(cookies["jwt"] || ""))]);
  return { props: { InitialState: store.getState(), product: resData[0] } };
};
type choice = {
  [key: string]: {
    key: string;
    Attribute: Attribute;
    AttributeValue: AttributeValue;
  };
};
type Optionstype = {
  Key: string;
  Attribute: Attribute;
  AttributeValues: { _id: string; Meta: string; Value: string }[];
};
const product = ({ product }: { product: ProductType }) => {
  const [imgIndex, setimgIndex] = useState(0);
  const [en_next, seten_next] = useState(true);
  const [en_prev, seten_prev] = useState(false);
  const [Options, setOptions] = useState<Optionstype[]>([]);
  const [ChoiceState, setChoiceState] = useState<choice>({});
  const [AddEnabeld, setAddEnabeld] = useState(false);
  const [Quantity, setQuantity] = useState(1);
  const { back } = useRouter();

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (Quantity < 1) {
      setQuantity(1);
    }
  }, [Quantity]);

  useEffect(() => {
    if (imgIndex >= product.Gallery.length - 1) {
      seten_next(false);
    } else {
      seten_next(true);
    }
    if (imgIndex <= 0) {
      seten_prev(false);
    } else {
      seten_prev(true);
    }
  }, [imgIndex]);

  useEffect(() => {
    if (Options.length === 0 && product && product.ProductType === "Variable") {
      const o: { [key: string]: any } = {};

      product.VariableProduct.forEach((VariableProduct) => {
        VariableProduct.VarientAttributesValues.forEach((v) => {
          o[v.Attribute._id] = { Attribute: v.Attribute, Key: v.Attribute._id, AttributeValues: {} };
        });
      });
      product.VariableProduct.forEach((v) => {
        v.VarientAttributesValues.forEach((a) => {
          o[a.Attribute._id].AttributeValues[a.Value._id] = a.Value;
        });
      });
      setOptions(
        Object.values(o).map((v) => {
          v.AttributeValues = Object.values(v.AttributeValues);
          return v;
        })
      );
    }
  }, []);

  function choose(key: string, Attribute: Attribute, AttributeValue: AttributeValue) {
    setChoiceState((v) => {
      v[Attribute._id] = { key, Attribute, AttributeValue };
      return { ...v };
    });
  }

  useEffect(() => {
    if (Object.keys(ChoiceState).length === Options.length) {
      setAddEnabeld(true);
    } else {
      setAddEnabeld(false);
    }
  }, [ChoiceState, Options]);

  function add() {
    if (product.ProductType === "Variable" && Object.keys(ChoiceState).length === Options.length && Options.length > 0) {
      const tmpproduct: any = structuredClone(product);
      tmpproduct.VariableProduct = tmpproduct.VariableProduct.filter((v: VariableProductType) => {
        for (let i = 0; i < v.VarientAttributesValues.length; i++) {
          if (!(ChoiceState[v.VarientAttributesValues[i].Attribute._id].AttributeValue._id === v.VarientAttributesValues[i].Value._id)) {
            return false;
          }
        }
        return true;
      });
      dispatch(addProductWithQuantity({ Quantity, Product: tmpproduct }));
      setChoiceState({});
    }
    else if (product.ProductType === "Simple") {
      dispatch(addProductWithQuantity({Quantity,Product:product}))
    }
  }
  return (
    <div className="h-[calc(100vh-70px)]">
      <Headder />
      <div className="mt-[70px] md:h-full lg:h-full flex justify-center items-center  ">
        <div className="lg:grid h-5/6 md:grid grid-cols-12 w-5/6 my-8   drop-shadow-xl bg-stone-50 border ">
          <div className=" col-span-9 lg:col-span-6 border-r-[1px] md:col-span-6 p-10  h-full flex justify-center items-center ">
            <div className="relative w-full max-w-[400px] h-full  ">
              <div className="w-full h-full items-center flex justify-center">
                {((product.Gallery.length > 0 && product.Gallery) || [product.FeaturedImage]).map((img, index: number) => (
                  <div key={img} className={index === imgIndex ? "" : "hidden"}>
                    <Image src={`http://nginx-proxy${img}`} width={250} height={250} className="animate-imgmount w-auto select-none h-auto" alt={product.Description} priority />
                  </div>
                ))}
              </div>

              {en_next ? (
                <div onClick={() => setimgIndex((e) => e + 1)} className="absolute p-3 bg-zinc-500 bg-opacity-40 cursor-pointer select-none hover:bg-opacity-50 right-0 top-1/2 transform -translate-y-1/2">
                  <i className="fa-solid fa-chevron-right"></i>
                </div>
              ) : (
                <div className="absolute p-3 text-gray-400 bg-zinc-500 bg-opacity-10  select-none  right-0 top-1/2 transform -translate-y-1/2">
                  <i className="fa-solid fa-chevron-right"></i>
                </div>
              )}

              {en_prev ? (
                <div onClick={() => setimgIndex((e) => e - 1)} className="absolute p-3 bg-zinc-500 bg-opacity-40 cursor-pointer select-none hover:bg-opacity-50 left-0 top-1/2 transform -translate-y-1/2">
                  <i className="fa-solid fa-chevron-left"></i>
                </div>
              ) : (
                <div className="absolute p-3  text-gray-400 bg-zinc-500 bg-opacity-10  select-none  left-0 top-1/2 transform -translate-y-1/2">
                  <i className="fa-solid fa-chevron-left"></i>
                </div>
              )}
              <div className="absolute flex  bottom-3  left-1/2 -translate-x-1/2 space-x-1">
                {((product.Gallery.length > 0 && product.Gallery) || [product.FeaturedImage]).map((img: any, index: number) => (
                  <div key={img}>{imgIndex === index ? <div onClick={() => setimgIndex(index)} className="w-4 h-4 border-2 cursor-pointer select-none rounded-full bg-black bg-opacity-70"></div> : <div onClick={() => setimgIndex(index)} className="w-4 h-4 border-2 cursor-pointer select-none rounded-full bg-gray-500 bg-opacity-70"></div>}</div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-span-3 lg:col-span-6 md:col-span-6">
            <div className="py-8 flex flex-col justify-between h-full px-8 space-y-2">
              <div>
                <div onClick={back} className="text-indigo-500 text-sm font-bold cursor-pointer select-none mb-5 ">
                  Back to home screen
                </div>
                <h1 className="font-bold text-lg text-zinc-700">{product.Name}</h1>
                <h2 className="font-serif font-semibold text-gray-500">$45.00</h2>
                <h2 className="font-semibold text-sm text-zinc-700 border-b-2 w-max border-zinc-500">Description</h2>
                <div className="max-h-[80px] overflow-y-auto customscrollbar p-1">
                  <p className="text-gray-500 text-sm ">{product.Description}</p>
                </div>
              </div>
              <div>
                {product.ProductType === "Variable" && (
                  <div className="space-y-4 ">
                    {Options.map((opt) => {
                      if (opt.Attribute.Name.toLocaleLowerCase().includes("color")) {
                        return (
                          <div key={opt.Key} className="flex items-center md:space-x-2 lg:space-x-2">
                            <div className="w-16 ">
                              <div className="w-max font-semibold text-sm text-zinc-700   border-zinc-500">Color</div>
                            </div>

                            <div className="flex space-x-2">
                              {opt.AttributeValues.map((v) => (
                                <div key={v._id} style={{ backgroundColor: (v as any).Meta }} onClick={() => choose(opt.Key, opt.Attribute, v)} className={`${(ChoiceState[opt.Attribute._id]?.AttributeValue?._id || "") === v._id ? "border-2 border-indigo-500" : ""} w-7 h-7 rounded-full drop-shadow-lg`}></div>
                              ))}
                            </div>
                          </div>
                        );
                      } else {
                        return (
                          <div key={opt.Key} className="flex items-center md:space-x-4 lg:space-x-4">
                            <div className=" w-16 ">
                              <div className="font-semibold text-sm text-zinc-700  w-max border-zinc-500">{opt.Attribute.Name}</div>
                            </div>
                            <div className="flex items-center space-x-2 ">
                              {opt.AttributeValues.map((v) => (
                                <div key={v._id} onClick={() => choose(opt.Key, opt.Attribute, v)} className={`${(ChoiceState[opt.Attribute._id]?.AttributeValue?._id || "") === v._id ? "text-indigo-500" : ""} border-b-2 hover:border-indigo-500 border-gray-500 cursor-pointer select-none hover:text-indigo-500`}>
                                  {v.Value}
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      }
                    })}
                  </div>
                )}
              </div>
              <div className="flex items-center md:space-x-4 lg:space-x-4">
                <div className=" w-16 ">
                  <div className="font-semibold text-sm text-zinc-700  w-max border-zinc-500">Quantity</div>
                </div>
                <div className="flex text-sm text-gray-500  font-semibold items-center space-x-3 ">
                  <div>
                    <input value={Quantity} onChange={(e) =>e.target.valueAsNumber > 0 ? setQuantity(Number.parseInt(e.target.value)):setQuantity(0)} type="number"  onWheel={(e:any) => e.target.blur()}  className="p-1 w-24  outline-none border-2 border-gray-400 rounded-lg" />
                  </div>
                </div>
              </div>
              <div className="space-y-4 ">
                {AddEnabeld ? (
                  <div onClick={add} className="bg-indigo-500 font-semibold text-white w-max px-5 py-2 rounded-sm drop-shadow-lg cursor-pointer select-none">
                    Add to cart
                  </div>
                ) : (
                  <div className="bg-indigo-300 font-semibold text-white w-max px-5 py-2 rounded-sm drop-shadow-lg  select-none">Add to cart</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default product;
