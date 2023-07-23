const { default:  mongoose } = require("mongoose");
const { DBconnect } = require(".");
const { DB_URL } = require("../config");
const { ShopsModel } = require("./models");

async function init() {
    await DBconnect(DB_URL)
    ShopsModel.insertMany([
      {
        Logo: new mongoose.Types.ObjectId(),
        CoverImage: new mongoose.Types.ObjectId(),
        Name: "cloths",
        Description: "lorem",
        Address: {
          city: "gaza",
          country: "palestine",
          state: "zaitoon",
          street_address: "ex54552",
          zip: "65165",
        },
        PaymentInfo: {
          AccountHolderEmail: "zca@adc.com",
          AccountNumber: "56465313512123",
          AccountHolderName: "jjandkjn",
          BankName: "palestine",
        },
        ShopSettings: {
          ContactNumber: "561651635135",
          Location: {
            Latitude: "5222",
            Longtude: "546351",
          },
          Website: "www.coakcm.com",
        },
      },
      {
        Logo: new mongoose.Types.ObjectId(),
        CoverImage: new mongoose.Types.ObjectId(),
        Name: "furniture",
        Description: "lorem",
        Address: {
          city: "gaza",
          country: "palestine",
          state: "zaitoon",
          street_address: "ex54552",
          zip: "65165",
        },
        PaymentInfo: {
          AccountHolderEmail: "zca@adc.com",
          AccountNumber: "56465313512123",
          AccountHolderName: "jjandkjn",
          BankName: "palestine",
        },
        ShopSettings: {
          ContactNumber: "561651635135",
          Location: {
            Latitude: "5222",
            Longtude: "546351",
          },
          Website: "www.coakcm.com",
        },
      },
      {
        Logo: new mongoose.Types.ObjectId(),
        CoverImage: new mongoose.Types.ObjectId(),
        Name: "techs",
        Description: "lorem",
        Address: {
          city: "gaza",
          country: "palestine",
          state: "zaitoon",
          street_address: "ex54552",
          zip: "65165",
        },
        PaymentInfo: {
          AccountHolderEmail: "zca@adc.com",
          AccountNumber: "56465313512123",
          AccountHolderName: "jjandkjn",
          BankName: "palestine",
        },
        ShopSettings: {
          ContactNumber: "561651635135",
          Location: {
            Latitude: "5222",
            Longtude: "546351",
          },
          Website: "www.coakcm.com",
        },
      },
      {
        Logo: new mongoose.Types.ObjectId(),
        CoverImage: new mongoose.Types.ObjectId(),
        Name: "grooce",
        Description: "lorem",
        Address: {
          city: "gaza",
          country: "palestine",
          state: "zaitoon",
          street_address: "ex54552",
          zip: "65165",
        },
        PaymentInfo: {
          AccountHolderEmail: "zca@adc.com",
          AccountNumber: "56465313512123",
          AccountHolderName: "jjandkjn",
          BankName: "palestine",
        },
        ShopSettings: {
          ContactNumber: "561651635135",
          Location: {
            Latitude: "5222",
            Longtude: "546351",
          },
          Website: "www.coakcm.com",
        },
      },
      {
        Logo: new mongoose.Types.ObjectId(),
        CoverImage: new mongoose.Types.ObjectId(),
        Name: "bags",
        Description: "lorem",
        Address: {
          city: "gaza",
          country: "palestine",
          state: "zaitoon",
          street_address: "ex54552",
          zip: "65165",
        },
        PaymentInfo: {
          AccountHolderEmail: "zca@adc.com",
          AccountNumber: "56465313512123",
          AccountHolderName: "jjandkjn",
          BankName: "palestine",
        },
        ShopSettings: {
          ContactNumber: "561651635135",
          Location: {
            Latitude: "5222",
            Longtude: "546351",
          },
          Website: "www.coakcm.com",
        },
      },
      {
        Logo: new mongoose.Types.ObjectId(),
        CoverImage: new mongoose.Types.ObjectId(),
        Name: "hats",
        Description: "lorem",
        Address: {
          city: "gaza",
          country: "palestine",
          state: "zaitoon",
          street_address: "ex54552",
          zip: "65165",
        },
        PaymentInfo: {
          AccountHolderEmail: "zca@adc.com",
          AccountNumber: "56465313512123",
          AccountHolderName: "jjandkjn",
          BankName: "palestine",
        },
        ShopSettings: {
          ContactNumber: "561651635135",
          Location: {
            Latitude: "5222",
            Longtude: "546351",
          },
          Website: "www.coakcm.com",
        },
      },
    ]);
}
init();