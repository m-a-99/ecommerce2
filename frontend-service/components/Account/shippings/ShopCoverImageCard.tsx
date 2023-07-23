import Image from 'next/image'
import React from 'react'
import { ShopsType } from '../../../types/ShopsType'
import Link from 'next/link'

function ShopCoverImageCard({ shop }: { shop: ShopsType }) {
  return (
    <div className="w-full relative h-full rounded-md bg-white overflow-hidden flex items-center">
      <Link href={`edit/${shop._id}`}>
      <div className="px-5 py-1 bg-blue-400 cursor-pointer select-none text-white  absolute  space-x-1 rounded-md top-5 right-5">
        <i className="fa-regular fa-pen-to-square"></i>
        <span>Edit</span>
      </div>
      </Link>
      <Image src={"http://nginx-proxy/" + shop.CoverImage} alt="" width={1000} height={1000} className=" object-contain h-auto w-full" />
    </div>
  );
}

export default ShopCoverImageCard;