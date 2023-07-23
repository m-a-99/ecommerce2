import { useEffect, useState } from "react";
import { OptionsType } from "../../../../../types/OptionTypes";
import DropListObj from "../../../../lib/DropListObj";
import MultiDropListObj from "../../../../lib/MultiDropListObj";


type props = {
  index: number;
  Options: OptionsType;
  setOptions: (v: OptionsType | ((b: OptionsType) => OptionsType)) => void;
  Attributes: { _id: string; Name: string; Shop: string; AttributeValues: { _id: string; Value: string; Meta: string }[] }[];
};
const ObtionCard = ({ index, Attributes, Options, setOptions }: props) => {
  const [AttributeState, setAttributeState] = useState({ Id: "", Name: "" });
  const [AttributeValueState, setAttributeValueState] = useState<{ Id: string; Name: string }[]>([]);
  const [AttributeValueList, setAttributeValueList] = useState<{ Id: string; Name: string }[]>([]);

  useEffect(() => {
    if (AttributeState.Id && AttributeState.Name) {
      setOptions((opts) => {
        opts[index].Attribute = AttributeState;
        return [...opts];
      });
      setAttributeValueState([])
      setOptions((opts) => {
        opts[index].AttributeValues = [];
        return [...opts];
      });
      const listt = Attributes.find((v) => v._id === AttributeState.Id);
      if (listt && listt?.AttributeValues.length > 0) {
        setAttributeValueList(
          listt.AttributeValues.map((v) => {
            return { Id: v._id, Name: v.Value };
          })
        );
      }
    }
  }, [AttributeState]);

  useEffect(() => {
    if (AttributeValueState.length > 0) {
      setOptions((opts) => {
        opts[index].AttributeValues = AttributeValueState;
        return [...opts];
      });
    }
  }, [AttributeValueState]);
  return (
    <div className="transition duration-150 ease-in-out flex space-x-5">
      <div className="space-y-1 w-1/2">
        <div className="text-gray-600">Attribute Name*</div>
        <div className="w-full">
          <DropListObj
            List={Attributes.filter((A) => !Options.some((O) => O.Attribute.Id === A._id)).map((v) => {
              return { Id: v._id, Name: v.Name };
            })}
            Value={AttributeState}
            setValue={setAttributeState}
          />
        </div>
      </div>
      <div className="space-y-1 w-1/2">
        <div className="text-gray-600">Attribute Value*</div>
        <div className="w-full">
          <MultiDropListObj List={AttributeValueList} Value={AttributeValueState} setValue={setAttributeValueState} />
        </div>
      </div>
    </div>
  );
};

export default ObtionCard;
