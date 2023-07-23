
function OrdersHeadder() {
  return (
    <div className="py-8 px-10 bg-white h-min w-full shadow-md rounded-md flex items-center justify-between">
      <span className="text-zinc-700 font-semibold text-lg w-3/12">Orders</span>
      <div className="w-6/12">
        <form className="w-full relative">
          <i className="absolute far text-zinc-500 fa-magnifying-glass left-4 top-1/2 -translate-y-1/2"></i>
          <input className="outline-none rounded-full  w-full border-[2px] border-zinc-300 px-10 text-zinc-800 font- py-3" type="text" placeholder="Search Shops" />
        </form>
      </div>
    </div>
  );
}

export default OrdersHeadder;