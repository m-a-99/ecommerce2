import { ShopsType } from "./ShopsType";

export type AttributeType = { _id: string; Name: string; ShopId: string; Shop?:ShopsType; AttributeValues: { _id: string; Value: string; Meta: string }[] };
export type AttributesType = AttributeType[];
export type AttributeValueType = { _id: string; Value: string; Meta: string };
export type AttributeValuesType = AttributeValueType[];