//const fs = require('fs');

const { MSG_QUEUE_URL, SERVICE_NAME } = require("./src/config");
const { fileUpload, createchannel } = require("./src/utils");

// const st=fs.createReadStream("/hdd/wifipass.txt");

// const g=(d)=>{
//     return new Promise(res => {
//         setTimeout(() => {
//             res(d)
//         }, 1000);
//     })
// }

// st.on("data",async (d)=>{
//     st.pause();
//   const dw=await g(d);
//   st.resume()
//   console.log(dw)
// })

//const ws= fs.createWriteStream("./aaa")


async function run(){
    const channel=await createchannel(MSG_QUEUE_URL);
  for(let i=0;i<1;i++){
      fileUpload(channel, SERVICE_NAME, "fileUpload", '/hdd/downloads/pexels-ksenia-chernaya-3965545.jpg', JSON.stringify({ fileName: "ccc_memememm.jpg" })).then(d => {
          console.log(d)
      })
      fileUpload(channel, SERVICE_NAME, "fileUpload", '/hdd/wifipass.txt', JSON.stringify({ fileName: "ccc_memememm.jpg" })).then(d => {
          console.log(d)
      })
  }
}

run()