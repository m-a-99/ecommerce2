import { useEffect, useState } from "react";
import NavList from "../../../components/Account/NavList";
import CreateProductHeadderCard from "../../../components/Account/products/create_old/CreateProductHeadderCard";
import FeaturedImageCard from "../../../components/Account/products/create_old/FeaturedImageCard";
import GalleryCard from "../../../components/Account/products/create_old/GalleryCard";
import GeneralInfoCard from "../../../components/Account/products/create_old/GeneralInfoCard";
import GroupAndCategories from "../../../components/Account/products/create_old/GroupAndCategories";
import ProductTypeCard from "../../../components/Account/products/create_old/ProductTypeCard";
import ProductVariationInformation from "../../../components/Account/products/create_old/ProductVariationInformation";
import SimpleProductCard from "../../../components/Account/products/create_old/SimpleProductCard";
import Headder from "../../../components/layout/headder";
import useGetFetch from "../../../custom_hooks/useGetFetch";
import usePostFetch from "../../../custom_hooks/usePostFetch";
import { OptionsType } from "../../../types/OptionTypes";
import { VariableProductType } from "../../../types/VariableProductTypes";
import SellerShopsCard from "../../../components/Account/attributes/create/SellerShopsCard";
import { store } from "../../../Redux/store";
import { ParseCookies } from "../../../utils/ParseCookies";
import { FetchUserInfo } from "../../../Redux/userInfo";
import { GetServerSideProps } from "next";

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookies = ParseCookies(context.req.headers.cookie || "");
  await store.dispatch(FetchUserInfo(cookies["jwt"] || ""));
  if (store.getState().userInfo.value?.AccountType !== "Seller") {
    return {
      // redirect: {
      //   permanent: true,
      //   destination: "/account",
      // },
      notFound: true,
    };
  }

  const [groups, categories, tags, authors, manufacturers, attributes, SellerShops] = await Promise.all([
    fetch("http://nginx-proxy/admin-service/groups").then((res) => res.json()),
    fetch("http://nginx-proxy/admin-service/categories").then((res) => res.json()),
    fetch("http://nginx-proxy/admin-service/tags").then((res) => res.json()),
    fetch("http://nginx-proxy/shops-service/authors").then((res) => res.json()),
    fetch("http://nginx-proxy/shops-service/manufacturers").then((res) => res.json()),
    fetch("http://nginx-proxy/shops-service/attributes").then((res) => res.json()),
    fetch("http://nginx-proxy/shops-service/sellershops", { headers: { Authorization: cookies["jwt"] } }).then((r) => r.json()),
  ]);

  return {
    props: {
      groups,
      categories,
      tags,
      authors,
      manufacturers,
      attributes,
      SellerShops,
      InitialState: store.getState(),
    },
  };
};

