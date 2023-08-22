import React, { useEffect, useRef, useState } from "react";

type props = {
  List: { Id: string; Name: string }[];
  Value: { Id: string; Name: string };
  setValue: (v: { Id: string; Name: string }) => void;
};

function DropListObj({ List, Value, setValue }: props) {
  const [hover, sethover] = useState(-1);

  const [inputval, setinputval] = useState("");
  const [ShowList, setShowList] = useState(false);
  const [ListState, setListState] = useState(List);
  // const [ValueState, setValueState]=useState(Value&&List.filter((v)=>v.Id===Value.Id)[0]||{Id:"",Name:""});
  const [ValueState, setValueState] = useState(Value);
  const DropRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    function handle(e: any) {
      if (DropRef.current && DropRef.current?.contains(e.target as any)) return;
      setShowList(false);
      sethover(-1);
    }

    document.addEventListener("click", handle);
    return () => {
      document.removeEventListener("click", handle);
    };
  }, []);

  useEffect(() => {
    if (ValueState.Id) {
      setValue({ ...ValueState });
    }
  }, [ValueState]);

  useEffect(() => {
    setListState(List.filter((listvalue) => (inputval ? listvalue.Name.toLocaleLowerCase().includes(inputval.toLocaleLowerCase()) : true)));
  }, [inputval, List]);

  function onclick() {
    setShowList((v) => !v);
  }
  
  function choose(v: { Id: string; Name: string }) {
    setinputval("");
    setValueState(v);
    setShowList(false);
    sethover(-1);
  }
  return (
    <div className="relative" ref={DropRef}>
      <div onClick={onclick}>
        <div className="px-4 py-2 h-10">
          <div className=" text-gray-500 ">{inputval ? "" : ValueState.Name}</div>
        </div>
        <input
          value={inputval}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") {
              sethover((h) => (h === -1 ? 0 : (h + 1) % ListState.length));
            } else if (e.key === "ArrowUp") {
              sethover((h) => (h === -1 || h === 0 ? ListState.length - 1 : h - 1));
            } else if (e.key === "Enter") {
              if (hover > -1) {
                choose(ListState[hover]);
              }
            }
          }}
          onChange={(e) => {
            setinputval(e.target.value);
            setShowList(true);
          }}
          type="text"
          className="outline-none absolute top-0 bg-transparent border-zinc-400 border rounded-md px-4 py-2 w-full text-zinc-900"
          placeholder={ValueState.Name.length > 0 ? "" : "Select ..."}
        />
        <i className="fa-regular fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
      </div>
      <div className="relative">
        {ShowList && (
          <div className={` z-10 absolute top-[7px] overscroll-contain rounded-md border-gray-300 border w-full bg-white drop-shadow-md overflow-auto max-h-[250px] py-2`}>
            {ListState.map((v) => (
              <div onClick={() => choose(v)} key={v.Id} className="hover:bg-gray-100 cursor-pointer select-none">
                <div className="p-3 text-gray-500 border-b ">{v.Name}</div>
              </div>
            ))}
            {ListState.length == 0 && (
              <div className="hover:bg-gray-100 cursor-pointer select-none">
                <div className="p-1 text-gray-500  text-center">no options</div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default DropListObj;
