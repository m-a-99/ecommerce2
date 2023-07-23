const LayoutCard = ({ value, setvalue, name,Key }: {Key:string, value: string; setvalue: any; name: string }) => {
  return (
    <div onClick={() => setvalue(Key)} className=" cursor-pointer  flex flex-col items-center w-[150px] h-[180px] border rounded-md p-3 space-y-2">
      <div className="flex-grow w-full">
        <div className="bg-blue-400 h-full  rounded-sm w-full"></div>
      </div>
      <div className="flex items-center space-x-2">
        <div className={`w-[18px] h-[18px] rounded-full  border border-gray-400 p-[3px] flex justify-center items-center`}>
          <div className={`w-full h-full rounded-full transition duration-150  ease-in-out ${value === Key ? "bg-green-500" : ""}`}></div>
        </div>

        <div className="text-gray-600">{name}</div>
      </div>
    </div>
  );
};

export default LayoutCard;
