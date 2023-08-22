import DragDrop from "../../../lib/DragDrop";
type props = {
  FirstName: string;
  setFirstName: (s: string | ((s: string) => string)) => void;
  LastName: string;
  setLastName: (s: string | ((s: string) => string)) => void;
  Email: string;
  setEmail: (s: string | ((s: string) => string)) => void;
  Img: File | null;
  setImg: (s: File | null | ((s: File | null) => File|null)) => void;
  Password: string;
  setPassword: (s: string | ((s: string) => string)) => void;
};

function GeneralInfoCard({ FirstName, setFirstName, LastName, setLastName, Email, setEmail, Img, setImg, Password, setPassword }: props) {
  return (
    <div className="bg-white rounded-md shadow-md px-10 w-full">
      <div className="flex justify-between border-b py-10">
        <div className="w-1/3 text-lg text-gray-600 font-semibold space-y-2">
          <p>General Info</p>
        </div>
        <div className="w-7/12 space-y-2">
          <div className="space-y-1">
            <div className="text-gray-600">FirstName</div>
            <div className="w-full">
              <input type="text" className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" value={FirstName} onChange={(e) => setFirstName(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600">LastName</div>
            <div className="w-full">
              <input type="text" className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" value={LastName} onChange={(e) => setLastName(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600">Email</div>
            <div className="w-full">
              <input type="text" className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" value={Email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600">Password</div>
            <div className="w-full">
              <input type="password" className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" value={Password} onChange={(e) => setPassword(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600">Img</div>
            <DragDrop extentions="jpg,svg,png" fileType="image" file={Img} setfile={setImg} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default GeneralInfoCard;
