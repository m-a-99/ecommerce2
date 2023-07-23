import React from 'react'
type props = {
  DeliverySchedule: string;
  setDeliverySchedule:(v:string)=>void;
};
function DeliveryScheduleCard({ DeliverySchedule, setDeliverySchedule }: props) {
  return (
    <div className="p-8 bg-white drop-shadow-xl space-y-5 ">
      <div className="flex space-x-2 items-center">
        <div className="w-8 h-8 rounded-full bg-indigo-500 flex justify-center items-center text-white ">3</div>
        <div className="text-xl">Delivery Schedule</div>
      </div>
      <div className="flex gap-3 flex-wrap justify-center md:justify-start lg:justify-start">
        <div onClick={() => setDeliverySchedule("Morning")} className={`${DeliverySchedule === "Morning" ? "border-indigo-500" : ""} cursor-pointer select-none max-w-[180px] m-2 max-h-20 border-2 rounded-xl p-4 text-sm space-y-2`}>
          <div className="text-zinc-900 font-semibold">Morning</div>
          <div className="text-gray-700">11.00 AM - 2.00 PM</div>
        </div>
        <div onClick={() => setDeliverySchedule("Noon")} className={`${DeliverySchedule === "Noon" ? "border-indigo-500" : ""}  cursor-pointer select-none max-w-[180px] m-2  max-h-20  border-2  rounded-xl p-4 text-sm space-y-2`}>
          <div className="text-zinc-900 font-semibold">Noon</div>
          <div className="text-gray-700">8.00 AM - 11.00</div>
        </div>
        <div onClick={() => setDeliverySchedule("Afternoon")} className={`${DeliverySchedule === "Afternoon" ? "border-indigo-500" : ""} cursor-pointer select-none max-w-[180px] m-2  max-h-20  border-2  rounded-xl p-4 text-sm space-y-2`}>
          <div className="text-zinc-900 font-semibold">Afternoon</div>
          <div className="text-gray-700">2.00 PM - 5.00 PM</div>
        </div>
        <div onClick={() => setDeliverySchedule("Evening")} className={`${DeliverySchedule === "Evening" ? "border-indigo-500" : ""}  cursor-pointer select-none max-w-[180px] m-2 max-h-20  border-2  rounded-xl p-4 text-sm space-y-2`}>
          <div className="text-zinc-900 font-semibold">Evening</div>
          <div className="text-gray-700">5.00 PM - 8.00 PM</div>
        </div>
      </div>
    </div>
  );
}

export default DeliveryScheduleCard;