import { GetServerSideProps } from "next";
import { ParseCookies } from "../../../utils/ParseCookies";
import { FetchUserInfo } from "../../../Redux/userInfo";
import { store } from "../../../Redux/store";
import { UserInfoType } from "../../../types/UserInfoType";
import Headder from "../../../components/layout/headder";
import NavList from "../../../components/Account/NavList";
import UsersHeadder from "../../../components/Account/users/UsersHeadder";
import UsersTable from "../../../components/Account/users/UsersTable";
import { useRouter } from "next/router";
import Pagination from "../../../components/lib/Pagination";


export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = ParseCookies(context.req.headers.cookie || "");
  const pg=(Number.parseInt(""+context?.query?.page)||1)
  const role=""+(context?.query?.role||"")
  const page=pg<1?1:pg;
  const Role = role?role:"Client";

  if(Role!==role||""+page!==""+pg){
    return {
      redirect: {
        destination: `/account/users?page=${page}&role=${Role}`,
        permanent: true,
      },
    };
  }

  
  await store.dispatch(FetchUserInfo(cookies["jwt"]));
  if(store.getState().userInfo.value.AccountType!=="Admin"){
    return {
      notFound:true
    }
  }
  const [Users] = await Promise.all([(await fetch(`http://nginx-proxy/user-service/users?page=${page}&role=${Role}`,{headers:{Authorization:cookies["jwt"]||""}})).json() ]);
  if(Users.Page!==page||Users.Role!==Role){
    return {
      redirect: {
        destination: `/account/users?page=${Users.Page}&role=${Users.Role}`,
        permanent: true,
      },
    };
  }
  return {
    props: {
      Users,
      InitialState: store.getState(),
    },
  };
};

function index({ Users }: {Users:{ Page: number; HasNext: boolean; Count: number; Pages: number; Role: string; Data :UserInfoType[]}}) {
  const router = useRouter();

  function setPage(fun: (v: number) => number) {
    router.push(`/account/users?page=${fun(Users.Page)}&role=${router.query.role}`);
  }
  function setRole(Role: string) {
    router.push(`/account/users?page=${router.query.page}&role=${Role}`);
  }  return (
    <div>
      <Headder />
      <div className="flex  mt-[60px]">
        <div className="w-[260px] h-[calc(100vh-60px)] sticky top-[60px]">
          <NavList />
        </div>
        <div className="w-[calc(100%-260px)] bg-gray-100   justify-between p-8 space-y-10">
          <UsersHeadder Role={router.query.role as string} setRole={setRole} />
          <UsersTable Users={Users.Data} />
          <Pagination HasNext={Users.HasNext} Page={Users.Page} setPage={setPage} Pages={Users.Pages} />
        </div>
      </div>
    </div>
  );
}

export default index