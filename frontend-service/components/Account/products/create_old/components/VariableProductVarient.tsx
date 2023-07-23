import { useEffect, useState } from "react";
import { VariableProductType } from "../../../../../types/VariableProductTypes";
import DragDrop from "../../../../lib/DragDrop";

type props = {
  index: number;
  VariableProductVarients: VariableProductType[];
  setVariableProductVarients: (v: VariableProductType[] | ((v: VariableProductType[]) => VariableProductType[])) => void;
};
const VariableProductVarient = ({ index, VariableProductVarients, setVariableProductVarients }: props) => {
  const [Price, setPrice] = useState("");
  const [SalePrice, setSalePrice] = useState("");
  const [Quantity, setQuantity] = useState("");
  const [SKU, setSKU] = useState("");
  const [Image, setImage] = useState<File | null>(null);
  const [IsDigital, setIsDigital] = useState(false);
  const [IsDisabled, setIsDisabled] = useState(false);
  const [DigitalProductFile, setDigitalProductFile] = useState<File | null>(null);

  useEffect(() => {
    setVariableProductVarients((v) => {
      v[index].Price = Number.parseFloat(Price || "0");
      v[index].SalePrice = Number.parseFloat(SalePrice || "0");
      v[index].Quantity = Number.parseFloat(Quantity || "0");
      SKU && (v[index].SKU = SKU);
      Image && (v[index].Image = Image);
      v[index].IsDigital = IsDigital;
      v[index].IsDisabled = IsDisabled;
      DigitalProductFile && (v[index].DigitalProductFile = DigitalProductFile);
      return [...v];
    });
  }, [Price, SalePrice, Quantity, SKU, Image, IsDigital, IsDisabled, DigitalProductFile]);
  function captilize(str: string) {
    if (!str) {
      return "";
    }
    return str[0].toUpperCase() + str.substring(1);
  }
  return (
    <div className="space-y-2">
      <div className="space-y-1 pb-5 flex  items-end space-x-2">
        <div className="text-gray-600 font-bold text-lg">Variant: </div>
        <div className="text-blue-600 font-sans font-medium text-lg">{VariableProductVarients[index].VarientAttributesValues.reduce((pre, cur, i) => (i === 0 ? pre + captilize(cur.Value.Value) : pre + "/" + captilize(cur.Value.Value)), "")}</div>
      </div>
      <div className="space-y-1">
        <div className="text-gray-600">Price*</div>
        <div className="w-full">
          <input type="number"  onWheel={(e:any) => e.target.blur()}  className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" value={Price} onChange={(e) => setPrice(e.target.value)} />
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-gray-600">SalePrice</div>
        <div className="w-full">
          <input type="number"  onWheel={(e:any) => e.target.blur()}  className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" value={SalePrice} onChange={(e) => setSalePrice(e.target.value)} />
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-gray-600">Quantity*</div>
        <div className="w-full">
          <input type="number"  onWheel={(e:any) => e.target.blur()}  className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" value={Quantity} onChange={(e) => setQuantity(e.target.value)} />
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-gray-600">SKU</div>
        <div className="w-full">
          <input type="text" className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" value={SKU} onChange={(e) => setSKU(e.target.value)} />
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-gray-600">Image</div>
        <div className="w-full">
          <DragDrop file={Image} setfile={setImage} fileType="Image" extentions="jpg,png" />
        </div>
      </div>

      <div className="space-y-1">
        <div className="w-full space-y-2">
          <div className="flex cursor-pointer items-center space-x-2 text-gray-500">
            <input checked={IsDigital} onChange={(e) => setIsDigital(e.target.checked)} type="checkbox" className="w-4 h-4" />
            <div>IsDigital</div>
          </div>
          {IsDigital && (
            <div>
              <DragDrop file={DigitalProductFile} setfile={setDigitalProductFile} fileType="digital file" extentions="" />
            </div>
          )}
          <div className="flex cursor-pointer items-center space-x-2 text-gray-500">
            <input checked={IsDisabled} onChange={(e) => setIsDisabled(e.target.checked)} type="checkbox" className="w-4 h-4" />
            <div>IsDisabled</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VariableProductVarient;
