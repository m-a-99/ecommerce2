export type VarientAttributeValue = {
  Attribute: {
    _id: string;
    Name: string;
  };
  Value: {
    _id: string;
    Value: string;
    Meta: string;
  };
  key?:string
  _id?: string;
};

export type VariableProductType = {
  Key?:string,
  VarientAttributesValues: VarientAttributeValue[];
  IsDisabled: boolean;
  Price: number;
  SalePrice: number;
  Quantity: number;
  SKU: string;
  Image: string|File;
  IsDigital: boolean;
  IsExternal: boolean;
  DigitalProductFile?: string|File;
  _id?: string;
};
