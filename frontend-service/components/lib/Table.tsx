
type props = {
  Schema: string[];
  List: any[];
};
function Table({ List, Schema }: props) {
  return (
    <>
      <table className="w-full text-center">
        <thead>
          <tr>
            {Schema.map((col, index) => (
              <th key={(Date.now() * index).toString()} className={`text-zinc-800  py-3 px-6  border-b drop-shadow-md shadow-md border-gray-300 ${col === "Actions" ? "text-center" : ""}`}>
                {col}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className=" bg-white text-gray-500">
          {List.map((row, index) => (
            <tr key={(Date.now() * index).toString()}>
              {Schema.map((key, index2) => (
                <td key={(Date.now() * index2).toString()} className="p-6 border-y ">
                  {row[key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {List.length === 0 && <div className="p-6 border-y flex justify-center w-full bg-white">No Data</div>}
    </>
  );
}

export default Table;
