//handle to ipc - for sending messages
//between back end and front end
const {ipcRenderer} = require('electron')
const cl = x=> console.log(x)
function scan()
{
    let resultsElement = document.getElementById("results-container");
    deleteChildren(resultsElement)
    //send message to main process to perform scan
    ipcRenderer.send('scan-button-clicked', 'click')
}

// SCAN button listener
// needs to be BELOW the listener (ipcRenderer.on)
document.getElementById("scan").addEventListener("click", scan);

// ======================================== DISPLAY DATA FUNCTIONS

//remove all child elements
function deleteChildren (myNode){

    while (myNode.firstChild) {
	myNode.removeChild(myNode.firstChild);
    }

}
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


//abstract function that creates specified element with attribute and text
let createElement = (parent,element,text,attribute,attributeName)=>
    {
	//create node
	let node = document.createElement(element)
	//add text node
	let textNode = document.createTextNode(text)
	// append text to node
	node.appendChild(textNode)
	//add attribute to element
	addAttribute(attribute,attributeName, node)
	//append div for each rate
	parent.appendChild(node)
	return node
    }

const getCurrency1 = pair=>pair.substring(0,3)
const getCurrency2 = pair=>pair.substring(3,7)

//returns number of keys
let getNumberOfKeys = obj=>Object.keys(obj).length



let insertResults = obj=>
    {
	//save data for future reference
	let data = obj
	//loop over all keys (rates)
	Object.keys(obj)
	    .forEach(rate=>{
		let ele = createElement(resultsContainer,'div','','class','result')
		cl(ele)
		createElement( ele, 'div', ratePercent(rate), 'class', 'result-rate')
		createElement( ele, 'div', getNumberOfKeys(data[rate]), 'class', 'result-jumps')

		//create handle to details element (starts hidden )
		let details = createElement( ele, 'div', 'Details','class','results-details')
		Object.keys(data[rate])
		    .forEach(pair=>{
			let jump = createElement( details, 'div', '','class','results-jump')
			let getMarketName = obj=>data[rate][pair][2]
			let getRate = obj=>data[rate][pair][1][0]
			
			createElement( jump, 'div', getMarketName(data), 'class', 'results-jumps-market')
			createElement( jump, 'span', getCurrency1(pair), 'class', 'results-jump-currency')
			createElement( jump, 'span', '   ===>   ', 'class', 'results-jump-currency')
			createElement( jump, 'span', getCurrency2(pair), 'class', 'results-jump-currency')
			createElement( jump, 'div', getRate(data), 'class', 'results-jumps-market')			
		    // 	//split pair into separate currency codes
		    // 	let c1 = getCurrency1(pair)
		    // 	let c2 = getCurrency2(pair)
			
		    // 	createElement( details, 'div', , 'class', 'result-jumps')
		    // }
		    })
		
	    })
    }
// ============================== DATA FROM SCAN

//receives scan data from main process
ipcRenderer.on('scan-data', (event, data) => {
    insertResults(data)
})
