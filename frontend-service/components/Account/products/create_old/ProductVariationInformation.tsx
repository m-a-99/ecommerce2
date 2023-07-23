import { useEffect, useState } from "react";
import { AttributesType } from "../../../../types/AttributesType";
import { OptionsType } from "../../../../types/OptionTypes";
import { VarientAttributeValue, VariableProductType } from "../../../../types/VariableProductTypes";
import ObtionCard from "./components/ObtionCard";
import VariableProductVarient from "./components/VariableProductVarient";

type props = {
  Options: OptionsType;
  setOptions: (v: OptionsType | ((v: OptionsType) => OptionsType)) => void;
  VariableProductVarients: VariableProductType[];
  setVariableProductVarients: (v: VariableProductType[] | ((v: VariableProductType[]) => VariableProductType[])) => void;
  Attributes: AttributesType;
};
const ProductVariationInformation = ({ Attributes, Options, setOptions, VariableProductVarients, setVariableProductVarients }: props) => {
  function createVariableProductVarient(VarientAttributesValues: VarientAttributeValue[]) {
    return {
      Key: "" + Date.now() * Math.random() * (500 - 5) + 5,
      VarientAttributesValues,
      IsDisabled: false,
      Price: 0,
      SalePrice: 0,
      Quantity: 0,
      SKU: "",
      Image: null,
      IsDigital: false,
      DigitalProductFile: null,
      ExternalProductURL: "",
      ExternalProductButtonLabel: "",
    };
  }
  useEffect(() => {
    if (Options.length > 0) {
      let r: VariableProductType[] = [];
      let arr: VariableProductType[] = Options[0].AttributeValues.map((v) => {
        return createVariableProductVarient([{ Attribute: { Id: Options[0].Attribute.Id, Name: Options[0].Attribute.Name }, Value: { Id: v.Id, Name: v.Name } }]);
      });
      for (let i = 1; i < Options.length; i++) {
        const arr1 = Options[i];
        for (let j = 0; j < arr.length; j++) {
          for (let k = 0; k < arr1.AttributeValues.length; k++) {
            r.push(createVariableProductVarient([...arr[j].VarientAttributesValues, { Attribute: { Id: arr1.Attribute.Id, Name: arr1.Attribute.Name }, Value: { Id: arr1.AttributeValues[k].Id, Name: arr1.AttributeValues[k].Name } }]));
          }
        }
        // if (r.length > 0) {
        arr = r;
        r = [];
      }
      setVariableProductVarients(arr);
    } else {
      setVariableProductVarients([]);
    }
  }, [Options]);


  function add() {
    if (Attributes.length > Options.length) {
      setOptions((options) => {
        options = [...options];
        options.push({
          Key: "" + Date.now() * Math.random(),
          Attribute: { Id: "", Name: "" },
          AttributeValues: [],
        });
        return options;
      });
    }
  }
  function remove(Key: string) {
    setOptions((options) => {
      return options.filter((v) => v.Key !== Key);
    });
  }
  return (
    <div className="bg-white rounded-md shadow-md px-10 w-full ">
      <div className="flex justify-between border-b py-10 ">
        <div className="w-1/3 text-lg text-gray-600 font-semibold space-y-2">
          <p>Product Variation Information</p>
          <p className="text-sm text-gray-400">Update your product variation and necessary information from here</p>
        </div>
        <div className="w-7/12 space-y-16">
          {Options.map((option, index) => {
            return (
              <div key={option.Key} className="space-y-5">
                <div className="flex justify-between  items-center ">
                  <div className="text-gray-500 font-semibold ">Option {index + 1}</div>
                  <div onClick={() => remove(option.Key)} className="text-red-500 cursor-pointer  select-none">
                    Remove
                  </div>
                </div>
                <ObtionCard Attributes={Attributes} Options={Options} index={index} setOptions={setOptions} key={option.Key} />
              </div>
            );
          })}
          <div>
            <div onClick={add} className={`${Attributes.length > Options.length ? "bg-zinc-500 cursor-pointer" : "bg-zinc-400"} px-6 py-1 rounded-md  w-max text-white select-none`}>
              Add Value
            </div>
          </div>
        </div>
      </div>
      {VariableProductVarients.length > 0 && (
        <div className="flex justify-between border-b py-10 ">
          <div className="w-1/3 text-lg text-gray-600 font-semibold space-y-2">
            <p>Product Variatiants</p>
            <p className="text-sm text-gray-400">Choose your product variation and necessary information from here</p>
          </div>
          <div className="w-7/12 space-y-10">
            <div className="flex justify-center">{VariableProductVarients.length} VARIANT</div>
            {VariableProductVarients.map((obj, index) => {
              return (
                <div key={obj.Key} className="border-b pb-10">
                  <VariableProductVarient key={obj.Key} VariableProductVarients={VariableProductVarients} setVariableProductVarients={setVariableProductVarients} index={index} />
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductVariationInformation;
