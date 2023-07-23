export type ContactType = {
  _id: string;
  Title: string;
  Value: string;
};
export type AddressType = {
  _id:string;
  Title: string;
  Country: string;
  City: string;
  State: string;
  Zip: string;
  StreetAddress: string;
};
export type UserInfoType = {
  _id?: string;
  AccountType?: string;
  FirstName?: string;
  LastName?: string;
  Email?: string;
  Bio?: string;
  Img?: string;
  Password?: string;
  Contacts?: ContactType[];
  ShippingAddress?: AddressType;
  BillingAddress?: AddressType;
};

