type PaginationType<t> = {
  Data: t;
  Page: number;
  HasNext: boolean;
  Count: number;
  Pages: number;
};