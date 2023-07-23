import React, { useEffect, useRef, useState } from "react";

type props = {
  List: { Id: string; Name: string }[];
  Value: string[];
  setValue: (v: string[] | ((v: string[]) => string[])) => void;
};

function MultiDropList({ List, Value, setValue }: props) {
  const [inputval, setinputval] = useState("");
  const [ShowList, setShowList] = useState(false);
  const [ListState, setListState] = useState(List);
  const [ValueState, setValueState] = useState(List.filter((v) => Value.includes(v.Id)));
  const inputref = useRef<HTMLInputElement | null>(null);
  const DropRef = useRef<HTMLDivElement | null>(null);
    useEffect(() => {
      function handle(e: any) {
        if (DropRef.current && DropRef.current?.contains(e.target as any)) return;
        setShowList(false);
      }
      document.addEventListener("click", handle);
      return () => {
        document.removeEventListener("click", handle);
      };
    }, []);
  const [focus, setfocus] = useState(false);
  useEffect(() => {
    if (ValueState) {
      setValue(ValueState.map((v) => v.Id));
    }
  }, [ValueState]);

  useEffect(() => {
    setListState(List.filter((listvalue) => (inputval ? listvalue.Name.toLocaleLowerCase().includes(inputval.toLocaleLowerCase()) : true)&&(!Value.includes(listvalue.Id))));
  }, [inputval, List,Value]);


  function onclick() {
    !focus && inputref.current?.focus();
    setShowList((v) => !v);
  }
  function choose(v: { Id: string; Name: string }) {
    setinputval("");
    setValueState((l) => [...l, v]);
    setShowList(false);
    !focus && inputref.current?.focus();
  }
  function deleteValue(val: { Id: string; Name: string }) {
    setValueState((listvalues) => listvalues.filter((listvalue) => listvalue.Id !== val.Id));
    !focus && inputref.current?.focus();
  }
  function onfocus() {
    setfocus(true);
  }
  return (
    <div className="relative" ref={DropRef}>
      <div onClick={onclick}>
        <div className=" bg-transparent border-zinc-400 border rounded-md   w-full text-zinc-900 ">
          <div className="px-4 py-2 min-h-[40px] flex flex-wrap w-full gap-2">
            {ValueState.length > 0 &&
              ValueState.map((v) => (
                <div key={v.Id} className=" text-white   rounded-full flex space-x-2 items-center text bg-zinc-500 ">
                  <div className="select-none pl-3 ">{v.Name}</div>
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteValue(v);
                    }}
                    className="border-l  pr-2 pl-1 cursor-pointer select-none  hover:text-red-400"
                  >
                    <i className="fas fa-times"></i>
                  </div>
                </div>
              ))}
            <input
              ref={inputref}
              value={inputval}
              onKeyDown={(e) => console.log(e)}
              onFocus={onfocus}
              onChange={(e) => {
                setinputval(e.target.value);
                setShowList(true);
              }}
              type="text"
              className="outline-none bg-transparent flex-grow w-0   rounded-md   text-zinc-900"
              placeholder={ValueState.length > 0 ? "" : "Select ..."}
            />
          </div>
        </div>

        <i className="fa-regular fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
      </div>
      <div className="relative">
        {ShowList && (
          <div onClick={(e) => e.stopPropagation()} className={` z-10 absolute  top-[7px] overscroll-contain rounded-md border-gray-300 border w-full bg-white drop-shadow-md overflow-auto max-h-[250px] py-2`}>
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

export default MultiDropList;
