/* Library */

!function(a,b){"function"==typeof define&&define.amd?define([],b):"undefined"!=typeof module&&module.exports?module.exports=b():a.ReconnectingWebSocket=b()}(this,function(){function a(b,c,d){function l(a,b){var c=document.createEvent("CustomEvent");return c.initCustomEvent(a,!1,!1,b),c}var e={debug:!1,automaticOpen:!0,reconnectInterval:1e3,maxReconnectInterval:3e4,reconnectDecay:1.5,timeoutInterval:2e3};d||(d={});for(var f in e)this[f]="undefined"!=typeof d[f]?d[f]:e[f];this.url=b,this.reconnectAttempts=0,this.readyState=WebSocket.CONNECTING,this.protocol=null;var h,g=this,i=!1,j=!1,k=document.createElement("div");k.addEventListener("open",function(a){g.onopen(a)}),k.addEventListener("close",function(a){g.onclose(a)}),k.addEventListener("connecting",function(a){g.onconnecting(a)}),k.addEventListener("message",function(a){g.onmessage(a)}),k.addEventListener("error",function(a){g.onerror(a)}),this.addEventListener=k.addEventListener.bind(k),this.removeEventListener=k.removeEventListener.bind(k),this.dispatchEvent=k.dispatchEvent.bind(k),this.open=function(b){h=new WebSocket(g.url,c||[]),b||k.dispatchEvent(l("connecting")),(g.debug||a.debugAll)&&console.debug("ReconnectingWebSocket","attempt-connect",g.url);var d=h,e=setTimeout(function(){(g.debug||a.debugAll)&&console.debug("ReconnectingWebSocket","connection-timeout",g.url),j=!0,d.close(),j=!1},g.timeoutInterval);h.onopen=function(){clearTimeout(e),(g.debug||a.debugAll)&&console.debug("ReconnectingWebSocket","onopen",g.url),g.protocol=h.protocol,g.readyState=WebSocket.OPEN,g.reconnectAttempts=0;var d=l("open");d.isReconnect=b,b=!1,k.dispatchEvent(d)},h.onclose=function(c){if(clearTimeout(e),h=null,i)g.readyState=WebSocket.CLOSED,k.dispatchEvent(l("close"));else{g.readyState=WebSocket.CONNECTING;var d=l("connecting");d.code=c.code,d.reason=c.reason,d.wasClean=c.wasClean,k.dispatchEvent(d),b||j||((g.debug||a.debugAll)&&console.debug("ReconnectingWebSocket","onclose",g.url),k.dispatchEvent(l("close")));var e=g.reconnectInterval*Math.pow(g.reconnectDecay,g.reconnectAttempts);setTimeout(function(){g.reconnectAttempts++,g.open(!0)},e>g.maxReconnectInterval?g.maxReconnectInterval:e)}},h.onmessage=function(b){(g.debug||a.debugAll)&&console.debug("ReconnectingWebSocket","onmessage",g.url,b.data);var c=l("message");c.data=b.data,k.dispatchEvent(c)},h.onerror=function(b){(g.debug||a.debugAll)&&console.debug("ReconnectingWebSocket","onerror",g.url,b),k.dispatchEvent(l("error"))}},1==this.automaticOpen&&this.open(!1),this.send=function(b){if(h)return(g.debug||a.debugAll)&&console.debug("ReconnectingWebSocket","send",g.url,b),h.send(b);throw"INVALID_STATE_ERR : Pausing to reconnect websocket"},this.close=function(a,b){"undefined"==typeof a&&(a=1e3),i=!0,h&&h.close(a,b)},this.refresh=function(){h&&h.close()}}return a.prototype.onopen=function(){},a.prototype.onclose=function(){},a.prototype.onconnecting=function(){},a.prototype.onmessage=function(){},a.prototype.onerror=function(){},a.debugAll=!1,a.CONNECTING=WebSocket.CONNECTING,a.OPEN=WebSocket.OPEN,a.CLOSING=WebSocket.CLOSING,a.CLOSED=WebSocket.CLOSED,a});

/* Sync Code */

function init_sync() {
	if(util.db['sync_enabled'] == false || typeof util.db['sync_key'] == 'undefined' || location.href.substr(-3) == "ngs") {
		return;
	}

	connectstring = 'wss://skedular.co/sync/?id={id}&key={key}'.format({
		id: util.db['student_id'],
		key: util.db['sync_key']
	});

	if(location.origin.indexOf("localhost") != -1 || location.origin.indexOf("192.168") != -1) {
		/*connectstring = 'ws://localhost:8080/sync/?id={id}&key={key}'.format({
			id: util.db['student_id'],
			key: util.db['sync_key']
		});*/
	}

	conn = new ReconnectingWebSocket(connectstring);

	conn.onopen = function(e) {
	    console.log("[Sync] Connection to Sync Server successful.")
	    util.updateStatus("Connected to Sync.")

	    if(!util.db['last_change']) {
	    	util.db['last_change'] = 0;
	    }

	    conn.send(JSON.stringify({
	    	id: 		util.db['student_id'],
	    	key: 		util.db['sync_key'],
	    	request: 	"last_change",
	    	epoch:   	util.db['last_change']
	    }));
	};

	conn.onmessage = function(msg) {

		var parsed_msg = JSON.parse(msg.data);

		switch(parsed_msg.response) {
			case "last_update":
				check_change(parsed_msg);
				break;
			case "propagate":
				propagate(parsed_msg);
				break;
		}
	}

}

	function check_change(msg) {
		if(msg.data == "null") {
			return update_remote();
		}

		if(msg.last_update > util.db['last_change']) {
			util.db['classes'] = msg.data;
			util.db['last_change'] = msg.last_update;
			init(util.db);
		} else if (msg.last_update < util.db['last_change']) {
			return update_remote();
		}
	}

		function update_remote() {
			conn.send(JSON.stringify({
				id: 		util.db['student_id'],
				key: 		util.db['sync_key'],
				data: 		util.db['classes'],
				request: 	"update",
				epoch:   	util.db['last_change']
			}));
		
			util.updateStatus("Updated remote record.")
		}

	function propagate(msg) {

		if(msg.last_update > util.db['last_change']) {
			util.db['classes'] = msg.data;
		}

		init(util.db);
		util.updateStatus("Changes received and applied.");
	}