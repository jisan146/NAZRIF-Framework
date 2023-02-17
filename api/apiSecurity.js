const fs = require('fs');
var md5 = require('md5');

function authentication(uid)
{
      var auth=0;




      try
      {
        auth=fs.readFileSync(__dirname+'/token/'+md5(uid), 'utf8');
      }
      catch(ex)
      {
        auth='denied';
       // console.log(ex)
      }
      
      return auth;

}
module.exports = {
    authentication,
  };