export function SessionCartFormatter(Session:any) {
 return Session.session.Cart.map((data: any) => {
    const tmpProduct = { ...data.Product };
    //tmpProduct.VariableProduct = tmpProduct.VariableProduct.filter((v: any) => v._id === data.VariableId);
    return { Quantity: data.Quantity, Product: tmpProduct };
  });
}
