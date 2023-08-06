import { GetServerSideProps } from "next";
import { FetchProducts } from "../../../Redux/products";
import { store } from "../../../Redux/store";
import { FetchUserInfo } from "../../../Redux/userInfo";
import NavList from "../../../components/Account/NavList"
import ProductsTable from "../../../components/Account/products/ProductTable";
import ProductsHeadder from "../../../components/Account/products/ProductsHeadder";
import Headder from "../../../components/layout/headder"
import { ParseCookies } from "../../../utils/ParseCookies";
import { ProductType } from "../../../types/ProductType";

export const getServerSideProps:GetServerSideProps=async (context)=>{
  // const res = await fetch("http://nginx-proxy/shops-service/manufacturers");
  // const Manufacturers = await res.json();
 try{
  const cookies=ParseCookies(context.req.headers.cookie||"")
  await store.dispatch(FetchUserInfo(cookies["jwt"]))
  const [Products] = await Promise.all([new Promise(async(res,rej)=>{
    const url = store.getState().userInfo.value.AccountType === "Admin" ? "http://nginx-proxy/products-service/adminproducts" : "http://nginx-proxy/products-service/sellerproducts";
        const resdata = await fetch(url, { headers: { Authorization: cookies["jwt"] } });
        if (resdata.ok) {
          res(await resdata.json());
        } else {
          rej(resdata.json());
        }
  })]);
  return {
    props: {
      Products,
      InitialState: store.getState(),
    },
  };
 }catch(e:any){
  return {
    notFound:true
  }
 }
  
}

function index({ Products }: { Products :ProductType[]}) {
  return (
    <div>
      <Headder />
      <div className="flex  mt-[60px]">
        <div className="w-[260px] h-[calc(100vh-60px)] sticky top-[60px]">
          <NavList />
        </div>
        <div className=" w-[calc(100%-260px)] bg-gray-100   justify-between p-8 space-y-10">
          <ProductsHeadder />
          <ProductsTable Products={Products} />
        </div>
      </div>
    </div>
  );
}

export default index