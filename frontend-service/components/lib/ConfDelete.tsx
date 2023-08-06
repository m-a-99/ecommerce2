
function ConfDelete({Cancel,Delete}:any) {
  return (
    <div className=" rounded-md absolute top-0 right-0  z-10  w-full h-full bg-black/50 backdrop-blur-sm flex justify-center items-center ">
      <div className="flex space-x-5">
        <div onClick={Cancel} className=" rounded-md drop-shadow-md cursor-pointer select-none text-center min-w-[80px] p-2 bg-white ">
          Cancel
        </div>
        <div onClick={Delete} className=" rounded-md drop-shadow-md cursor-pointer select-none text-center min-w-[80px] p-2 text-white bg-red-500">
          Delete
        </div>
      </div>
    </div>
  );
}

export default ConfDelete