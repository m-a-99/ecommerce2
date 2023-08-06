import Link from "next/link";
import { useAppSelector } from "../../Redux/hooks";

const NavList = () => {
  // const { buttonColor, buttonHover } = useAppSelector((state) => state.themeReducer.value);
  // const NavListRef = useRef<HTMLDivElement | null>(null);
  // useEffect(() => {
  //   if (NavListRef.current && buttonHover && buttonHover != "none") {
  //     NavListRef.current.style.setProperty("--buttonHover", buttonHover);
  //   }
  // }, []);

  const userInfo =useAppSelector(state=>state.userInfo.value)

  return (
    <div className="h-full overflow-auto w-full text-gray-600 p-5">
      <Link href="/account/dashboard">
        <div className="space-x-2 cursor-pointer select-none transition  ease-in-out hover:bg-indigo-500 hover:text-white  h-12  bg-white items-center flex p-4">
          <i className="fa-regular fa-grid-2"></i>
          <span>Dashboard</span>
        </div>
      </Link>

      {userInfo.AccountType === "Admin" && (
        <Link href="/account/shops">
          <div className="space-x-2 cursor-pointer select-none transition  ease-in-out hover:bg-indigo-500 hover:text-white  h-12  bg-white items-center flex p-4">
            <i className="far fa-shop"></i>
            <span>Shops</span>
          </div>
        </Link>
      )}

      {userInfo.AccountType === "Seller" && (
        <Link href="/account/myshops">
          <div className="space-x-2 cursor-pointer select-none transition  ease-in-out hover:bg-indigo-500 hover:text-white  h-12  bg-white items-center flex p-4">
            <i className="far fa-shop"></i>
            <span>My Shops</span>
          </div>
        </Link>
      )}

      <Link href="/account/products">
        <div className="space-x-2 cursor-pointer select-none transition  ease-in-out hover:bg-indigo-500 hover:text-white  h-12  bg-white items-center flex p-4">
          <i className="far fa-cubes"></i>
          <span>Products</span>
        </div>
      </Link>

      <Link href="/account/attributes">
        <div className="space-x-2 cursor-pointer select-none transition  ease-in-out hover:bg-indigo-500 hover:text-white  h-12  bg-white items-center flex p-4">
          <i className="fa-regular fa-folder-gear"></i>
          <span>Attributes</span>
        </div>
      </Link>

      {userInfo.AccountType === "Admin" && (
        <Link href="/account/groups">
          <div className="space-x-2 cursor-pointer select-none transition  ease-in-out hover:bg-indigo-500 hover:text-white  h-12  bg-white items-center flex p-4">
            <i className="far fa-layer-group"></i>
            <span>Groups</span>
          </div>
        </Link>
      )}

      {userInfo.AccountType === "Admin" && (
        <Link href="/account/categories">
          <div className="space-x-2 cursor-pointer select-none transition  ease-in-out hover:bg-indigo-500 hover:text-white  h-12  bg-white items-center flex p-4">
            <i className="far fa-filter-list"></i>
            <span>Categories</span>
          </div>
        </Link>
      )}
      <Link href="/account/tags">
        <div className="space-x-2 cursor-pointer select-none transition  ease-in-out hover:bg-indigo-500 hover:text-white  h-12  bg-white items-center flex p-4">
          <i className="far fa-tag"></i>
          <span>Tags</span>
        </div>
      </Link>
      {userInfo.AccountType === "Admin" && (
        <Link href="/account/icons">
          <div className="space-x-2 cursor-pointer select-none transition  ease-in-out hover:bg-indigo-500 hover:text-white  h-12  bg-white items-center flex p-4">
            <i className="far fa-icons"></i>
            <span>Icons</span>
          </div>
        </Link>
      )}
      {userInfo.AccountType === "Admin" && (
        <Link href="/account/socialmediaplatforms">
          <div className="space-x-2 cursor-pointer select-none transition  ease-in-out hover:bg-indigo-500 hover:text-white  h-12  bg-white items-center flex p-4">
            <i className="fa-light fa-share-nodes"></i>
            <span>Social Media </span>
          </div>
        </Link>
      )}
      <Link href="/account/manufacturers">
        <div className="space-x-2 cursor-pointer select-none transition  ease-in-out hover:bg-indigo-500 hover:text-white  h-12  bg-white items-center flex p-4">
          <i className="far fa-conveyor-belt-boxes"></i>
          <span>Manufacturers</span>
        </div>
      </Link>

      <Link href="/account/authors">
        <div className="space-x-2 cursor-pointer select-none transition  ease-in-out hover:bg-indigo-500 hover:text-white  h-12  bg-white items-center flex p-4">
          <i className="fa-regular fa-feather"></i>
          <span>Authors</span>
        </div>
      </Link>

      <Link href="/account/orders">
        <div className="space-x-2 cursor-pointer select-none transition  ease-in-out hover:bg-indigo-500 hover:text-white  h-12  bg-white items-center flex p-4">
          <i className="far fa-bring-front"></i>
          <span>Orders</span>
        </div>
      </Link>

      {userInfo.AccountType === "Admin" && (
        <Link href="/account/orderstatus">
          <div className="space-x-2 cursor-pointer select-none transition  ease-in-out hover:bg-indigo-500 hover:text-white  h-12  bg-white items-center flex p-4">
            <i className="far fa-flag-swallowtail"></i>
            <span>Order Status</span>
          </div>
        </Link>
      )}

      {userInfo.AccountType === "Admin" && (
        <Link href="/account/users">
          <div className="space-x-2 cursor-pointer select-none transition  ease-in-out hover:bg-indigo-500 hover:text-white  h-12  bg-white items-center flex p-4">
            <i className="far fa-users"></i>
            <span>Users</span>
          </div>
        </Link>
      )}

      <Link href="/account/coupons">
        <div className="space-x-2 cursor-pointer select-none transition  ease-in-out hover:bg-indigo-500 hover:text-white  h-12  bg-white items-center flex p-4">
          <i className="far fa-gifts"></i>
          <span>Coupons</span>
        </div>
      </Link>

      {userInfo.AccountType === "Admin" && (
        <Link href="/account/taxes">
          <div className="space-x-2 cursor-pointer select-none transition  ease-in-out hover:bg-indigo-500 hover:text-white  h-12  bg-white items-center flex p-4">
            <i className="far fa-envelope-open-dollar"></i>
            <span>Taxes</span>
          </div>
        </Link>
      )}

      {userInfo.AccountType === "Admin" && (
        <Link href="/account/shippings">
          <div className="space-x-2 cursor-pointer select-none transition  ease-in-out hover:bg-indigo-500 hover:text-white  h-12  bg-white items-center flex p-4">
            <i className="fa-regular fa-van-shuttle"></i>
            <span>Shippings</span>
          </div>
        </Link>
      )}

      <Link href="/account/withdrawals">
        <div className="space-x-2 cursor-pointer select-none transition  ease-in-out hover:bg-indigo-500 hover:text-white  h-12  bg-white items-center flex p-4">
          <i className="far fa-receipt"></i>
          <span>Withdrawals</span>
        </div>
      </Link>

      <Link href="/account/refunds">
        <div className="space-x-2 cursor-pointer select-none transition  ease-in-out hover:bg-indigo-500 hover:text-white  h-12  bg-white items-center flex p-4">
          <i className="fa-regular fa-circle-dollar"></i>
          <span>Refunds</span>
        </div>
      </Link>

      <Link href="/account/questions">
        <div className="space-x-2 cursor-pointer select-none transition  ease-in-out hover:bg-indigo-500 hover:text-white  h-12  bg-white items-center flex p-4">
          <i className="far fa-circle-question"></i>
          <span>Questions</span>
        </div>
      </Link>

      <Link href="/account/reviews">
        <div className="space-x-2 cursor-pointer select-none transition  ease-in-out hover:bg-indigo-500 hover:text-white  h-12  bg-white items-center flex p-4">
          <i className="far fa-star-sharp-half-stroke"></i>
          <span>Reviews</span>
        </div>
      </Link>

      <Link href="/account/settings">
        <div className="space-x-2 cursor-pointer select-none transition  ease-in-out hover:bg-indigo-500 hover:text-white  h-12  bg-white items-center flex p-4">
          <i className="fa-regular fa-gear"></i>
          <span>Settings</span>
        </div>
      </Link>
    </div>
  );
};

export default NavList;
