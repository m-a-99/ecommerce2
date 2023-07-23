import { useEffect, useState } from "react";
import { OptionsType } from "../../../../../types/OptionTypes";
import DropListObj from "../../../../lib/DropListObj";
import MultiDropListObj from "../../../../lib/MultiDropListObj";
import { AttributeValueType, AttributesType } from "../../../../../types/AttributesType";

type props = {
  index: number;
  Options: OptionsType;
  setOptions: (v: OptionsType | ((b: OptionsType) => OptionsType)) => void;
  Attributes: AttributesType
};
const OptionCard = ({ index, Attributes, Options, setOptions }: props) => {
  const [AttributeState, setAttributeState] = useState({ _id: Options[index]?.Attribute?._id || "", Name: Options[index]?.Attribute?.Name || "" });
  const [AttributeValueState, setAttributeValueState] = useState<({Id:string,Name:string}&AttributeValueType)[]>(Options[index].AttributeValues.map(v=>({_id:v._id,Meta:v.Meta,Value:v.Value,Id:v._id,Name:v.Value})));
  const [AttributeValueList, setAttributeValueList] = useState<AttributeValueType[]>([]);
  useEffect(() => {
    if (AttributeState._id && AttributeState.Name) {
      if (AttributeState.Name !== Options[index]?.Attribute?.Name) {
        setAttributeValueState([]);
      }
      const listt = Attributes.find((v) => v._id === AttributeState._id);
      if (listt && listt?.AttributeValues.length > 0) {
        setAttributeValueList(listt.AttributeValues);
      }
      setOptions((opts) => {
        opts[index].Attribute = AttributeState;
        return [...opts];
      });
    }
  }, [AttributeState]);

  useEffect(() => {
    setOptions((opts) => {
      opts[index].AttributeValues = AttributeValueState;
      return [...opts];
    });
  }, [AttributeValueState]);
  // function setAttributeValueStateDrop(cb: any) {
  //   setAttributeValueState((v) =>{
  //     return [
  //      ...(cb(v)),
  //   ]});
  // }

  return (
    <div className="transition duration-150 ease-in-out flex space-x-5">
      <div className="space-y-1 w-1/2">
        <div className="text-gray-600">Attribute Name*</div>
        <div className="w-full">
          <DropListObj
            List={Attributes.filter((A) => !Options.some((O) => O.Attribute._id === A._id)).map((v) => {
              return { Id: v._id, Name: v.Name };
            })}
            Value={{ Id: AttributeState._id, Name: AttributeState.Name }}
            setValue={(v) => setAttributeState({ _id: v.Id, Name: v.Name })}
          />
        </div>
      </div>
      <div className="space-y-1 w-1/2">
        <div className="text-gray-600">Attribute Value*</div>
        <div className="w-full">
          <MultiDropListObj List={AttributeValueList.map((v) => ({ ...v, Name: v.Value, Id: v._id } as any))} Value={AttributeValueState.map((v) => ({ ...v, Id: v._id, Name: v.Value } as any))} setValue={setAttributeValueState as any} />
        </div>
      </div>
    </div>
  );
};

export default OptionCard;
