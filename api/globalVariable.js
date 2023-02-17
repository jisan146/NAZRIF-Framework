//uploadPath='../public/userFiles'
uploadPath=__dirname +'/userFiles'
apiRewrite='/node'
//apiRewrite='/nazrif_api'

var os = require("os");
var hostname = os.hostname();
console.log(hostname)

if(hostname=='DESKTOP-P0471EV')
{
  apiRewrite='/node'
  console.log(apiRewrite)
  
  
  
  
}else
{
  apiRewrite='/nazrif_api' 
  
}
apiRewrite='/node'
module.exports = {
    uploadPath,apiRewrite,

  };

  