//============================== MAIN ==============================
// Modules to control application life and create native browser window
const { app, BrowserWindow } = require('electron')
const luno = require('./luno.js')
const binance = require('./binance.js')
const gdax = require('./gdax.js')
const async = require('async')
const axios = require('axios')
const util = require('./util.js')
const fs = require('fs')

//MISC
let cl = x=>console.log(x)

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow

function createWindow() {
  // Create the browser window.
    mainWindow = new BrowserWindow({ width: 200, height: 200 })

  // and load the index.html of the app.
  mainWindow.loadFile('index.html')

  // Open the DevTools.
  // mainWindow.webContents.openDevTools()

  // Emitted when the window is closed.
  mainWindow.on('closed', function() {
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    mainWindow = null
  })
}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow)

// Quit when all windows are closed.
app.on('window-all-closed', function() {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function() {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (mainWindow === null) {
    createWindow()
  }
})

//we need to use async to await results?
let wrap = async ()=>
    {
	let res = await luno.getPrices()
	cl(res)
    }
let start = Date.now()

let lunoPrices =  util.getPrices(luno.settings)
    .then(x=>luno.formatData(x))
    // .then(x=>cl(x))
    .catch(e=>console.log('LUNO-GET_PRICE_FUNCTION ERROR ===> ' + e))


// let gdaxPrices = util.getPrices(gdax.settings)
//     .then(x=>gdax.formatData(x))
//     .catch(e=>console.log('GDAX-GET_PRICE_FUNCTION ERROR ===>' + e))
// let binancePrices = util.getPrices(binance.settings).then(x=>binance.formatData(x)).catch(e=>console.log('BINANCE-GET_PRICE_FUNCTION ERROR ===>' + e))
// Promise.all([lunoPrices,gdaxPrices,binancePrices]).then(x=>cl(JSON.stringify(util.formatData(x)))).catch(e=>cl('error from main pricess ALL.Promise: ' + e))

