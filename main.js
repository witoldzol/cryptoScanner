//utility functions
let util = require('./util')
let cl = x=>console.log(x)

//electron
const electron = require('electron')
const {app, BrowserWindow} = require('electron')

//create browser window
function createWindow()
{
	win = new BrowserWindow({width: 800,
				 height: 600})
	win.loadFile('index.html')
}

app.on('ready', createWindow)





    
