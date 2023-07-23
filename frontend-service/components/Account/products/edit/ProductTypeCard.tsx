import DropList from "../../../lib/DropList";

type props = {
  ProductType: string;
  setProductType:(v:string)=>void
};

const ProductTypeCard = ({ ProductType,setProductType }: props) => {
  return (
    <div className="bg-white rounded-md shadow-md px-10 w-full">
      <div className="flex justify-between border-b py-10">
        <div className="w-1/3 text-lg text-gray-600 font-semibold space-y-2">
          <p>Product Type</p>
          <p className="text-sm text-gray-400">Select product type form here</p>
        </div>
        <div className="w-7/12 space-y-2">
          <div className="space-y-2">
            <div className="text-gray-600">Product Type</div>
            <DropList
              List={[
                { Name: "Simple", Id: "Simple" },
                { Name: "Variable", Id: "Variable" },
              ]}
              Value={ProductType}
              setValue={setProductType}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductTypeCard;
