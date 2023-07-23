import { AuthersType } from "./AuthersType";
import { CategoriesType } from "./CategoriesType";
import { GroupType } from "./GroupsType";
import { ManufacturersType } from "./ManufacturersType";
import { ShopsType } from "./ShopsType";
import { TagsType } from "./TagsType";


type ExternalProductType ={
  URL: string;
  ButtonLabel: string;
}
type SimpleProduct = {
  Price: number;
  SalePrice: number;
  Quantity: number;
  SKU: string;
  Width: string;
  Height: string;
  Length: string;
  IsDigital: boolean;
  IsExternal: boolean;
  ExternalProduct?: ExternalProductType;
  DigitalProductFile?:string;
};
export type  ProductType = {
  _id: string;
  State: string;
  Message: string;
  MessageLog:string;
  FeaturedImage: string;
  Gallery: string[];
  Group: GroupType;
  Categories: CategoriesType;
  Authors: AuthersType;
  Manufacturers: ManufacturersType;
  Tags: TagsType;
  Name: string;
  Description: string;
  Unit: string;
  Status: string;
  ShopId: string;
  Shop: ShopsType;
  ProductType: string;
  SimpleProduct?: SimpleProduct;
  Wished?: boolean;
  Wishers?: string[];
  VariableProduct: [
    {
      VarientAttributesValues: [
        {
          Attribute: {
            _id: string;
            Name: string;
          };
          Value: {
            _id: string;
            Attribute: string;
            Value: string;
            Meta: string;
          };
          _id: string;
        }
      ];
      IsDisabled: boolean;
      Price: number;
      SalePrice: number;
      Quantity: number;
      SKU: string;
      Image: string;
      IsDigital: boolean;
      IsExternal: boolean;
      ExternalProduct?: ExternalProductType;
      DigitalProductFile?: string;
      _id: string;
    }
  ];
};
