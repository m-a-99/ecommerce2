export type TagType = {
  _id: string;
  Name: string;
  Details: string;
  Group: {
    _id: string;
    Name: string;
    Icon: string;
  };
  Icon: string;
}
export type TagsType=TagType[];