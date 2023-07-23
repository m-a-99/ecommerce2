import {useEffect, useState } from "react";
import { AttributeValuesType } from "../../../../../types/AttributesType";

type props = {
  index: number;
  AttributeValues:  AttributeValuesType ;
  setAttributeValues: (v: AttributeValuesType | ((b: AttributeValuesType) => AttributeValuesType)) => void;
};
const AttributeValueCard = ({ index, AttributeValues, setAttributeValues }: props) => {
  const [Value, setValue] = useState(AttributeValues[index].Value);
  const [Meta, setMeta] = useState(AttributeValues[index].Meta);

  useEffect(() => {
    setAttributeValues((AttributeValue) => {
      AttributeValue = [...AttributeValue];
      AttributeValue[index].Value = Value;
      AttributeValue[index].Meta = Meta;
      return AttributeValue;
    });
  }, [Value,Meta]);
  return (
    <div className="transition duration-150 ease-in-out flex space-x-5">
      <div className="space-y-1">
        <div className="text-gray-600">Value</div>
        <div className="w-full">
          <input value={Value} onChange={(e) => setValue(e.target.value)} type="text" className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" />
        </div>
      </div>
      <div className="space-y-1">
        <div className="text-gray-600">Meta</div>
        <div className="w-full">
          <input value={Meta} onChange={(e) => setMeta(e.target.value)} className="outline-none border-zinc-400 border rounded-md px-4 py-2 w-full" />
        </div>
      </div>
    </div>
  );
};

export default AttributeValueCard;
