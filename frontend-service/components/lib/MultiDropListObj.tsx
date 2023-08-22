import React, { useEffect, useRef, useState } from "react";

type props = {
  List: { Id: string; Name: string }[];
  Value: { Id: string; Name: string }[];
  setValue: (v: { Id: string; Name: string }[] | ((v: { Id: string; Name: string }[]) => { Id: string; Name: string }[])) => void;
};

function MultiDropListObj({ List, Value, setValue }: props) {
  const [hover, sethover] = useState(-1);

  const [inputval, setinputval] = useState("");
  const [ShowList, setShowList] = useState(false);
  //const [MouseOver, setMouseOver] = useState(false);
  const [ListState, setListState] = useState(List);
  // const [ValueState, setValueState] = useState(List.filter((v) => {return Value.some(vv=>true)}));
  const inputref = useRef<HTMLInputElement | null>(null);
  const [focus, setfocus] = useState(false);
  const DropRef = useRef<HTMLDivElement | null>(null);
  // useEffect(() => {
  //   if (ValueState.length>0) {
  //     setValue([...ValueState]);
  //   }
  // }, [ValueState]);

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
    setListState(List.filter((listvalue) => (inputval ? listvalue.Name.toLocaleLowerCase().includes(inputval.toLocaleLowerCase()) : true) && !Value.some((v) => v.Id === listvalue.Id)));
  }, [inputval, List, Value]);

  // function onmouseOver() {
  //   setMouseOver(true);
  // }
  // function onmouseLeave() {
  //   setMouseOver(false);
  // }
  // function onblur() {
  //   setfocus(false);
  //   if (!MouseOver) {
  //     setShowList(false);
  //     setMouseOver(false);
  //     setinputval("");
  //   }
  // }
  function onclick() {
    !focus && inputref.current?.focus();
    setShowList((v) => !v);
  }
  function choose(v: { Id: string; Name: string }) {
    setinputval("");
    setValue((l) => [...l, v]);
    setShowList(false);
    sethover(-1)
    !focus && inputref.current?.focus();
  }
  function deleteValue(val: { Id: string; Name: string }) {
    setShowList(false);
    setValue((listvalues) => listvalues.filter((listvalue) => listvalue.Id !== val.Id));
    !focus && inputref.current?.focus();
  }
  function onfocus() {
    setfocus(true);
  }
  return (
    <div
      className="relative"
      ref={DropRef}
      //  onMouseOver={onmouseOver}
      // onMouseLeave={onmouseLeave}
    >
      <div onClick={onclick}>
        <div className=" bg-transparent border-zinc-400 border rounded-md   w-full text-zinc-900 ">
          <div className="px-4 py-2 min-h-[40px] flex flex-wrap w-full gap-2">
            {Value.length > 0 &&
              Value.map((v) => (
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
              //onBlur={onblur}

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
              value={inputval}
              onFocus={onfocus}
              onChange={(e) => {
                setinputval(e.target.value);
                setShowList(true);
              }}
              type="text"
              className="outline-none bg-transparent flex-grow w-0   rounded-md   text-zinc-900"
              placeholder={Value.length > 0 ? "" : "Select ..."}
            />
          </div>
        </div>

        <i className="fa-regular fa-chevron-down absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-xs"></i>
      </div>
      <div className="relative">
        {ShowList && (
          <div onClick={(e) => e.stopPropagation()} className={` z-10 absolute  top-[7px] overscroll-contain rounded-md border-gray-300 border w-full bg-white drop-shadow-md overflow-auto max-h-[250px] py-2`}>
            {ListState.map((v,index) => (
              <div onClick={() => choose(v)} key={v.Id} className="hover:bg-gray-100 cursor-pointer select-none">
                <div className={`${hover===index?"bg-gray-100":""} p-3 text-gray-500 border-b`}>{v.Name}</div>
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

export default MultiDropListObj;
