import { useEffect, useState } from "react";
import AttributeValuesCard from "../../../components/Account/attributes/create/AttributeValuesCard";
import CreateAttributeHeadderCard from "../../../components/Account/attributes/create/CreateAttributeHeadderCard";
import GeneralInfoCard from "../../../components/Account/attributes/create/GeneralInfoCard";
import NavList from "../../../components/Account/NavList";
import Headder from "../../../components/layout/headder";
import usePostFetch from "../../../custom_hooks/usePostFetch";
import { AttributeValuesType } from "../../../types/AttributesType";
import { GetServerSideProps } from "next";
import { ShopsType } from "../../../types/ShopsType";
import SellerShopsCard from "../../../components/Account/attributes/create/SellerShopsCard";
import { ParseCookies } from "../../../utils/ParseCookies";
import { store } from "../../../Redux/store";
import { FetchUserInfo } from "../../../Redux/userInfo";



export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = ParseCookies(context.req.headers.cookie || "");
  await store.dispatch(FetchUserInfo(cookies["jwt"] || ""));
  if (store.getState().userInfo.value?.AccountType!=="Seller") {
    return {
      // redirect: {
      //   permanent: true,
      //   destination: "/account",
      // },
      notFound:true
      
    };
  }
  const [SellerShops] = await Promise.all([(await fetch("http://nginx-proxy/shops-service/sellershops", { headers: { Authorization: cookies["jwt"] } })).json()]);
  return {
    props: {
      SellerShops,
      InitialState: store.getState(),
    },
  };
};
const create = ({ SellerShops }: { SellerShops: ShopsType[] }) => {
  const [Name, setName] = useState("");
  const [AttributeValues, setAttributeValues] = useState<AttributeValuesType>([]);
  const [createEnable, setcreateEnable] = useState(false);
  const [ShopId, setShopId] = useState("");
  const { data, IsPending, err, post } = usePostFetch();
  useEffect(() => {
    if (ShopId&&Name && AttributeValues.length > 0) {
      let checkAttributeValues = true;
      for (let i = 0; i < AttributeValues.length; i++) {
        if (!AttributeValues[i].Value) {
          checkAttributeValues = false;
          break;
        }
      }
      if (checkAttributeValues) {
        setcreateEnable(true);
      } else {
        setcreateEnable(false);
      }
    } else {
      setcreateEnable(false);
    }
  }, [Name, AttributeValues, ShopId]);

  function create() {
    const payload: any = {};
    ShopId&&(payload.ShopId=ShopId)
    Name && (payload.Name = Name);
    AttributeValues.length > 0 && (payload.AttributeValues = AttributeValues);
    post("/shops-service/attributes/createattribute", JSON.stringify(payload));
  }

  useEffect(() => {
    if (data) {
      console.log(data);
    }
  }, [data]);

  return (
    <div>
      <Headder />
      <div className="flex mt-[60px]">
        <div className="w-[350px] h-[calc(100vh-62px)] sticky top-[62px]">
          <NavList />
        </div>
        <div className="bg-gray-100 w-full p-10 ">
          <form className="space-y-10">
            <CreateAttributeHeadderCard />
            <GeneralInfoCard Name={Name} setName={setName} />
            <SellerShopsCard Shops={SellerShops} setShopId={setShopId} />
            <AttributeValuesCard AttributeValues={AttributeValues} setAttributeValues={setAttributeValues} />
            {createEnable ? (
              <div onClick={create} className="flex justify-end">
                <div className="px-5 cursor-pointer drop-shadow-lg hover:bg-zinc-600  transition ease-in-out  select-none py-2 rounded-md bg-zinc-500 text-white">create</div>
              </div>
            ) : (
              <div className="flex justify-end">
                <div className="px-5  drop-shadow-lg  transition ease-in-out  select-none py-2 rounded-md bg-zinc-400 text-white">create</div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default create;
