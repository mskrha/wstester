const ID_STATE = 'state';

const DEFAULT_HOST = '127.0.0.1';
const DEFAULT_PORT = 8080;
const DEFAULT_URL = '/';

var ws = null;
var ws_dst = null;

function connect() {
	proto = document.getElementById('ssl').checked ? 'wss://' : 'ws://';
	host = (document.getElementById('host').value.length == 0) ? DEFAULT_HOST : document.getElementById('host').value;
	port = (document.getElementById('port').value.length == 0) ? DEFAULT_PORT : document.getElementById('port').value;
	url = (document.getElementById('url').value.length == 0) ? DEFAULT_URL : document.getElementById('url').value;
	ws_dst = proto + host + ':' + port + url;
	document.getElementById(ID_STATE).style.backgroundColor = 'DeepSkyBlue';
	document.getElementById(ID_STATE).innerHTML = 'CONNECTING';

	if (!ws) {
		ws = new WebSocket(ws_dst);
		ws.onopen = function() { WSonOpen() };
		ws.onclose = function(e) { WSonClose(e) };
		ws.onmessage = function(e) { WSonMessage(e) };
		ws.onerror = function(e) { WSonError(e) };
	}
}

function disconnect() {
	if (ws) {
		ws.close();
	}
}

function send() {
	const msg = document.getElementById('msg').value;
	if (msg.length > 0) {
		writeLog('SEND: ' + msg);
		WSsend(msg);
	}
	document.getElementById('msg').focus();
}

function writeLog(msg) {
	if (msg) {
		if (msg.length > 0) {
			var a = document.createElement('span');
			var b = document.createElement('br');
			var c = document.createTextNode(Date().toLocaleString() + ': ' + msg);
			a.appendChild(b);
			a.appendChild(c);
			var l = document.getElementById('log');
			l.insertBefore(a, l.childNodes[0]);
		}
	}
}

function clearLog() {
	var x = document.getElementById('log');
	while (x.firstChild) {
		x.removeChild(x.firstChild);
	}
	document.getElementById('msg').value = '';
	document.getElementById('msg').focus();
}

function WSonOpen() {
	if (!ws) {
		setTimeout(WSonOpen, 500);
	} else {
		document.getElementById(ID_STATE).style.backgroundColor = 'Lime';
		document.getElementById(ID_STATE).innerHTML = 'CONNECTED';
	}
}

function WSonClose(e) {
	if (ws) {
		ws = null;
		document.getElementById(ID_STATE).style.backgroundColor = 'Red';
		document.getElementById(ID_STATE).innerHTML = 'DISCONNECTED';
	}
}

function WSonMessage(m) {
	if (m) {
		writeLog('RECV: ' + m.data);
	}
}

function WSonError(e) {
	if (e && (typeof e.data != 'undefined')) writeLog('WEBSOCKET: Error: ' + e.data);
}

function WSsend(msg) {
	if (msg) {
		if (ws) {
			ws.send(msg, function (e) {
				if (e) {
					writeLog('WEBSOCKET: Error: ' + e);
					ws.close();
				}
			});
		} else {
			writeLog('WebSocket NOT ready!');
		}
	}
}
