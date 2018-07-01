const axios = require('axios')
const async = require('async')
//util
let cl=x=>console.log(x)
//instance of axios 
let ax = axios.create({
    baseURL: 'https://api.pro.coinbase.com',
    timeout: 5000,
    headers: {
	    'User-Agent': 'linux chrome',
        'CB-ACCESS-KEY': 'lol'
    }
})

//call
ax.get('/products')
     .then(res=>

           {
               //array with currency prices 
               let urlArray = res.data.map(x=>'products/'+ x.id + '/book?level=2')
	       cl('array len: ' + urlArray.length)
              //takes in 3 params, array, iterator function to be executed on each ele, and callback
               async.mapLimit(urlArray,1,getProductPrice,(err,res)=>
                        {
                            if(err)return
                        })
              
          })

let getProductPrice = async url=>
    {
        await ax.get(url)
            .then( res=>
                   {
                       cl(url)
                       let bids = res.data.bids
                       let asks = res.data.asks
                       cl(`lowest bid is : ${bids[0]}`)
                       cl(`lowest ask is : ${asks[0]}`)
                   })
            .catch(err=>cl('error'))
    }
