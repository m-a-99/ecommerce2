import React from "react";
type props = {
  Page: number;
  setPage(v: number | ((v: number) => number)): void;
  HasNext: boolean;
  Pages?:number
};
function Pagination({ Page, HasNext, setPage,Pages }: props) {
  if (Page > 1) {
    return (
      <div className="flex justify-center gap-1 items-center">
        {/***************************************** */}
        <div
          onClick={() => {
            setPage((v) => v - 1);
          }}
          className="w-16 mx-2  hover:bg-indigo-400 hover:text-white h-8 bg-gray-300 rounded-full cursor-pointer select-none flex justify-center items-center text-indigo-500 gap-1"
        >
          <i className="fa-regular fa-angle-left"></i>
          <div>Prev</div>
        </div>
        {/***************************************** */}
        {Page > 2 && (
          <>
            <div
              onClick={() => {
                setPage((v) => 1);
              }}
              className=" w-7 h-7  hover:bg-indigo-400 bg-gray-300 rounded-full cursor-pointer select-none flex justify-center items-center text-white"
            >
              {1}
            </div>
            {Page > 3 && (
              <div className=" w-7 h-7   bg-gray-300 rounded-full cursor-pointer select-none flex justify-center items-center text-white">
                <i className="fas fa-ellipsis"></i>
              </div>
            )}
          </>
        )}
        {/***************************************** */}

        {!HasNext && Page - 2 > 0 && (
          <div
            onClick={() => {
              setPage((v) => v - 2);
            }}
            className="w-7 h-7  hover:bg-indigo-400  bg-gray-300 rounded-full cursor-pointer select-none flex justify-center items-center text-white"
          >
            {Page - 2}
          </div>
        )}
        {/***************************************** */}
        <div
          onClick={() => {
            setPage((v) => v - 1);
          }}
          className="w-7 h-7  hover:bg-indigo-400  bg-gray-300 rounded-full cursor-pointer select-none flex justify-center items-center text-white"
        >
          {Page - 1}
        </div>
        {/***************************************** */}
        {<div className=" w-7 h-7  hover:bg-indigo-400 bg-indigo-400 rounded-full cursor-pointer select-none flex justify-center items-center text-white">{Page}</div>}
        {/***************************************** */}
        {HasNext && (
          <div
            onClick={() => {
              setPage((v) => v + 1);
            }}
            className="w-7 h-7  hover:bg-indigo-400 bg-gray-300  rounded-full cursor-pointer select-none flex justify-center items-center text-white"
          >
            {Page + 1}
          </div>
        )}
        {/***************************************** */}

        {Pages !== undefined && Pages !== 0 && ![Pages, Pages - 1].includes(Page) && (
          <>
            {Pages > Page + 2 && (
              <div className=" w-7 h-7   bg-gray-300 rounded-full cursor-pointer select-none flex justify-center items-center text-white">
                <i className="fas fa-ellipsis"></i>
              </div>
            )}
            <div
              onClick={() => {
                setPage((v) => Pages);
              }}
              className=" w-7 h-7  hover:bg-indigo-400 bg-gray-300 rounded-full cursor-pointer select-none flex justify-center items-center text-white"
            >
              {Pages}
            </div>
          </>
        )}

        {/***************************************** */}
        {HasNext ? (
          <div
            onClick={() => {
              setPage((v) => v + 1);
            }}
            className="w-16  mx-2 hover:bg-indigo-400 hover:text-white h-8 bg-gray-300 rounded-full cursor-pointer select-none flex justify-center items-center text-indigo-500 gap-1"
          >
            <div>Next</div>
            <i className="fa-regular fa-angle-right"></i>
          </div>
        ) : (
          <div className="w-16    mx-2 text-white h-8 bg-gray-300 rounded-full cursor-pointer select-none flex justify-center items-center gap-1">
            <div>Next</div>
            <i className="fa-regular fa-angle-right"></i>
          </div>
        )}
        {/***************************************** */}
      </div>
    );
  } else {
    return (
      <div className="flex justify-center gap-1 items-center">
        {/***************************************** */}
        <div className="w-16 mx-2 text-white h-8 bg-gray-300 rounded-full cursor-pointer select-none flex justify-center items-center gap-1">
          <i className="fa-regular fa-angle-left"></i>
          <div>Prev</div>
        </div>
        {/***************************************** */}

        <div className="w-7 h-7   hover:bg-indigo-400 bg-indigo-400 rounded-full cursor-pointer select-none flex justify-center items-center text-white">{Page}</div>
        {/***************************************** */}
        {HasNext && (
          <div
            onClick={() => {
              setPage((v) => v + 1);
            }}
            className=" w-7 h-7  hover:bg-indigo-400  bg-gray-300  rounded-full cursor-pointer select-none flex justify-center items-center text-white"
          >
            {Page + 1}
          </div>
        )}
        {/***************************************** */}

        {Pages !== undefined &&Pages!==0 && ![Pages, Pages - 1].includes(Page) && (
          <>
            {Pages > Page + 2 && (
              <div className=" w-7 h-7   bg-gray-300 rounded-full cursor-pointer select-none flex justify-center items-center text-white">
                <i className="fas fa-ellipsis"></i>
              </div>
            )}
            <div
              onClick={() => {
                setPage((v) => Pages);
              }}
              className=" w-7 h-7  hover:bg-indigo-400 bg-gray-300 rounded-full cursor-pointer select-none flex justify-center items-center text-white"
            >
              {Pages}
            </div>
          </>
        )}
        {/***************************************** */}
        {HasNext ? (
          <div
            onClick={() => {
              setPage((v) => v + 1);
            }}
            className="w-16 mx-2 hover:bg-indigo-400 hover:text-white h-8 bg-gray-300 rounded-full cursor-pointer select-none flex justify-center items-center text-indigo-500 gap-1"
          >
            <div>Next</div>
            <i className="fa-regular fa-angle-right"></i>
          </div>
        ) : (
          <div className="w-16  mx-2 text-white h-8 bg-gray-300 rounded-full cursor-pointer select-none flex justify-center items-center  gap-1">
            <div>Next</div>
            <i className="fa-regular fa-angle-right"></i>
          </div>
        )}
        {/***************************************** */}
      </div>
    );
  }
}

export default Pagination;
