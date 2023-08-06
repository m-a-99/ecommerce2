import { GetServerSideProps } from "next";
import { ParseCookies } from "../../../../utils/ParseCookies";
import { FetchUserInfo } from "../../../../Redux/userInfo";
import { store } from "../../../../Redux/store";
import { useEffect, useState } from "react";
import { OptionsType } from "../../../../types/OptionTypes";
import { VariableProductType } from "../../../../types/VariableProductTypes";
import useGetFetch from "../../../../custom_hooks/useGetFetch";
import usePostFetch from "../../../../custom_hooks/usePostFetch";
import Headder from "../../../../components/layout/headder";
import NavList from "../../../../components/Account/NavList";
import FeaturedImageCard from "../../../../components/Account/products/edit/FeaturedImageCard";
import SellerShopsCard from "../../../../components/Account/products/edit/SellerShopsCard";
import GalleryCard from "../../../../components/Account/products/edit/GalleryCard";
import GeneralInfoCard from "../../../../components/Account/products/edit/GeneralInfoCard";
import GroupAndCategories from "../../../../components/Account/products/edit/GroupAndCategories";
import ProductTypeCard from "../../../../components/Account/products/edit/ProductTypeCard";
import SimpleProductCard from "../../../../components/Account/products/edit/SimpleProductCard";
import ProductVariationInformation from "../../../../components/Account/products/edit/ProductVariationInformation";
import { ProductType } from "../../../../types/ProductType";
import usePutFetch from "../../../../custom_hooks/usePutFetch";
import { useRouter } from "next/router";
import { useAppSelector } from "../../../../Redux/hooks";
import EditProductHeadderCard from "../../../../components/Account/products/edit/EditProductHeadderCard";
import AdminStateCard from "../../../../components/Account/products/edit/AdminStateCard";
import SellerStateCard from "../../../../components/Account/products/edit/SellerStateCard";

export const getServerSideProps: GetServerSideProps = async (context) => {
  try {
    const cookies = ParseCookies(context.req.headers.cookie || "");
    await store.dispatch(FetchUserInfo(cookies["jwt"] || ""));
    if (!["Seller", "Admin"].includes(store.getState()?.userInfo?.value?.AccountType || "")) {
      return {
        // redirect: {
        //   permanent: true,
        //   destination: "/account",
        // },
        notFound: true,
      };
    }
    const prodcutId = context?.params?.id || "";

    const [groups, categories, tags, authors, manufacturers, attributes, SellerShops, Product] = await Promise.all([
      fetch("http://nginx-proxy/admin-service/groups").then((res) => res.json()),
      fetch("http://nginx-proxy/admin-service/categories").then((res) => res.json()),
      fetch("http://nginx-proxy/admin-service/tags").then((res) => res.json()),
      fetch("http://nginx-proxy/shops-service/authors").then((res) => res.json()),
      fetch("http://nginx-proxy/shops-service/manufacturers").then((res) => res.json()),
      fetch("http://nginx-proxy/shops-service/attributes").then((res) => res.json()),
      fetch("http://nginx-proxy/shops-service/sellershops", { headers: { Authorization: cookies["jwt"] } }).then((r) => r.json()),
      new Promise(async (res, rej) => {
        const url = store.getState().userInfo.value.AccountType === "Admin" ? `http://nginx-proxy/products-service/products/${prodcutId}` : `http://nginx-proxy/products-service/sellerproducts/${prodcutId}`;
        const resdata = await fetch(url, { headers: { Authorization: cookies["jwt"] } });
        if (resdata.ok) {
          res(await resdata.json());
        } else {
          rej(resdata.json());
        }
      }),
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
        Product,
        InitialState: store.getState(),
      },
    };
  } catch (e: any) {
    return {
      // redirect: {
      //   permanent: true,
      //   destination: "/account",
      // },
      notFound: true,
    };
  }
};

