//promise with built in re-try & limit
//source:
//https://stackoverflow.com/questions/38213668/promise-retry-design-patterns
Promise.retry = function(fn, times, delay)
{
    let error
    let attempt = ()=>
	{
	    //if we ran out of attempts, reject
	    if(times == 0)
	    {
		reject(error)
	    }
	    else  //try & re-try if err
	    {
		fn().then( res=>{cl('returning result'); return res})
		    .catch( err=>
			    {
				times--
				error = e
				delay(3000).then(()=>attempt())
				
			    })
	    }
	}
    //trigger
    attempt()
}
//----------------------------------

