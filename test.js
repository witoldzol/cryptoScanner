let obj = {
    "luno": {
        "ETHXBT": {
            "asks": [{
                "price": "0.0654",
                "volume": "0.13"
            }, {
                "price": "0.0654",
                "volume": "0.45"
            }, {
                "price": "0.0654",
                "volume": "2.34"
            }, {
                "price": "0.0655",
                "volume": "0.02"
            }, {
                "price": "0.0655",
                "volume": "0.90"
            }, {
                "price": "0.0656",
                "volume": "0.02"
            }, {
                "price": "0.0656",
                "volume": "0.02"
            }, {
                "price": "0.0656",
                "volume": "0.02"
            }, {
                "price": "0.0656",
                "volume": "0.02"
            }, {
                "price": "0.0656",
                "volume": "0.71"
            }],
            "bids": [{
                "price": "0.0652",
                "volume": "0.14"
            }, {
                "price": "0.0651",
                "volume": "9.21"
            }, {
                "price": "0.0651",
                "volume": "1.00"
            }, {
                "price": "0.0651",
                "volume": "0.12"
            }, {
                "price": "0.0651",
                "volume": "0.31"
            }, {
                "price": "0.0651",
                "volume": "0.22"
            }, {
                "price": "0.065",
                "volume": "0.01"
            }, {
                "price": "0.065",
                "volume": "0.10"
            }, {
                "price": "0.065",
                "volume": "0.10"
            }, {
                "price": "0.065",
                "volume": "0.02"
            }]
        },
        "XBTIDR": {
            "asks": [{
                "price": "103463000.00",
                "volume": "0.1174"
            }, {
                "price": "103479000.00",
                "volume": "0.001"
            }, {
                "price": "103547000.00",
                "volume": "0.882688"
            }, {
                "price": "104000000.00",
                "volume": "0.00084"
            }, {
                "price": "105595000.00",
                "volume": "0.02182"
            }, {
                "price": "105600000.00",
                "volume": "0.0312"
            }, {
                "price": "105600000.00",
                "volume": "0.003931"
            }, {
                "price": "105600000.00",
                "volume": "0.049709"
            }, {
                "price": "105696000.00",
                "volume": "0.003206"
            }, {
                "price": "105799000.00",
                "volume": "0.0005"
            }],
            "bids": [{
                "price": "103451000.00",
                "volume": "0.1441"
            }, {
                "price": "103000000.00",
                "volume": "0.01507"
            }, {
                "price": "103000000.00",
                "volume": "0.005"
            }, {
                "price": "103000000.00",
                "volume": "0.0005"
            }, {
                "price": "103000000.00",
                "volume": "0.009105"
            }, {
                "price": "102000000.00",
                "volume": "0.0019"
            }, {
                "price": "102000000.00",
                "volume": "0.0005"
            }, {
                "price": "101711000.00",
                "volume": "0.0005"
            }, {
                "price": "101710000.00",
                "volume": "0.001"
            }, {
                "price": "101000000.00",
                "volume": "0.001"
            }]
        }
    }
}
let cl = x=>console.log(x)
let l = obj['luno']

let removeObj = x=>
    {
	let arr = x.map(y=>
	      {
		  cl(y['price'])
		  [y['price'], y['volume']]
	      })
	return arr
    }

let format = (obj)=>
    {
	
	let a= Object.keys(obj['luno']).map(x=>x)
	let b=a.forEach(x=>{let a = removeObj( l[x]['bids']);cl(a)}) //all arrays
	
	
	

    }

format(obj)

