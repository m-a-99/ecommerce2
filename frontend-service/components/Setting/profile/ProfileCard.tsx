import React from "react";
import Adresses from "./components/Adresses";
import ContactNubmer from "./components/ContactNubmer";
import ImgNameBioCard from "./components/ImgNameBioCard";


const ProfileCard = () => {
  return (
    <div className="col-span-9 space-y-10">
          <ImgNameBioCard />
          <ContactNubmer />
          <Adresses />
    </div>
  );
};

export default ProfileCard;
