type props = {
  Name: string;
  setName: (v: string) => void;
  Description: string;
  setDescription: (v: string) => void;
};
const GeneralInfoCard = ({ Name, Description, setName, setDescription }: props) => {
  return (
    <div className="bg-white rounded-md shadow-md px-10 w-full">
      <div className="flex justify-between border-b py-10">
        <div className="w-1/3 text-lg text-gray-600 font-semibold space-y-2">
          <p>General Info</p>
        </div>
        <div className="w-7/12 space-y-2">
          <div className="space-y-1">
            <div className="text-gray-600">Shop Name</div>
            <div className="w-full">
              <input type="text" className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" value={Name} onChange={(e) => setName (e.target.value)} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600">Description</div>
            <div className="w-full">
              <textarea value={Description} onChange={(e) => setDescription (e.target.value)} className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralInfoCard;
