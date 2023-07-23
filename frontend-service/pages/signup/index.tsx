import { NextPage } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import usePostFetch from "../../custom_hooks/usePostFetch";
import Cookies from "universal-cookie";

const Login: NextPage = () => {
  const [signinState, setsigninState] = useState(true);
  const [FirstName, setFirstName] = useState("");
  const [LastName, setLastName] = useState("");
  const [Email, setEmail] = useState("");
  const [AccountType, setAccountType] = useState("");
  const [Password, setPassword] = useState("");
  const [conf, setconf] = useState("");
  const { data, IsPending, err, post } = usePostFetch();
  const router = useRouter();
  const [errMsg, seterrMsg] = useState<any>({});

  useEffect(() => {
    if (err) {
      err?.message && seterrMsg(JSON.parse(err.message));
    }
  }, [err]);
  useEffect(() => {
    if (data) {
      console.log(data);
      const cookies = new Cookies();
      cookies.set("jwt", "Bearer " + data.Token, {
        path: "/",
        maxAge: data.MaxAge,
        //secure: true, use it when https because cookie wont be sent to on http connection when secure is true 
        sameSite: "strict",
      });
    
      router.back();
    }
  }, [data]);

  function Signup() {
    const payload = {
      FirstName: FirstName,
      LastName: LastName,
      Email: Email,
      AccountType: AccountType,
      Password: Password,
      ConfirmationPassword: conf,
    };

    post("/user-service/signup", JSON.stringify(payload));
  }

  function Signin() {
    const payload = {
      Email: Email,
      Password: Password,
    };
    post("/user-service/signin", JSON.stringify(payload));
  }

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    signinState ? Signin() : Signup();
  }
  return (
    <form onSubmit={onSubmit}>
      <div className="h-screen w-full transition-all bg-loginbg md:bg-loginbg2 lg:bg-loginbg2 bg-cover bg-center lg:px-28 md:px-28  py-16 shadow-md">
        <div className="lg:bg-white md:bg-white md:drop-shadow-lg lg:drop-shadow-lg w-full h-full md:rounded-2xl lg:rounded-2xl flex max-w-[800px] m-auto">
          {/* left_col_+ */}
          <div className="w-2/3 h-full lg:block md:block hidden">
            <div className="relative top-1/2 transition -translate-y-1/2 -mt-5 left-1/2 -translate-x-1/2">
              <Image src="/loginimg.png" width={0} height={0} sizes="100wv" alt="loginimg" className="w-full h-[70%]" />
              <div className="flex  select-none justify-center">
                <div onClick={() => setsigninState((v) => !v)} className=" px-3 py-[4px] hover:bg-gray-200  w-24 flex items-center  cursor-pointer justify-center  border-2 border-zinc-500 font-semibold  rounded-full">
                  {!signinState ? "Sign in" : "Sign up"}
                </div>
              </div>
            </div>
          </div>
          {/* left_col_- */}
          {/* right_col_+ */}
          <div className="lg:w-1/2 md:w-1/2 w-full  h-full flex flex-col justify-center items-center p-5  space-y-8 lg:space-y-4 md:space-y-4 ">
            <div className="select-none pointer-events-none	">
              <Image src={"/profile.png"} alt="profileimg" width={100} height={100} priority></Image>
            </div>

            {signinState ? <div>Sign in to your Account</div> : <div>Create New Account</div>}
            {errMsg && (
              <div className="text-sm customscrollbar text-center max-h-20 overflow-y-auto scrollbar-track-zinc-200 scrollbar-thin scrollbar-thumb-slate-400">
                {errMsg?.FirstName && <h1 className="text-red-500">{errMsg.FirstName}</h1>}
                {errMsg?.LastName && <h1 className="text-red-500">{errMsg.LastName}</h1>}
                {errMsg?.Email && <h1 className="text-red-500">{errMsg.Email}</h1>}
                {errMsg?.AccountType && <h1 className="text-red-500">{errMsg.AccountType}</h1>}
                {errMsg?.Password && <h1 className="text-red-500">{errMsg.Password}</h1>}
                {errMsg?.ConfirmationPassword && <h1 className="text-red-500">{errMsg.ConfirmationPassword}</h1>}
              </div>
            )}
            {!signinState && (
              <div className="flex ">
                <input
                  onChange={(e) => {
                    setFirstName(e.target.value);
                  }}
                  type="text"
                  placeholder="First name"
                  className="py-[6px] px-4 w-full max-w-[125px] outline-none rounded-l-full  focus:placeholder:text-indigo-500 border-2 border-r-[1px] border-zinc-400  focus:border-indigo-500 "
                />
                <input
                  onChange={(e) => {
                    setLastName(e.target.value);
                  }}
                  type="text"
                  placeholder="Last name"
                  className="py-[6px] px-4 w-full max-w-[125px] outline-none rounded-r-full  focus:placeholder:text-indigo-500 border-2 border-l-[1px] border-zinc-400  focus:border-indigo-500 "
                />
              </div>
            )}
            <input
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              type="text"
              placeholder="Email"
              className="py-[6px] px-4 w-full max-w-[250px] outline-none rounded-full  focus:placeholder:text-indigo-500 border-2 border-zinc-400  focus:border-indigo-500 "
            />
            {!signinState && (
              <div className="flex w-full h-10  max-w-[250px] border-2 border-zinc-400 rounded-full ">
                <div onClick={() => setAccountType("Client")} className={`${AccountType === "Client" ? "text-white bg-indigo-500" : "bg-gray-100 text-gray-500"} border-zinc-400 border-r-[0.25px] rounded-l-full w-1/2 h-full flex items-center justify-center   `}>
                  Client
                </div>
                <div onClick={() => setAccountType("Seller")} className={`${AccountType === "Seller" ? "text-white bg-indigo-500" : "bg-gray-100 text-gray-500"} border-zinc-400 border-l-[0.25px] rounded-r-full flex items-center justify-center w-1/2 h-full `}>
                  Seller
                </div>
              </div>
            )}
            <input
              onChange={(e) => {
                setPassword(e.target.value);
              }}
              type="Password"
              placeholder="Password"
              className="py-[6px] px-4 w-full max-w-[250px] outline-none rounded-full  focus:placeholder:text-indigo-500 border-2 border-zinc-400  focus:border-indigo-500 "
            />
            {!signinState && (
              <input
                onChange={(e) => {
                  setconf(e.target.value);
                }}
                type="Password"
                placeholder="confirm Password "
                className="py-[6px] px-4 w-full max-w-[250px] outline-none rounded-full  focus:placeholder:text-indigo-500 border-2 border-zinc-400  focus:border-indigo-500 "
              />
            )}
            <div className="flex space-x-4 select-none">
              {signinState ? (
                <input type="submit" value={"Sign in"} className="bg-indigo-600 hover:bg-indigo-500 cursor-pointer flex items-center justify-center px-3 py-[5px] w-24  text-white font-semibold  rounded-full" />
              ) : (
                <input type="submit" value={"Sign Up"} className="bg-indigo-600 hover:bg-indigo-500 cursor-pointer flex items-center justify-center px-3 py-[5px] w-24  text-white font-semibold  rounded-full" />
              )}
              <Link rel="stylesheet" href="http://localhost:3000/auth/google">
                <div className="w-10 h-10 cursor-pointer hover:bg-slate-100 flex items-center justify-center rounded-full bg-white drop-shadow-lg shadow-xl">
                  <i className="fa-brands text-red-500 fa-google"></i>
                </div>
              </Link>
            </div>
            <div onClick={() => setsigninState((v) => !v)} className=" text-indigo-600 font-semibold  cursor-pointer select-none rounded-full md:hidden lg:hidden">
              {!signinState ? "Sign in" : "Sign up"}
            </div>
          </div>
          {/* right_col_- */}
        </div>
      </div>
    </form>
  );
};

export default Login;
