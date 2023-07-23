type props={
    Search:string
    setSearch:(v:string)=>void
}
function SearchCard({Search,setSearch}: props) {
  return (
    <div className="flex">
      <input placeholder="Search yor products from here" className="w-[400px] border-[1px] border-gray-300  rounded-l-full drop-shadow-md px-6 p-4 outline-none " type="text" value={Search} onChange={(e) => setSearch(e.target.value)} />
      <div className="flex justify-center gap-1 items-center w-[100px] rounded-r-full bg-gradient-to-r from-gray-700 to-gray-500">
        <i className="text-gray-200 text-xl far fa-magnifying-glass"></i>
        <div className="text-gray-200 text-lg">Search</div>
      </div>
    </div>
  );
}

export default SearchCard