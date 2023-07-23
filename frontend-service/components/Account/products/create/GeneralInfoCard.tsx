type props = {
  Name: string;
  setName: (name: ((n: string) => string) | string) => void;
  Unit:string;
  setUnit:(v:string)=>void;
  Description:string;
  setDescription:(v:string)=>void;
  Status:string;
  setStatus:(v:string)=>void;
};


const GeneralInfoCard = ({ Name, setName ,Description,Status,Unit,setDescription,setStatus,setUnit}: props) => {
  function select(v:string){
    setStatus(v);
  }
  return (
    <div className="bg-white rounded-md shadow-md px-10 w-full">
      <div className="flex justify-between border-b py-10">
        <div className="w-1/3 text-lg text-gray-600 font-semibold space-y-2">
          <p>Description</p>
          <p className="text-sm text-gray-400">Product Description </p>
        </div>
        <div className="w-7/12 space-y-2">
          <div className="space-y-1">
            <div className="text-gray-600">Name*</div>
            <div className="w-full">
              <input type="text" className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" value={Name} onChange={(e) => setName(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600">Unit*</div>
            <div className="w-full">
              <input type="text" className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" value={Unit} onChange={(e) => setUnit(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600">Description</div>
            <div className="w-full">
              <input type="text" className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" value={Description} onChange={(e) => setDescription(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600">Status</div>
            <div className="w-full space-y-2">
              <div onClick={() => select("Published")} className="flex cursor-pointer items-center space-x-2 text-gray-500">
                <div className="p-[3px] border-[1px] border-gray-400 w-[18px] h-[18px] rounded-full">
                  <div className={`w-full rounded-full h-full ${Status === "Published" ? "bg-blue-600" : ""}`}></div>
                </div>
                <div>Published</div>
              </div>
              <div onClick={() => select("Draft")} className="flex cursor-pointer items-center space-x-2 text-gray-500">
                <div className="p-[3px] border-[1px] border-gray-400 w-[18px] h-[18px] rounded-full">
                  <div className={`w-full rounded-full h-full ${Status === "Draft" ? "bg-blue-600" : ""}`}></div>
                </div>
                <div>Draft</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralInfoCard;
