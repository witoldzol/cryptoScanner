//handle to ipc - for sending messages
//between back end and front end
const {ipcRenderer} = require('electron')

function scan()
{
    //clear the results section
    //deletes all children elements
    let myNode = document.getElementById("results-container");
    while (myNode.firstChild) {
	myNode.removeChild(myNode.firstChild);
    }
    //send message to main process to perform scan
    ipcRenderer.send('scan-button-clicked', 'click')
}
// when we click SCAN button
// needs to be BELOW the listener (ipcRenderer.on)
document.getElementById("scan").addEventListener("click", scan);



// ======================================== DISPLAY DATA FUNCTIONS


//multiply by 100 to get %
//multiply by 100 again and divide by 100 to round 
let ratePercent =rate=>Math.round((rate-1) *100 * 100) / 100


//creates and appends attributes with values to elements
let addAttribute = (att,value,element)=>
    {
	let a = document.createAttribute(att)
	a.value = value
	element.setAttributeNode(a)
    }

//handle to container
let resultsContainer = document.getElementById('results-container')

let createDivs = obj=>
    {

	//loop over all keys (rates)
	Object.keys(obj)
	    .forEach(rate=>{
		console.log('rate ' + rate)
		//create node
		let node = document.createElement("div")
		//add text node
		let textNode = document.createTextNode(ratePercent(rate))
		// append text to node
		node.appendChild(textNode)
		//add attribute to element
		addAttribute('class','result',node)
		//append div for each rate
		resultsContainer.appendChild(node)
	    })
    }


// ============================== DATA FROM SCAN

//receives scan data from main process
ipcRenderer.on('scan-data', (event, data) => {
    console.log(Object.keys(data))
    console.log('what is going on/>')
    createDivs(data)
    
})
