type  Local ={
    Country:string,
    State: string,
    ZIP: string
}

export type ShippingType = {
    _id:string
    Name: string,
    ShippingType:string,
    Amount: number,
    Global: boolean
    Local:Local
}
