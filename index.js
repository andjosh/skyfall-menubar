var menubar = require('menubar'),
    request = require('request'),
    debug   = require('debug')('skyfall.index'),
    mb      = {},
    options = {},
    latest  = false;

options = {
    width:  150,
    height: 150
};
mb = menubar(options);
mb.on('ready', ready);
mb.on('show', show);
mb.on('after-show', showAfter);

function ready () {
    debug('app is ready');
    refreshLatest();
    setInterval(refreshLatest, 30000);
}

function show() {
    debug('app will show');
}

function showAfter() {
    debug('app did show');
    sendLatest();
    mb.window.webContents.on('did-finish-load', handleLoad);
}

function refreshLatest() {
    request('http://skyfall.andjosh.com/output/latest', handleLatest);
}

function handleLoad() {
    debug('app did finish load');
    sendLatest();
}

function sendLatest() {
    if (!mb.window) return;
    mb.window.webContents.send('skyfall', latest);
}

function handleLatest(error, response, body) {
    if (error || (response.statusCode != 200)) {
        return;
    }
    body = JSON.parse(body);
    debug(body);
    latest = body;
    sendLatest();
}