function create({ authors, categories, groups, manufacturers, tags, attributes, SellerShops }: any) {
  const [createEnable, setcreateEnable] = useState(false);

  const [FeaturedImage, setFeaturedImage] = useState<File | null>(null);
  const [Gallery, setGallery] = useState<FileList | null>(null);
  const [Group, setGroup] = useState("");
  const [Categories, setCategories] = useState<string[]>([]);
  const [Authors, setAuthors] = useState<string[]>([]);
  const [Manufacturers, setManufacturers] = useState<string[]>([]);
  const [Tags, setTags] = useState<string[]>([]);

  const [ShopId, setShopId] = useState("");

  const [Name, setName] = useState("");
  const [Unit, setUnit] = useState("");
  const [Description, setDescription] = useState("");
  const [Status, setStatus] = useState("Published");
  const [ProductType, setProductType] = useState("Simple");

  const [Price, setPrice] = useState("");
  const [SalePrice, setSalePrice] = useState("");
  const [Quantity, setQuantity] = useState("");
  const [SKU, setSKU] = useState("");
  const [Width, setWidth] = useState("");
  const [Height, setHeight] = useState("");
  const [Length, setLength] = useState("");
  const [IsDigital, setIsDigital] = useState(false);
  const [IsExternal, setIsExternal] = useState(false);

  const [DigitalProductFile, setDigitalProductFile] = useState<File | null>(null);
  const [ExternalProductURL, setExternalProductURL] = useState("");
  const [ExternalProductButtonLabel, setExternalProductButtonLabel] = useState("");

  const [Options, setOptions] = useState<OptionsType>([]);
  const [VariableProductVarients, setVariableProductVarients] = useState<VariableProductType[]>([]);

  const { data: GetData, IsPending: GetIsPending, err: Geterr, get } = useGetFetch();
  const { data: Post1Data, IsPending: Post1IsPending, err: Post1err, post: Post1 } = usePostFetch();
  const { data: Post2Data, IsPending: Post2IsPending, err: Post2err, post: Post2 } = usePostFetch();
 
  useEffect(() => {
    if (ShopId&&Name && Unit && Group) {
      let en = false;
      if (ProductType === "Simple" && Price && Quantity) {
        if (IsExternal && ExternalProductURL && ExternalProductButtonLabel) {
          en = true;
        } else if (IsDigital && DigitalProductFile) {
          en = true;
        }
        if (!IsDigital && !IsExternal) {
          en = true;
        }
      } else if (ProductType === "Variable") {
        if (VariableProductVarients.length === 0) en = false;
        en = true;
        VariableProductVarients.forEach((e) => {
          if (!(e.Price && e.Quantity && (!e.IsDigital || (e.IsDigital && e.DigitalProductFile)))) {
            en = false;
          }
        });
      }
      en ? setcreateEnable(true) : setcreateEnable(false);
    }
  }, [ShopId,VariableProductVarients, Name, Unit, Group, ProductType, Price, Quantity, IsExternal, ExternalProductURL, ExternalProductButtonLabel, IsDigital, DigitalProductFile]);

  function createUploadUrl() {
    get(`/products-service/products/createuploadurl?Varients=${VariableProductVarients?.length}`);
  }

  useEffect(() => {
    if (GetData) {
      const formdata = new FormData();
      FeaturedImage && formdata.append("FeaturedImage", FeaturedImage);
      if (Gallery) {
        for (let i = 0; i < Gallery?.length; i++) {
          formdata.append("Gallery", Gallery[i]);
        }
      }
      IsDigital && DigitalProductFile && formdata.append("DigitalProductFile", DigitalProductFile);
      VariableProductVarients.forEach((e, i) => {
        e.Image && formdata.append(`Varient${i + 1}Image`, e.Image);
        e.IsDigital && e.DigitalProductFile && formdata.append(`Varient${i + 1}DigitalProductFile`, e.DigitalProductFile);
      });
      Post1(GetData.UploadUrl, formdata, "formdata");
    }
  }, [GetData]);

  useEffect(() => {
    if (Post1Data) {
      const payload: any = {};
      const SimpleProduct: any = {};
      Post1Data["FeaturedImage"] && Post1Data["FeaturedImage"].length > 0 && (payload.FeaturedImage = Post1Data["FeaturedImage"][0]);
      Post1Data["Gallery"] && (payload.Gallery = Post1Data["Gallery"]);
      Group && (payload.Group = Group);
      Categories && (payload.Categories = Categories);
      Authors && (payload.Authors = Authors);
      Manufacturers && (payload.Manufacturers = Manufacturers);
      Tags && (payload.Tags = Tags);

      ShopId && (payload.ShopId=ShopId);

      Name && (payload.Name = Name);
      Unit && (payload.Unit = Unit);
      Description && (payload.Description = Description);
      Status && (payload.Status = Status);
      ProductType && (payload.ProductType = ProductType);
      if (ProductType === "Simple") {
        SimpleProduct.Price = Number.parseFloat(Price || "0");
        SimpleProduct.SalePrice = Number.parseFloat(SalePrice || "0");
        SimpleProduct.Quantity = Number.parseFloat(Quantity || "0");
        SKU && (SimpleProduct.SKU = SKU);
        Width && (SimpleProduct.Width = Width);
        Height && (SimpleProduct.Height = Height);
        Length && (SimpleProduct.Length = Length);
        SimpleProduct.IsDigital = IsDigital;
        SimpleProduct.IsExternal = IsExternal;
        Post1Data["DigitalProductFile"] && Post1Data["DigitalProductFile"].length > 0 && (SimpleProduct.DigitalProductFile = Post1Data["DigitalProductFile"][0]);
        ExternalProductURL && (SimpleProduct.ExternalProductURL = ExternalProductURL);
        ExternalProductButtonLabel && (SimpleProduct.ExternalProductButtonLabel = ExternalProductButtonLabel);
        Object.keys(SimpleProduct).length > 0 && (payload.SimpleProduct = SimpleProduct);
      }
      if (ProductType === "Variable") {
        payload.VariableProduct = VariableProductVarients.map((v, i) => {
          const tmp = { ...v };
          Post1Data[`Varient${i + 1}Image`] && Post1Data[`Varient${i + 1}Image`].length > 0 && (tmp.Image = Post1Data[`Varient${i + 1}Image`][0]);
          Post1Data[`Varient${i + 1}DigitalProductFile`] && Post1Data[`Varient${i + 1}DigitalProductFile`].length > 0 && (tmp.DigitalProductFile = Post1Data[`Varient${i + 1}DigitalProductFile`][0]);
          return tmp;
        });
      }
      Post2("/products-service/products/createproduct", JSON.stringify(payload));
      console.log(payload);
    }
  }, [Post1Data]);

  useEffect(() => {
    if (Post2Data) {
      console.log(Post2Data);
    }
  }, [Post2Data]);

  return (
    <div>
      <Headder />
      <div className="flex mt-[60px]">
        <div className="w-[350px] h-[calc(100vh-62px)] sticky top-[62px]">
          <NavList />
        </div>
        <div className="bg-gray-100 w-full p-10 ">
          <form className="space-y-10">
            <CreateProductHeadderCard />
            <FeaturedImageCard FeaturedImage={FeaturedImage} setFeaturedImage={setFeaturedImage} />
            <GalleryCard Gallery={Gallery} setGallery={setGallery} />
            <SellerShopsCard Shops={SellerShops} setShopId={setShopId} />
            <GroupAndCategories authors={authors} Authors={Authors} setAuthors={setAuthors} categories={categories} Categories={Categories} setCategories={setCategories} groups={groups} Group={Group} setGroup={setGroup} manufacturers={manufacturers} Manufacturers={Manufacturers} setManufacturers={setManufacturers} tags={tags} Tags={Tags} setTags={setTags} />
            <GeneralInfoCard Name={Name} setName={setName} Unit={Unit} setUnit={setUnit} Description={Description} setDescription={setDescription} Status={Status} setStatus={setStatus} />
            <ProductTypeCard ProductType={ProductType} setProductType={setProductType} />
            {ProductType === "Simple" && (
              <SimpleProductCard
                Price={Price}
                setPrice={setPrice}
                SalePrice={SalePrice}
                setSalePrice={setSalePrice}
                Quantity={Quantity}
                setQuantity={setQuantity}
                SKU={SKU}
                setSKU={setSKU}
                Width={Width}
                setWidth={setWidth}
                Height={Height}
                setHeight={setHeight}
                Length={Length}
                setLength={setLength}
                IsDigital={IsDigital}
                setIsDigital={setIsDigital}
                IsExternal={IsExternal}
                setIsExternal={setIsExternal}
                DigitalProductFile={DigitalProductFile}
                setDigitalProductFile={setDigitalProductFile}
                ExternalProductURL={ExternalProductURL}
                setExternalProductURL={setExternalProductURL}
                ExternalProductButtonLabel={ExternalProductButtonLabel}
                setExternalProductButtonLabel={setExternalProductButtonLabel}
              />
            )}
            {ProductType === "Variable" && <ProductVariationInformation Options={Options} setOptions={setOptions} VariableProductVarients={VariableProductVarients} setVariableProductVarients={setVariableProductVarients} Attributes={attributes} />}
            {createEnable ? (
              <div onClick={createUploadUrl} className="flex justify-end">
                <div className="px-5 cursor-pointer drop-shadow-lg hover:bg-zinc-600  transition ease-in-out  select-none py-2 rounded-md bg-zinc-500 text-white">create</div>
              </div>
            ) : (
              <div className="flex justify-end">
                <div className="px-5  drop-shadow-lg  transition ease-in-out  select-none py-2 rounded-md bg-zinc-400 text-white">create</div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default create;
