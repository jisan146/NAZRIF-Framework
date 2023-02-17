
((require) => {
   
    var con = require('../dbConfig');
      
           
            con
            .query("select * from business_logic",
                function (err, logic, fields) {
                    if (err) {
                        console.log(err)

                    } else {

                        data.send([
                            {
                                type: '',
                                name: '1',
                                value: ''
                            },  {
                                type: 'state',
                                name: 'submitBtnEnable',
                                value: true
                            }, {
                                type: 'state',
                                name: 'SubmitMSG',
                                value: ClientReq.body[0].query_id
                            }


                        ]);




                    }})


                   
            


        
   
})

