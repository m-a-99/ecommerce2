import { useEffect, useState } from "react";
import { OptionsType } from "../../../../../types/OptionTypes";
import DropListObj from "../../../../lib/DropListObj";
import MultiDropListObj from "../../../../lib/MultiDropListObj";
import { AttributeValueType, AttributesType } from "../../../../../types/AttributesType";

type props = {
  index: number;
  Options: OptionsType;
  setOptions: (v: OptionsType | ((b: OptionsType) => OptionsType)) => void;
  Attributes: { _id: string; Name: string; Shop: string; AttributeValues: { _id: string; Value: string; Meta: string }[] }[];
};
const ObtionCard = ({ index, Attributes, Options, setOptions }: props) => {
  const [AttributeState, setAttributeState] = useState({ _id: "", Name: "" });
  const [AttributeValueState, setAttributeValueState] = useState<AttributeValueType[]>([]);
  const [AttributeValueList, setAttributeValueList] = useState<AttributeValueType[]>([]);
  useEffect(() => {
    if (AttributeState._id && AttributeState.Name) {
      setOptions((opts) => {
        opts[index].Attribute = AttributeState;
        return [...opts];
      });
      setAttributeValueState([]);
      setOptions((opts) => {
        opts[index].AttributeValues = [];
        return [...opts];
      });
      const listt = Attributes.find((v) => v._id === AttributeState._id);
      if (listt && listt?.AttributeValues.length > 0) {
        setAttributeValueList(listt.AttributeValues);
      }
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

export default ObtionCard;
