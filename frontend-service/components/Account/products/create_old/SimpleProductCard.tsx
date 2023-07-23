import { isExternal } from "util/types";
import DragDrop from "../../../lib/DragDrop";

type props = {
  Price: number | string;
  setPrice: (v: any) => void;
  SalePrice: number | string;
  setSalePrice: (v: any) => void;
  Quantity: number | string;
  setQuantity: (v: any) => void;
  SKU: string;
  setSKU: (v: string) => void;
  Width: string;
  setWidth: (v: string) => void;
  Height: string;
  setHeight: (v: string) => void;
  Length: string;
  setLength: (v: string) => void;
  IsDigital: boolean;
  setIsDigital: (v: boolean) => void;
  IsExternal: boolean;
  setIsExternal: (v: boolean) => void;
  DigitalProductFile: File | null;
  setDigitalProductFile: (v: File | null) => void;
  ExternalProductURL: string;
  ExternalProductButtonLabel: string;
  setExternalProductURL: (v: string) => void;
  setExternalProductButtonLabel: (v: string) => void;
};

const SimpleProductCard = ({ Price, setPrice, SalePrice, setSalePrice, Quantity, setQuantity, SKU, setSKU, Width, setWidth, Height, setHeight, Length, setLength, IsDigital, setIsDigital, IsExternal, setIsExternal,DigitalProductFile,setDigitalProductFile,ExternalProductButtonLabel,ExternalProductURL,setExternalProductButtonLabel, setExternalProductURL }: props) => {
  return (
    <div className="bg-white rounded-md shadow-md px-10 w-full">
      <div className="flex justify-between border-b py-10">
        <div className="w-1/3 text-lg text-gray-600 font-semibold space-y-2">
          <p>Simple Product Information </p>
          <p className="text-sm text-gray-400">Edit your simple product description and necessary information from here </p>
        </div>
        <div className="w-7/12 space-y-2">
          <div className="space-y-1">
            <div className="text-gray-600">Price*</div>
            <div className="w-full">
              <input type="number" onWheel={(e: any) => e.target.blur()} className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" value={Price} onChange={(e) => (e.target.valueAsNumber > 0 ? setPrice(e.target.value) : setPrice(0))} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600">SalePrice</div>
            <div className="w-full">
              <input type="number" onWheel={(e: any) => e.target.blur()} className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" value={SalePrice} onChange={(e) => (e.target.valueAsNumber > 0 ? setSalePrice(e.target.value) : setSalePrice(0))} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600">Quantity*</div>
            <div className="w-full">
              <input type="number" onWheel={(e: any) => e.target.blur()} className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" value={Quantity} onChange={(e) => (e.target.valueAsNumber > 0 ? setQuantity(e.target.value) : setQuantity(0))} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600">SKU</div>
            <div className="w-full">
              <input type="text" className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" value={SKU} onChange={(e) => setSKU(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600">Width</div>
            <div className="w-full">
              <input type="text" className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" value={Width} onChange={(e) => setWidth(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600">Height</div>
            <div className="w-full">
              <input type="text" className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" value={Height} onChange={(e) => setHeight(e.target.value)} />
            </div>
          </div>
          <div className="space-y-1">
            <div className="text-gray-600">Length</div>
            <div className="w-full">
              <input type="text" className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" value={Length} onChange={(e) => setLength(e.target.value)} />
            </div>
          </div>

          <div className="space-y-1">
            <div className="w-full space-y-2">
              <div className="flex cursor-pointer items-center space-x-2 text-gray-500">
                <input checked={IsDigital} disabled={IsExternal} onChange={(e) => setIsDigital(e.target.checked)} type="checkbox" className="w-4 h-4" />
                <div>IsDigital</div>
              </div>
              <div className="flex cursor-pointer items-center space-x-2 text-gray-500">
                <input checked={IsExternal} disabled={IsDigital} onChange={(e) => setIsExternal(e.target.checked)} type="checkbox" className="w-4 h-4" />
                <div>IsExternal</div>
              </div>

              {IsDigital && (
                <div>
                  <DragDrop file={DigitalProductFile} setfile={setDigitalProductFile} fileType="digital file" extentions="" />
                </div>
              )}

              {IsExternal && (
                <>
                  <div className="space-y-1">
                    <div className="text-gray-600">URL* </div>
                    <div className="w-full">
                      <input type="text" className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" value={ExternalProductURL} onChange={(e) => setExternalProductURL(e.target.value)} />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-gray-600">ButtonLabel*</div>
                    <div className="w-full">
                      <input type="text" className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" value={ExternalProductButtonLabel} onChange={(e) => setExternalProductButtonLabel(e.target.value)} />
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimpleProductCard;
