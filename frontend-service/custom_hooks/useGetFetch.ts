import { useEffect, useRef, useState } from "react";
import Cookies from "universal-cookie";

const useGetFetch = () => {
  const [data, setdata] = useState<any>(null);
  const [err, seterr] = useState<any>(null);
  const [IsPending, setIsPending] = useState(false);
  const abortcont = useRef<AbortController>();
  const cookies = new Cookies();

  useEffect(() => {
    abortcont.current = new AbortController();
    return () => {
      abortcont.current && abortcont.current.abort();
    };
  }, []);

  const get = async (path: string) => {
    setIsPending(true);
    const url = process.env.NEXT_PUBLIC_SERVERURL + path;
    const res = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: cookies.get("jwt"),
      },
      //credentials: "include",
      signal: abortcont.current?.signal,
    });
    if (res.ok) {
      const resdata = await res.json();
      setdata(resdata);
      setIsPending(false);
    } else {
      const resdata = await res.text();
      try {
        const jsonResdata = JSON.parse(resdata);
        if (jsonResdata.name === "AbortError") {
          console.log("fetch Aborted");
        } else {
          console.log(jsonResdata);
          seterr(jsonResdata);
          setIsPending(false);
        }
      } catch (e:any) {
        seterr({ message: resdata });
        setIsPending(false);
      }
    }
  };
  return { data, IsPending, err, get };
};

export default useGetFetch;
