import { GetServerSideProps } from "next";
import { ParseCookies } from "../../../../utils/ParseCookies";
import { FetchUserInfo } from "../../../../Redux/userInfo";
import { store } from "../../../../Redux/store";
import Headder from "../../../../components/layout/headder";
import NavList from "../../../../components/Account/NavList";
import UserDetailsHedder from "../../../../components/Account/users/details/components/UserDetailsHedder";
import UserAddressAndDetails from "../../../../components/Account/users/details/components/UserAddressAndDetails";
import UserOrdersCard from "../../../../components/Account/users/userorders/UserOrdersCard";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = ParseCookies(context.req.headers.cookie || "");
  await store.dispatch(FetchUserInfo(cookies["jwt"] || ""));
  if (store.getState().userInfo.value?.AccountType !== "Admin") {
    return {
      // redirect: {
      //   permanent: true,
      //   destination: "/account",
      // },
      notFound: true,
    };
  }
  const id = context?.query?.id || "";
  const [user, orderstatus, userOrders] = await Promise.allSettled([
    fetch("http://nginx-proxy/user-service/user/" + id, { headers: { Authorization: cookies["jwt"] } }).then((res) => res.json()),
    fetch("http://nginx-proxy/shopping-service/orderstatus/all", { headers: { Authorization: cookies["jwt"] || "" } }).then((res) => res.json()),
    fetch("http://nginx-proxy/shopping-service/userorders/" + id, { headers: { Authorization: cookies["jwt"] || "" } }).then((res) => res.json()),
  ]);
  return {
    props: {
      user,
      userOrders,
      orderstatus,
      InitialState: store.getState(),
    },
  };
};

function create({ user, orderstatus,userOrders }: any) {
  console.log(userOrders);
  return (
    <div>
      <Headder />
      <div className="flex mt-[60px]">
        <div className="w-[260px] h-[calc(100vh-60px)] sticky top-[60px]">
          <NavList />
        </div>
        <div className=" w-[calc(100%-260px)] bg-gray-100 p-10 ">
          <form className="space-y-10">
            <UserDetailsHedder User={user.value} />
            <UserAddressAndDetails User={user.value} />
            <UserOrdersCard OrderStatus={orderstatus.value} Orders={userOrders.value} />
          </form>
        </div>
      </div>
    </div>
  );
}

export default create;
