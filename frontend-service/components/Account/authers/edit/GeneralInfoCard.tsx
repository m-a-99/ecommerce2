
type props = {
  Languages: string;
  setLanguages: (v: string) => void;
  Bio: string;
  setBio: (v: string) => void;
  Name: string;
  setName: (name: ((n: string) => string) | string) => void;
  Quote: string;
  setQuote: (v: string) => void;
  Born: string;
  setBorn: (v: string) => void;
  Death: string;
  setDeath: (v: string) => void;
};

function GeneralInfoCard({ Bio, Born, Death, Languages, Name, Quote, setBio, setBorn, setDeath, setLanguages, setName, setQuote }: props) {
  return (
    <div className="bg-white rounded-md shadow-md px-10 w-full">
      <div className="flex justify-between border-b py-10">
        <div className="w-1/3 text-lg text-gray-600 font-semibold space-y-2">
          <p>General Info</p>
        </div>
        <div className="w-7/12 space-y-2">
          <div className="space-y-1">
            <div className="text-gray-600">Name</div>
            <div className="w-full">
              <input type="text" className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" value={Name} onChange={(e) => setName(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600">Languages</div>
            <div className="w-full">
              <input type="text" className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" value={Languages} onChange={(e) => setLanguages(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600">Bio</div>
            <div className="w-full">
              <input type="text" className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" value={Bio} onChange={(e) => setBio(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600">Quote</div>
            <div className="w-full">
              <input type="text" className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" value={Quote} onChange={(e) => setQuote(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600">Born</div>
            <div className="w-full">
              <input type="date" className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" defaultValue={Born} onChange={(e) => setBorn(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600">Death</div>
            <div className="w-full">
              <input type="date" className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" defaultValue={Death} onChange={(e) => setDeath(e.target.value)} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default GeneralInfoCard;
