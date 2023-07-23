import { useEffect, useState } from "react";
import { VariableProductType } from "../../../../../types/VariableProductTypes";
import DragDrop from "../../../../lib/DragDrop";
import Image from "next/image";
import Link from "next/link";

type props = {
  index: number;
  VariableProductVarients: VariableProductType[];
  setVariableProductVarients: (v: VariableProductType[] | ((v: VariableProductType[]) => VariableProductType[])) => void;
};
const VariableProductVarient = ({ index, VariableProductVarients, setVariableProductVarients }: props) => {
  const [Price, setPrice] = useState("" + VariableProductVarients[index].Price || "");
  const [SalePrice, setSalePrice] = useState("" + VariableProductVarients[index].SalePrice || "");
  const [Quantity, setQuantity] = useState("" + VariableProductVarients[index].Quantity || "");
  const [SKU, setSKU] = useState("" + VariableProductVarients[index].SKU || "");
  const [ImageSrc, setImageSrc] = useState(typeof VariableProductVarients[index].Image === "string" ? VariableProductVarients[index].Image : "");
  const [ImageState, setImageState] = useState<File | null>(null);
  const [IsDigital, setIsDigital] = useState(VariableProductVarients[index].IsDigital || false);
  const [IsDisabled, setIsDisabled] = useState(VariableProductVarients[index].IsDisabled || false);
  const [DigitalProductFileSrc, setDigitalProductFileSrc] = useState<string>(typeof VariableProductVarients[index].DigitalProductFile === "string" ? (VariableProductVarients[index].DigitalProductFile as string) : "");

  const [DigitalProductFile, setDigitalProductFile] = useState<File | null>(null);

  useEffect(() => {
    setVariableProductVarients((v) => {
      const tmp = { ...v[index] };
      tmp.Price = Number.parseFloat(Price || "0");
      tmp.SalePrice = Number.parseFloat(SalePrice || "0");
      tmp.Quantity = Number.parseFloat(Quantity || "0");
      SKU && (tmp.SKU = SKU);
      ImageState && (tmp.Image = ImageState);
      tmp.IsDigital = IsDigital;
      tmp.IsDisabled = IsDisabled;
      DigitalProductFile && (tmp.DigitalProductFile = DigitalProductFile);
      v[index] = tmp;

      return [...v];
    });
  }, [Price, SalePrice, Quantity, SKU, ImageState, IsDigital, IsDisabled, DigitalProductFile]);
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
          <input type="number" onWheel={(e: any) => e.target.blur()} className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" value={Price} onChange={(e) => (e.target.valueAsNumber > 0 ? setPrice(e.target.value) : setPrice("0"))} />
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-gray-600">SalePrice</div>
        <div className="w-full">
          <input type="number" onWheel={(e: any) => e.target.blur()} className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" value={SalePrice} onChange={(e) => (e.target.valueAsNumber > 0 ? setSalePrice(e.target.value) : setSalePrice("0"))} />
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-gray-600">Quantity*</div>
        <div className="w-full">
          <input type="number" onWheel={(e: any) => e.target.blur()} className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" value={Quantity} onChange={(e) => (e.target.valueAsNumber > 0 ? setQuantity(e.target.value) : setQuantity("0"))} />
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
        <div className="w-full flex gap-1">
          {ImageSrc && (
            <div className="w-1/3 h-[160px] flex justify-center items-center  border-2 border-gray-300 rounded-xl border-dashed">
              <Image src={"http://nginx-proxy/" + ImageSrc} alt="" width={150} height={150} />
            </div>
          )}
          <div className="w-2/3 h-[160px]">
            <DragDrop file={ImageState} setfile={setImageState} fileType="Image" extentions="jpg,png" />
          </div>
        </div>
      </div>

      <div className="space-y-1">
        <div className="w-full space-y-2">
          <div className="flex cursor-pointer items-center space-x-2 text-gray-500">
            <input checked={IsDigital} onChange={(e) => setIsDigital(e.target.checked)} type="checkbox" className="w-4 h-4" />
            <div>IsDigital</div>
          </div>
          {IsDigital && (
            <div className="items-center space-y-3 w-full">
              <div>
                <DragDrop file={DigitalProductFile} setfile={setDigitalProductFile} fileType="digital file" extentions="" />
              </div>
              {DigitalProductFileSrc && (
                <div className="w-full flex justify-center">
                  <div className="text-white bg-blue-500 w-20  h-10 flex justify-center items-center cursor-pointer select-none rounded-sm">
                    <Link href={DigitalProductFileSrc}>Open File</Link>
                  </div>
                </div>
              )}
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
