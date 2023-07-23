export type Attribute = {
  _id: string;
  Name: string;
};
export type AttributeValue = {
  _id: string;
   Value: string;
   Meta: string;
 }
export type OptionType = {
  Key: string;
  Attribute: Attribute;
  AttributeValues: AttributeValue[];
};
export type OptionsType = OptionType[];
