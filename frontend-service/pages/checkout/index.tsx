import Headder from "../../components/layout/headder";
import { GetServerSideProps, NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { FetchCart } from "../../Redux/cart";
import { store } from "../../Redux/store";
import { FetchUserInfo } from "../../Redux/userInfo";
import { ParseCookies } from "../../utils/ParseCookies";
import CheckoutCard from "../../components/Checkout/CheckoutCard";
import ContactNubmer from "../../components/Checkout/ContactNubmer";
import Addresses from "../../components/Checkout/Addresses";
import DeliveryScheduleCard from "../../components/Checkout/DeliveryScheduleCard";
import usePostFetch from "../../custom_hooks/usePostFetch";
import Spinner from "../../components/lib/Spinner";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = ParseCookies(context.req.headers.cookie || "");
  await store.dispatch(FetchUserInfo(cookies["jwt"] || ""));
  if(["Admin","Seller"].includes(store.getState().userInfo.value?.AccountType||"") ){
    return {
      redirect: {
        permanent: true,
        destination: "/account",
      },
    };
  }
  const resData = await Promise.all([store.dispatch(FetchCart(cookies["jwt"] || ""))]);
  return {
    props: {
      InitialState: store.getState(),
    },
  };
};
const Checkout: NextPage = ({ InitialState }: any) => {
  const navto = useRouter().push;
    const { IsPending, err,data, post } = usePostFetch();

  useEffect(() => {
    if (!InitialState.userInfo.loading && InitialState.userInfo.error) {
      navto("/signup");
    }
  }, []);

  useEffect(()=>{
    if(data){
      console.log(data)
    }
    if(err){
      console.log(err)
    }
  },[data,err])
  function order() {
    post("/shopping-service/orders", JSON.stringify({DeliverySchedule}));
  }
  const [DeliverySchedule, setDeliverySchedule] = useState("");

  return (
    <>
      {!InitialState.userInfo.loading && !InitialState.userInfo.error && (
        <div>
          <Headder />
          <div className="relative pt-[100px] grid-cols-2 grid md:grid-cols-3 lg:grid-cols-3 px-10 md:px-32 lg:px-32 py-10 bg-gray-100 ">
            {IsPending&&<Spinner />}

            <div className="col-span-2 space-y-5">
              <ContactNubmer />
              <Addresses />
              <DeliveryScheduleCard DeliverySchedule={DeliverySchedule} setDeliverySchedule={setDeliverySchedule} />
            </div>
            <div className=" col-span-2   md:col-span-1 lg:col-span-1 px-5">
              <CheckoutCard order={order} />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Checkout;
