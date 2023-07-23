import { AttributeValuesType } from "../../../../types/AttributesType";
import AttributeValueCard from "./components/AttributeValueCard";

type props = {
  DeletedAttributeValuesIds: string[];
  setDeletedAttributeValuesIds: (v: string[] | ((v: string[]) => string[])) => void;
  AttributeValues: AttributeValuesType;
  setAttributeValues: (v: AttributeValuesType | ((b: AttributeValuesType) => AttributeValuesType)) => void;
};
const AttributeValuesCard = ({setDeletedAttributeValuesIds, AttributeValues, setAttributeValues }: props) => {
  function add() {
    // AttributeValues.current.push({ AttributeValue: null, Description: "", Title: "" });
    setAttributeValues((AttributeValue) => {
      AttributeValue = [...AttributeValue];
      AttributeValue.push({
        _id: crypto.randomUUID(),
        Value: "",
        Meta: "",
      });
      return AttributeValue;
    });
  }
  function remove(id: string) {
    setAttributeValues((AttributeValues) => {
      return AttributeValues.filter((v) => v._id !== id);
    });
    
    setDeletedAttributeValuesIds(ids=>[...ids,id])
  }
  return (
    <div className="bg-white rounded-md shadow-md px-10 w-full ">
      <div className="flex justify-between border-b py-10 ">
        <div className="w-1/3 text-lg text-gray-600 font-semibold space-y-2">
          <p> Attribute Values </p>
          <p className="text-sm text-gray-400">Add your Attribute Values </p>
        </div>
        <div className="w-7/12 space-y-16">
          {AttributeValues.map((AttributeValue, index) => {
            return (
              <div key={AttributeValue._id} className="space-y-5">
                <div className="flex justify-between  items-center ">
                  <div className="text-gray-500 font-semibold ">Attribute Value {index + 1}</div>
                  <div onClick={() => remove(AttributeValue._id)} className="text-red-500 cursor-pointer  select-none">
                    Remove
                  </div>
                </div>
                <AttributeValueCard index={index} AttributeValues={AttributeValues} setAttributeValues={setAttributeValues} />
              </div>
            );
          })}
          <div>
            <div onClick={add} className="px-6 py-1 rounded-md bg-zinc-500 w-max text-white cursor-pointer">
              Add Value
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AttributeValuesCard;
