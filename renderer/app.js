const cl = x=>console.log(x)
// let resultArray = document.getElementsByClassName('result')
let resultArray = document.getElementsByClassName('result-button')

for (var i = 0; i < resultArray.length; i++) {
	resultArray[i].addEventListener('click', toggleResults, false)
}



function toggleResults(e)
{
	//get the target of the event (click in this case)
	//and then get second sibling of this (button) element 
	//first is Text, seoncd is the details div
	let x = e.target.nextSibling.nextSibling
	//toggle between visible and not 
    if (x.style.display === "") {
        x.style.display = "block";
    } else {
        x.style.display = "";
    }
}
