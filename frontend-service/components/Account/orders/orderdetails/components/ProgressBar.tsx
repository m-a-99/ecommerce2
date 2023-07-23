const ProgressBar = () => {
  return (
    <div className="p-5">
      <div className="flex  overflow-x-auto customscrollbar py-5">
        <div className="space-y-4 flex flex-col items-center">
          <div className="flex items-center">
            <div className="w-[60px] h-[4px] invisible bg-indigo-500"></div>
            <div className=" flex justify-center text-white items-center w-9 h-9 bg-indigo-500 rounded-full">
              <i className="fa-regular fa-check"></i>
            </div>
            <div className="w-[60px] h-[4px]  bg-indigo-500"></div>
          </div>
          <div className="font-semibold text-zinc-700 text-center">Order Received</div>
        </div>
        <div className="space-y-4 flex flex-col items-center">
          <div className="flex items-center">
            <div className="w-[60px] h-[4px] bg-gray-200"></div>
            <div className=" flex justify-center text-indigo-500 font-semibold items-center w-9 h-9 border-[1px] border-dashed border-indigo-500 rounded-full">2</div>
            <div className="w-[60px] h-[4px]  bg-gray-200"></div>
          </div>
          <div className="font-semibold text-zinc-700 text-center">Order Processing</div>
        </div>

        <div className="space-y-4 flex flex-col items-center">
          <div className="flex items-center">
            <div className="w-[60px] h-[4px] bg-gray-200"></div>
            <div className=" flex justify-center text-indigo-500 font-semibold items-center w-9 h-9 border-[1px] border-dashed border-indigo-500 rounded-full">3</div>
            <div className="w-[60px] h-[4px]  bg-gray-200"></div>
          </div>
          <div className="font-semibold text-zinc-700 text-center">Ready To Dispatch</div>
        </div>
        <div className="space-y-4 flex flex-col items-center">
          <div className="flex items-center">
            <div className="w-[60px] h-[4px] bg-gray-200"></div>
            <div className=" flex justify-center text-indigo-500 font-semibold items-center w-9 h-9 border-[1px] border-dashed border-indigo-500 rounded-full">4</div>
            <div className="w-[60px] h-[4px]  bg-gray-200"></div>
          </div>
          <div className="font-semibold text-zinc-700 text-center">Order Dispatched</div>
        </div>
        <div className="space-y-4 flex flex-col items-center">
          <div className="flex items-center">
            <div className="w-[60px] h-[4px] bg-gray-200"></div>
            <div className=" flex justify-center text-indigo-500 font-semibold items-center w-9 h-9 border-[1px] border-dashed border-indigo-500 rounded-full">5</div>
            <div className="w-[60px] h-[4px]  bg-gray-200"></div>
          </div>
          <div className="font-semibold text-zinc-700 text-center">At Local Facility</div>
        </div>
        <div className="space-y-4 flex flex-col items-center">
          <div className="flex items-center">
            <div className="w-[60px] h-[4px] bg-gray-200"></div>
            <div className=" flex justify-center text-indigo-500 font-semibold items-center w-9 h-9 border-[1px] border-dashed border-indigo-500 rounded-full">6</div>
            <div className="w-[60px] h-[4px]  bg-gray-200"></div>
          </div>
          <div className="font-semibold text-zinc-700 text-center">Out For Delivery</div>
        </div>
        <div className="space-y-4 flex flex-col items-center">
          <div className="flex items-center">
            <div className="w-[60px] h-[4px] bg-gray-200"></div>
            <div className=" flex justify-center text-indigo-500 font-semibold items-center w-9 h-9 border-[1px] border-dashed border-indigo-500 rounded-full">8</div>
            <div className="w-[60px] h-[4px]  bg-gray-200"></div>
          </div>
          <div className="font-semibold text-zinc-700 text-center">Failed To Collect Payment</div>
        </div>
        <div className="space-y-4 flex flex-col items-center">
          <div className="flex items-center">
            <div className="w-[60px] h-[4px] bg-gray-200"></div>
            <div className=" flex justify-center text-indigo-500 font-semibold items-center w-9 h-9 border-[1px] border-dashed border-indigo-500 rounded-full">9</div>
            <div className="w-[60px] h-[4px]  bg-gray-200"></div>
          </div>
          <div className="font-semibold text-zinc-700 text-center">Failed To Contact Consignee</div>
        </div>
        <div className="space-y-4 flex flex-col items-center">
          <div className="flex items-center">
            <div className="w-[60px] h-[4px] bg-gray-200"></div>
            <div className=" flex justify-center text-indigo-500 font-semibold items-center w-9 h-9 border-[1px] border-dashed border-indigo-500 rounded-full">10</div>
            <div className="w-[60px] h-[4px]  bg-gray-200"></div>
          </div>
          <div className="font-semibold text-zinc-700 text-center">Shipment Refused By Consignee</div>
        </div>
        <div className="space-y-4 flex flex-col items-center">
          <div className="flex items-center">
            <div className="w-[60px] h-[4px] bg-gray-200"></div>
            <div className=" flex justify-center text-indigo-500 font-semibold items-center w-9 h-9 border-[1px] border-dashed border-indigo-500 rounded-full">11</div>
            <div className="w-[60px] h-[4px]  bg-gray-200 invisible"></div>
          </div>
          <div className="font-semibold text-zinc-700 text-center">Delivered</div>
        </div>
      </div>
    </div>
  );
};

export default ProgressBar;