function edit({ authors, categories, groups, manufacturers, tags, attributes, SellerShops, Product }: { [key: string]: any; Product: ProductType }) {
  const userinfo = useAppSelector((state) => state.userInfo.value);
  const [createEnable, setcreateEnable] = useState(false);

  const [FeaturedImageSrc, setFeaturedImageSrc] = useState(Product.FeaturedImage);
  const [GallerySrc, setGallerySrc] = useState<string[]>(Product.Gallery);
  const [State, setState] = useState(Product.State);
  const [Message, setMessage] = useState(Product.Message || "");

  const [FeaturedImage, setFeaturedImage] = useState<File | null>(null);
  const [Gallery, setGallery] = useState<FileList | null>(null);
  const [Group, setGroup] = useState(Product.Group._id);
  const [Categories, setCategories] = useState<string[]>(Product.Categories.map((v) => v._id));
  const [Authors, setAuthors] = useState<string[]>(Product.Authors.map((v) => v._id));
  const [Manufacturers, setManufacturers] = useState<string[]>(Product.Manufacturers.map((v) => v._id));
  const [Tags, setTags] = useState<string[]>(Product.Tags.map((v) => v._id));

  const [ShopId, setShopId] = useState(Product.ShopId);

  const [Name, setName] = useState(Product.Name);
  const [Unit, setUnit] = useState(Product.Unit);
  const [Description, setDescription] = useState(Product.Description);
  const [Status, setStatus] = useState(Product.Status);
  const [ProductType, setProductType] = useState(Product.ProductType);

  const [Price, setPrice] = useState(Product?.SimpleProduct?.Price || "");
  const [SalePrice, setSalePrice] = useState(Product?.SimpleProduct?.SalePrice || "");
  const [Quantity, setQuantity] = useState(Product?.SimpleProduct?.Quantity || "");
  const [SKU, setSKU] = useState(Product?.SimpleProduct?.SKU || "");
  const [Width, setWidth] = useState(Product?.SimpleProduct?.Width || "");
  const [Height, setHeight] = useState(Product?.SimpleProduct?.Height || "");
  const [Length, setLength] = useState(Product?.SimpleProduct?.Length || "");
  const [IsDigital, setIsDigital] = useState(Product?.SimpleProduct?.IsDigital || false);
  const [IsExternal, setIsExternal] = useState(Product?.SimpleProduct?.IsExternal || false);
  const [DigitalProductFileSrc, setDigitalProductFileSrc] = useState<string>(Product?.SimpleProduct?.DigitalProductFile || "");
  const [DigitalProductFile, setDigitalProductFile] = useState<File | null>(null);
  const [ExternalProductURL, setExternalProductURL] = useState(Product?.SimpleProduct?.ExternalProduct?.URL || "");
  const [ExternalProductButtonLabel, setExternalProductButtonLabel] = useState(Product?.SimpleProduct?.ExternalProduct?.URL || "");

  const router = useRouter();
  const [Options, setOptions] = useState<OptionsType>([]);

  const [VariableProductVarientsState, setVariableProductVarientsState] = useState<{ [key: string]: VariableProductType }>({});

  useEffect(() => {
    let tmp: { [key: string]: any } = {};
    Product.VariableProduct.forEach((Variable) => {
      Variable.VarientAttributesValues.forEach((VarientAttributesValue) => {
        if (tmp[VarientAttributesValue?.Attribute?._id]) {
          tmp[VarientAttributesValue.Attribute._id].AttributeValues[VarientAttributesValue.Value._id] = VarientAttributesValue.Value;
        } else {
          tmp[VarientAttributesValue.Attribute._id] = { Key: VarientAttributesValue._id, Attribute: VarientAttributesValue.Attribute, AttributeValues: {} };
          tmp[VarientAttributesValue.Attribute._id].AttributeValues[VarientAttributesValue.Value._id] = VarientAttributesValue.Value;
        }
      });
    });
    setOptions(Object.values(tmp).map((v) => ({ Attribute: v.Attribute, AttributeValues: Object.values(v.AttributeValues), Key: v.Key })));

    /***************************************************************************************/

    let tmp2: { [key: string]: VariableProductType } = {};
    Product.VariableProduct.forEach((p) => {
      const ids = p.VarientAttributesValues.map((varient) => varient.Value._id);
      const Key = ids.sort().join("-");
      tmp2[Key] = { ...p, Key };
    });
    setVariableProductVarientsState(tmp2);
  }, []);

  const [VariableProductVarients, setVariableProductVarients] = useState<VariableProductType[]>([]);

  const { data: GetData, IsPending: GetIsPending, err: Geterr, get } = useGetFetch();
  const { data: Post1Data, IsPending: Post1IsPending, err: Post1err, post: Post1 } = usePostFetch();
  const { data: Post2Data, IsPending: Post2IsPending, err: Post2err, put } = usePutFetch();

  // useEffect(() => {
  //   if (ShopId && ShopId !== Product.ShopId && Name && Name != Product.Name && Unit && Unit != Product.Unit && Group && Group !==Product.Group._id) {
  //     let en = false;
  //     if (ProductType === "Simple" && Price && Quantity) {
  //       if (IsExternal && ExternalProductURL && ExternalProductButtonLabel) {
  //         en = true;
  //       } else if (IsDigital && DigitalProductFile) {
  //         en = true;
  //       }
  //       if (!IsDigital && !IsExternal) {
  //         en = true;
  //       }
  //     } else if (ProductType === "Variable") {
  //       if (VariableProductVarients.length === 0) en = false;
  //       en = true;
  //       VariableProductVarients.forEach((e) => {
  //         if (!(e.Price && e.Quantity && (!e.IsDigital || (e.IsDigital && e.DigitalProductFile)))) {
  //           en = false;
  //         }
  //       });
  //     }
  //     en ? setcreateEnable(true) : setcreateEnable(false);
  //   }
  // }, [ShopId, VariableProductVarients, Name, Unit, Group, ProductType, Price, Quantity, IsExternal, ExternalProductURL, ExternalProductButtonLabel, IsDigital, DigitalProductFile]);

  useEffect(() => {
    if (ShopId && Name && Unit && Group) {
      let en = false;
      if (FeaturedImage || (Gallery?.length || 0) !== 0 || Group != Product.Group._id || ShopId !== Product.ShopId || Name !== Product.Name || Unit !== Product.Unit || Description !== Product.Description || Status !== Product.Status || ProductType !== Product.ProductType || State !== Product.State || Message !== (Product.Message || "")) {
        en = true;
      }
      if (Categories.length === Product.Categories.length) {
        Product.Categories.some((v) => !Categories.includes(v._id)) && (en = true);
      } else {
        en = true;
      }
      if (Authors.length === Product.Authors.length) {
        Product.Authors.some((v) => !Authors.includes(v._id)) && (en = true);
      } else {
        en = true;
      }
      if (Manufacturers.length === Product.Manufacturers.length) {
        Product.Manufacturers.some((v) => !Manufacturers.includes(v._id)) && (en = true);
      } else {
        en = true;
      }
      if (Tags.length === Product.Tags.length) {
        Product.Tags.some((v) => !Tags.includes(v._id)) && (en = true);
      } else {
        en = true;
      }
      if (ProductType === "Simple" && Number.parseFloat("" + Price) > 0 && Quantity) {
        if ("" + Price !== "" + Product.SimpleProduct?.Price || "" + Quantity !== "" + Product.SimpleProduct?.Quantity || Height !== Product.SimpleProduct?.Height || SKU !== Product.SimpleProduct.SKU || Length !== Product.SimpleProduct?.Length || Width !== Product.SimpleProduct?.Width || "" + SalePrice !== "" + Product.SimpleProduct?.SalePrice) {
          en = true;
        }

        if (IsExternal && ExternalProductURL && ExternalProductButtonLabel) {
          if (IsExternal !== Product.SimpleProduct?.IsExternal || ExternalProductURL !== Product.SimpleProduct.ExternalProduct?.URL || ExternalProductButtonLabel !== Product.SimpleProduct.ExternalProduct.ButtonLabel) {
            en = true;
          }
        } else if ((IsDigital && DigitalProductFile) || Product.SimpleProduct?.DigitalProductFile) {
          if (IsDigital !== Product.SimpleProduct?.IsDigital || DigitalProductFile) {
            en = true;
          }
        } else if (!IsDigital && !IsExternal) {
          if (IsDigital !== Product.SimpleProduct?.IsDigital || IsExternal !== Product.SimpleProduct.IsExternal) {
            en = true;
          }
        }
        if ((IsDigital && !DigitalProductFile) || (IsExternal && (!ExternalProductButtonLabel || !ExternalProductURL))) {
          en = false;
        }
      }
      if (Product.ProductType === "Variable" && VariableProductVarients.length > 0) {
        VariableProductVarients.forEach((varient) => {
          const ids = varient.VarientAttributesValues.map((v) => v.Value._id);
          const Key = ids.sort().join("-");
          if (VariableProductVarientsState[Key] && varient.Price && varient.Quantity) {
            if (
              varient.Image instanceof File ||
              varient.IsDisabled !== VariableProductVarientsState[Key].IsDisabled ||
              "" + varient.Price !== "" + VariableProductVarientsState[Key].Price ||
              "" + varient.Quantity !== "" + VariableProductVarientsState[Key].Quantity ||
              varient.SKU !== VariableProductVarientsState[Key].SKU ||
              "" + varient.SalePrice !== "" + VariableProductVarientsState[Key].SalePrice
            ) {
              en = true;
            }
            if ((varient.IsDigital && varient.DigitalProductFile) || VariableProductVarientsState[Key]?.DigitalProductFile) {
              if (varient.IsDigital !== VariableProductVarientsState[Key].IsDigital || varient.DigitalProductFile) {
                en = true;
              }
            } else if (!varient.IsDigital) {
              if (varient.IsDigital !== VariableProductVarientsState[Key].IsDigital) {
                en = true;
              }
            }
          } else if (varient.Price && varient.Quantity) {
            if ((varient.IsDigital && varient.DigitalProductFile) || !varient.IsDigital) {
              en = true;
            }
          }
        });
        VariableProductVarients.some((v) => Number.parseFloat("" + v.Price) <= 0 || Number.parseFloat("" + v.Quantity) <= 0 || (v.IsDigital && !v.DigitalProductFile)) && (en = false);
      }

      console.log(en);
      setcreateEnable(en);
    }
  }, [FeaturedImage, Gallery, Group, Categories, Authors, Manufacturers, Tags, ShopId, Name, Unit, Description, Status, ProductType, Price, SalePrice, Quantity, SKU, Width, Height, Length, IsDigital, IsExternal, DigitalProductFileSrc, DigitalProductFile, ExternalProductURL, ExternalProductButtonLabel, VariableProductVarients, VariableProductVarientsState, State, Message]);

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
      Post1Data["FeaturedImage"] && Post1Data["FeaturedImage"].length > 0 && (payload.FeaturedImage = Post1Data["FeaturedImage"][0]);
      Post1Data["Gallery"] && (payload.Gallery = Post1Data["Gallery"]);
      Group && (payload.Group = Group);
      userinfo.AccountType === "Admin" && State && (payload.State = State);
      userinfo.AccountType === "Admin" && Message && (payload.Message = Message);
      Categories && (payload.Categories = Categories);
      Authors && (payload.Authors = Authors);
      Manufacturers && (payload.Manufacturers = Manufacturers);
      Tags && (payload.Tags = Tags);

      userinfo.AccountType === "Seller" && ShopId && (payload.ShopId = ShopId);

      Name && (payload.Name = Name);
      Unit && (payload.Unit = Unit);
      Description && (payload.Description = Description);
      Status && (payload.Status = Status);
      ProductType && (payload.ProductType = ProductType);
      if (ProductType === "Simple") {
        const SimpleProduct: any = {};
        SimpleProduct.Price = Number.parseFloat("" + Price || "0");
        SimpleProduct.SalePrice = Number.parseFloat("" + SalePrice || "0");
        SimpleProduct.Quantity = Number.parseFloat("" + Quantity || "0");
        SKU && (SimpleProduct.SKU = SKU);
        Width && (SimpleProduct.Width = Width);
        Height && (SimpleProduct.Height = Height);
        Length && (SimpleProduct.Length = Length);
        SimpleProduct.IsDigital = IsDigital;
        SimpleProduct.IsExternal = IsExternal;
        Post1Data["DigitalProductFile"] && Post1Data["DigitalProductFile"].length > 0 && (SimpleProduct.DigitalProductFile = Post1Data["DigitalProductFile"][0]);
        if (ExternalProductURL && ExternalProductButtonLabel) {
          SimpleProduct.ExternalProduct = { URL: ExternalProductURL, ButtonLabel: ExternalProductButtonLabel };
        }
        Object.keys(SimpleProduct).length > 0 && (payload.SimpleProduct = SimpleProduct);
      }
      if (ProductType === "Variable") {
        payload.VariableProduct = VariableProductVarients.map((v, i) => {
          const tmp = { ...v };
          tmp.VarientAttributesValues = tmp.VarientAttributesValues.map((v) => ({ Attribute: v.Attribute._id, Value: v.Value._id })) as any;
          Post1Data[`Varient${i + 1}Image`] && Post1Data[`Varient${i + 1}Image`].length > 0 && (tmp.Image = Post1Data[`Varient${i + 1}Image`][0]);
          Post1Data[`Varient${i + 1}DigitalProductFile`] && Post1Data[`Varient${i + 1}DigitalProductFile`].length > 0 && (tmp.DigitalProductFile = Post1Data[`Varient${i + 1}DigitalProductFile`][0]);
          return tmp;
        });
      }
      put(`/products-service/products/${router.query.id}`, JSON.stringify(payload));
      console.log(payload);
    }
  }, [Post1Data]);

  useEffect(() => {
    if (Post2Data) {
      router.back();
      // console.log(Post2Data);
    }
  }, [Post2Data]);

  return (
    <div>
      <Headder />
      <div className="flex mt-[60px]">
        <div className="w-[260px] h-[calc(100vh-60px)] sticky top-[60px]">
          <NavList />
        </div>
        <div className=" w-[calc(100%-260px)] bg-gray-100  p-10 ">
          <form className="space-y-10">
            <EditProductHeadderCard />
            {userinfo.AccountType === "Admin" ? <AdminStateCard State={State} setState={setState} Message={Message} setMessage={setMessage} MessageLog={Product.MessageLog} /> : <SellerStateCard MessageLog={Product.MessageLog} State={State} Message={Message} />}
            <FeaturedImageCard FeaturedImageSrc={FeaturedImageSrc} FeaturedImage={FeaturedImage} setFeaturedImage={setFeaturedImage} />
            <GalleryCard GallerySrc={GallerySrc} Gallery={Gallery} setGallery={setGallery} />
            {userinfo.AccountType === "Seller" && <SellerShopsCard Shops={SellerShops} ShopId={ShopId} setShopId={setShopId} />}
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
                DigitalProductFileSrc={DigitalProductFileSrc}
                DigitalProductFile={DigitalProductFile}
                setDigitalProductFile={setDigitalProductFile}
                ExternalProductURL={ExternalProductURL}
                setExternalProductURL={setExternalProductURL}
                ExternalProductButtonLabel={ExternalProductButtonLabel}
                setExternalProductButtonLabel={setExternalProductButtonLabel}
              />
            )}
            {ProductType === "Variable" && <ProductVariationInformation VariableProductVarientsState={VariableProductVarientsState} Options={Options} setOptions={setOptions} VariableProductVarients={VariableProductVarients} setVariableProductVarients={setVariableProductVarients} Attributes={attributes} />}
            {createEnable ? (
              <div onClick={createUploadUrl} className="flex justify-end">
                <div className="px-5 cursor-pointer drop-shadow-lg hover:bg-zinc-600  transition ease-in-out  select-none py-2 rounded-md bg-zinc-500 text-white">Save</div>
              </div>
            ) : (
              <div className="flex justify-end">
                <div className="px-5  drop-shadow-lg  transition ease-in-out  select-none py-2 rounded-md bg-zinc-400 text-white">Save</div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}

export default edit;
