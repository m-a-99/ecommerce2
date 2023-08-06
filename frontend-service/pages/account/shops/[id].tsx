import { GetServerSideProps } from 'next';
import React from 'react'
import { ParseCookies } from '../../../utils/ParseCookies';
import { store } from '../../../Redux/store';
import Headder from '../../../components/layout/headder';
import NavList from '../../../components/Account/NavList';
import { FetchUserInfo } from '../../../Redux/userInfo';
import { ShopsType } from '../../../types/ShopsType';
import ShopInfoCard from '../../../components/Account/shops/ShopInfoCard';
import ShopCoverImageCard from '../../../components/Account/shops/ShopCoverImageCard';
import ShopDashCard from '../../../components/Account/shops/ShopDashCard';
import ShopPaymentInfoCard from '../../../components/Account/shops/ShopPaymentInfoCard';

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = ParseCookies(context.req.headers.cookie || "");
  const ShopId=context.params?.id||"";
  
  const [shop] = await Promise.all([(await fetch(`http://nginx-proxy/shops-service/shops/${ShopId}`, { headers: { Authorization: cookies["jwt"] } })).json(), store.dispatch(FetchUserInfo(cookies["jwt"]))]);
  if (shop.ok===false) {
    return {
      notFound: true,
    };
  }
  return {
    props: {
      shop,
      InitialState: store.getState(),
    },
  };
};

function ShopInfo({ shop }:{shop:ShopsType}) {
  return (
    <div>
      <Headder />
      <div className="flex mt-[60px]">
        <div className="w-[260px] h-[calc(100vh-60px)] sticky top-[60px]">
          <NavList />
        </div>
        <div className="  w-[calc(100%-260px)]  bg-gray-100 p-5   justify-between space-y-5">
          <div className="flex gap-4">
            <div className="w-1/4 drop-shadow-md ">
              <ShopInfoCard shop={shop} />
            </div>

            <div className="w-3/4  drop-shadow-md">
              <ShopCoverImageCard shop={shop} />
            </div>
          </div>
          <div className="flex gap-4">
            <div className="drop-shadow-md w-3/4">
              <ShopDashCard shop={shop} />
            </div>
            <div className="w-1/4 drop-shadow-md ">
              <ShopPaymentInfoCard shop={shop} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShopInfo