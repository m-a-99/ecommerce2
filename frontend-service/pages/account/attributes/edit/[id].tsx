import { GetServerSideProps } from "next";
import { ParseCookies } from "../../../../utils/ParseCookies";
import { FetchUserInfo } from "../../../../Redux/userInfo";
import { store } from "../../../../Redux/store";
import { useEffect, useState } from "react";
import { ShopsType } from "../../../../types/ShopsType";
import { AttributeType, AttributeValuesType, AttributesType } from "../../../../types/AttributesType";
import Headder from "../../../../components/layout/headder";
import NavList from "../../../../components/Account/NavList";
import EditAttributeHeadderCard from "../../../../components/Account/attributes/edit/EditAttributeHeadderCard";
import GeneralInfoCard from "../../../../components/Account/attributes/edit/GeneralInfoCard";
import SellerShopsCard from "../../../../components/Account/attributes/edit/SellerShopsCard";
import AttributeValuesCard from "../../../../components/Account/attributes/edit/AttributeValuesCard";
import usePutFetch from "../../../../custom_hooks/usePutFetch";
import { useRouter } from "next/router";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = ParseCookies(context.req.headers.cookie || "");
  await store.dispatch(FetchUserInfo(cookies["jwt"] || ""));
  if (store.getState().userInfo.value?.AccountType !== "Seller") {
    return {
      // redirect: {
      //   permanent: true,
      //   destination: "/account",
      // },
      notFound: true,
    };
  }
  const id = context?.params?.id || "";
  const [SellerShops, Attribute] = await Promise.all([(await fetch("http://nginx-proxy/shops-service/sellershops", { headers: { Authorization: cookies["jwt"] } })).json(), fetch("http://nginx-proxy/shops-service/attributes/" + id).then((res) => res.json())]);
  return {
    props: {
      SellerShops,
      Attribute,
      InitialState: store.getState(),
    },
  };
};
const Edit = ({ SellerShops, Attribute }: { SellerShops: ShopsType[]; Attribute: AttributeType }) => {
  const [Name, setName] = useState(Attribute.Name);
  const [AttributeValues, setAttributeValues] = useState<AttributeValuesType>(Attribute.AttributeValues);
  const [createEnable, setcreateEnable] = useState(false);
  const [ShopId, setShopId] = useState(Attribute.ShopId);
  const [DeletedAttributeValuesIds, setDeletedAttributeValuesIds] = useState<string[]>([]);

  const router = useRouter();
  const { data, IsPending, err, put } = usePutFetch();
  useEffect(() => {
    if (ShopId && Name && AttributeValues.length > 0) {
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

  function edit() {
    const payload: any = {};
    ShopId && (payload.ShopId = ShopId);
    Name && (payload.Name = Name);
    AttributeValues.length > 0 && (payload.AttributeValues = AttributeValues);
    if (DeletedAttributeValuesIds.length > 0) {
        const tmp:any={};
        Attribute.AttributeValues.forEach(val=>{
            tmp[val._id]=val;
        })
      payload.DeletedAttributeValuesIds = DeletedAttributeValuesIds.filter(v=>tmp[v]?true:false);
    }
    const id = router.query?.id || "";
    put("/shops-service/attributes/" + id, JSON.stringify(payload));
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
            <EditAttributeHeadderCard />
            <GeneralInfoCard Name={Name} setName={setName} />
            <SellerShopsCard Shops={SellerShops} ShopId={ShopId} setShopId={setShopId} />
            <AttributeValuesCard DeletedAttributeValuesIds={DeletedAttributeValuesIds} setDeletedAttributeValuesIds={setDeletedAttributeValuesIds} AttributeValues={AttributeValues} setAttributeValues={setAttributeValues} />
            {createEnable ? (
              <div onClick={edit} className="flex justify-end">
                <div className="px-5 cursor-pointer drop-shadow-lg hover:bg-zinc-600  transition ease-in-out  select-none py-2 rounded-md bg-zinc-500 text-white">Save</div>
              </div>
            ) : (
              <div className="flex justify-end">
                <div className="px-5  drop-shadow-lg  transition ease-in-out  select-none py-2 rounded-md bg-zinc-400 text-white">Save</div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};

export default Edit;
