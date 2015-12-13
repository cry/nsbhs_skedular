/* Universal Function Definitions */

if (!String.prototype.format) {
	String.prototype.format = function() {
		var str = this.toString();
		if (!arguments.length)
			return str;
		var args = typeof arguments[0],
			args = (("string" == args || "number" == args) ? arguments : arguments[0]);
		for (arg in args)
			str = str.replace(RegExp("\\{" + arg + "\\}", "gi"), args[arg]);
		return str;
	}
}

String.prototype.hashCode = function() {
  var hash = 0, i, chr, len;
  if (this.length == 0) return hash;
  for (i = 0, len = this.length; i < len; i++) {
    chr   = this.charCodeAt(i);
    hash  = ((hash << 5) - hash) + chr;
    hash |= 0; // Convert to 32bit integer
  }
  return hash;
};

var util = new Object;

if(!util.db) {
	util.db = window.localStorage;
}

if(!util.html) {
	util.html = function(f) {
	  return f.toString().
	      replace(/^[^\/]+\/\*!html?/, '').
	      replace(/\*\/[^\/]+$/, '');
	}
}

if(!util.render) {
	util.render = function(html) {
		if(document.getElementById("timetable") && document.getElementById("timetable").display == "none") {
			document.getElementById("main").innerHTML = html;
			document.getElementById("timetable").displahy = "none"
		} else {
			document.getElementById("main").innerHTML = html;
		}
	}
}

if(!util.render_modal) {
	util.render_modal = function(html, id) {
		if($('#' + id).hasClass('in')) {
			return;
		}

		document.getElementById("modals").innerHTML = html;
		$('#' + id).modal('toggle');
	}
}

if(!util.download) {
	util.download = function(url, callback) {
		try {
			$.ajax({
				method: "GET",
				url: url,
				success: function(data) {
					callback(data);
				},	
				error: function() {
					throw "e";
				}
			});
		} catch (e) {
			return false;
		}
	}
}

if(!util.sanityCheck) {
	util.sanityCheck = function() {

		function redirect() {
			window.location.replace('./#/');
			window.location.reload();
		}

		typeof util.db['first_run'] == 'undefined' ? redirect() : 0;
	}
}

if(!util.sanitize) {
	util.sanitize = function(html) {
		/* Sanitizing Functions */
		var tagBody = '(?:[^"\'>]|"[^"]*"|\'[^\']*\')*';

		var tagOrComment = new RegExp(
		    '<(?:'
		    // Comment body.
		    + '!--(?:(?:-*[^->])*--+|-?)'
		    // Special "raw text" elements whose content should be elided.
		    + '|script\\b' + tagBody + '>[\\s\\S]*?</script\\s*'
		    + '|style\\b' + tagBody + '>[\\s\\S]*?</style\\s*'
		    // Regular name
		    + '|/?[a-z]'
		    + tagBody
		    + ')>',
		    'gi');

		var oldHtml;
		do {
		oldHtml = html;
		html = html.replace(tagOrComment, '');
		} while (html !== oldHtml);
		return html.replace(/</g, '&lt;');
	}
}

if(!util.setLastChange) {
	util.setLastChange = function() {
		util.db['last_change'] = Math.floor((new Date).getTime()/1000);
	}
}

if(!util.syncIfEnabled) {
	util.syncIfEnabled = function() {
		if(util.db['sync_enabled']) {
			try {
				update_remote();
			} catch(err) {
				util.updateStatus("Couldn't sync. Will retry later.");
			}
		}
	}
}

if(!util.updateStatus) {
	util.updateStatus = function(msg) {
		var d = new Date();
		document.getElementById("status").innerHTML = "{time} — {msg}".format({
			time: d.toLocaleTimeString(),
			msg: msg
		});
	}
}

/* Debug Setting */

var debug = function() {

	if(location.origin.indexOf("localhost") > -1 || location.origin.indexOf("192.168") > -1) {
		return false;
	}

	return false;
};

if(debug()) {
	$('body').append('<div id="footer" style="color: red !important;"><strong>Debug</strong></div>');
	console.info("Skedular is running in debug mode.");
} 

/* lol ie */

var isIE = function(userAgent) {
  userAgent = userAgent || navigator.userAgent;
  return userAgent.indexOf("MSIE ") > -1 || userAgent.indexOf("Trident/") > -1;
}

if(isIE()) {
	$('body').append('<div id="footerleft" style="color: red !important; text-align: center !important"><h1><strong>Internet Explorer is not supported.</strong></h1></div>');
	console.info("Internet Explorer is not supported.");
} 

/* Day Logic Functions */


var time = new Object;

time.get_week = function(format) {
	var week_number =  function(){ //from http://stackoverflow.com/questions/6117814/get-week-of-year-in-javascript-like-in-php
	    var d = new Date();
	    d.setHours(0,0,0);
	    d.setDate(d.getDate()+4-(d.getDay()||7));
	    return Math.ceil((((d-new Date(d.getFullYear(),0,1))/8.64e7)+1)/7);
	};

	if(debug()) {
		if(format) {
			return "B";
		} else {
			return 0;
		}
	}

	if(format) {
		return week_number()%2 ? 'A' : 'B';	
	}

	return week_number();
	
}

time.get_day = function(format) {

	var pretty_days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
	var d = new Date();

	if(debug()) {
		if(format) {
			return "Friday";
		} else {
			return 10;
		}
	}

	if(format) {
		return pretty_days[d.getDay()];
	}

	return d.getDay();

}

time.get_specific_day = function(day) {
	day > 5 ? day = day - 5 : 0;
	var pretty_days = ["", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

	return pretty_days[day];
}

time.get_timetable_day = function() {

	if(debug()) {
		return 10;
	}

	var day = time.get_day();
	var week = time.get_week(true);

	if(week == "A") {
		switch(day) {
			case 0:
				return null;
			case 1:
				return 1;
			case 2:
				return 2;
			case 3:
				return 3;
			case 4:
				return 4;
			case 5:
				return 5;
			case 6:
				return null;
		}
	} else {
		switch(day) {
			case 0:
				return null;
			case 1:
				return 6;
			case 2:
				return 7;
			case 3:
				return 8;
			case 4:
				return 9;
			case 5:
				return 10;
			case 6:
				return null;
		}
	}

}

/* Class Gathering Functions */

var classes = new Object;

classes.get_today_classes = function() {

	var class_list = JSON.parse(util.db['classes']);
	var classes = JSON.parse(util.db['timetable']);

	if(time.get_timetable_day() == null) {
		return false;
	}

	var today_classes = classes[time.get_timetable_day()];

	return today_classes;
}

classes.get_day_classes = function(day) {

	var class_list = JSON.parse(util.db['classes']);
	var classes = JSON.parse(util.db['timetable']);

	var today_classes = classes[day];

	return today_classes;
}

classes.get_class_data = function() {
	return JSON.parse(util.db['classes']);
}

classes.get_class_times = function(day) {
	return JSON.parse(util.db['times']);
}

classes.set_class_data = function(data) {
	util.db['classes'] =  JSON.stringify(data);

	return true;
}

classes.get_period_classes = function(week, period) {
	var data = JSON.parse(util.db['timetable']);
	var class_data = classes.get_class_data();
	var final_data = [];

	if(week == "A" || week == "a") {
		days = [1,2,3,4,5];
	} else {
		days = [6,7,8,9,10];
	}

	for(i = 0; i < days.length; i++) {
		try {
			var class_name = data[days[i]][period]['class_code'];
			var room_code = data[days[i]][period]['room_code'];
			var teacher_id = data[days[i]][period]['teacher_id'];
			var colour = class_data[class_name]['colour'];
			var short_name = class_data[class_name]['short_name'];
		} catch (e) {
			var class_name = "";
			var room_code = "";
			var teacher_id = "";
			var colour = "";
			var short_name = "";
		}

		if(period == 0 && class_name == "Free") {
			final_data.push(["", "", "", ""]);
		} else {
			final_data.push([class_name, room_code, teacher_id, colour, short_name]);
		}
	}

	return final_data;


}

/* hex2rgb */

var validateColours = function() {

	if(util.db['first_run'] != "false") {
		return;
	} 

	function hex2rgb(hex) {
	    var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	    return result ? "rgb({r}, {g}, {b})".format({
	        r: parseInt(result[1], 16),
	        g: parseInt(result[2], 16),
	        b: parseInt(result[3], 16)
	    }) : null;
	}

	var class_data = classes.get_class_data();
	var class_keys = Object.keys(class_data);

	class_keys.sort();

	for(i = 0; i < class_keys.length; i++) {

		if(class_data[class_keys[i]].colour.indexOf('#') > -1) {
			class_data[class_keys[i]].colour = hex2rgb(class_data[class_keys[i]].colour);
		}

	}

	//console.log(class_data);
	classes.set_class_data(class_data);
}

validateColours();

/* short names */

var short_names = function() {

	if(util.db['first_run'] != "false") {
		return;
	} 

	var list = JSON.parse('{"Ancient History":"AHI","Biology":"BIO","Business Studies":"BST","Careers":"CAR","Chemistry":"CHE","Commerce":"COM","Design Tech":"DAT","Economics":"ECO","Elective History":"HEX","English":"EN","English Ext 2":"ENX","Engineering":"EST","French":"FRE","French Ext":"FRX","Food Tech":"FTE","Geography":"GEO","German":"GER","German Ext":"GEX","Graphics Tech":"GTE","History":"HIS","Indonesian":"IND","Indonesian Ext":"INX","IPT":"IPT","Japanese":"JAP","Japanese Ext":"JAX","Latin":"LAT","Latin Ext":"LAX","Library":"LIB","Legal Studies":"LST","Mathematics":"MM","Modern History":"MHI","Music":"MU","Music Ext":"MUX","PASS":"PAS","Power Systems":"PSY","PDHPE":"PDH","Physics":"PHY","Roll Call":"RC","Science":"SCI","Software Design":"SDD","Visual Arts":"VAR"}');

	var class_data = classes.get_class_data();
	var class_keys = Object.keys(class_data);
	class_keys.sort();

	for(i = 0; i < class_keys.length; i++) {

		if(!class_data[class_keys[i]].short_name) {
			class_data[class_keys[i]].short_name = list[class_data[class_keys[i]].class_code];
		}

	}

	classes.set_class_data(class_data);
}

short_names();

/* update if available */

var update_tt = function() {
	
	if(util.db['first_run'] != "false") {
		return;
	} 

	var lastupdate = 0;

	$.get("./data/lastupdate", function(data) {
		lastupdate = data;

		console.log("Server timetable version: {lastupdate}".format({
			lastupdate: lastupdate
		}));

		console.log("Current version: {current}".format({
			current: util.db['ttversion']
		}));
		
		if(typeof util.db['ttversion'] == 'undefined' || lastupdate > util.db['ttversion']) {

			console.log('Updating..');

			util.download("./data/index.php?endpoint=timetable&id={id}".format({
				id: util.db['student_id']
			}), function(data) {
				util.db['timetable'] = JSON.stringify(data);
				util.db['ttversion'] = lastupdate;


				util.download("./data/index.php?endpoint=classes&id={id}".format({
					id: util.db['student_id']
				}), function(data) {
					var class_data = classes.get_class_data();

					Object.keys(data).forEach(function(key) {
						if(typeof class_data[key] == 'undefined') {
							class_data[key] = data[key];
						}
					});

					Object.keys(class_data).forEach(function(key) {
						if(typeof data[key] == 'undefined') {
							delete class_data[key];
						}
					})

					classes.set_class_data(class_data);

					init(util.db);
				});
			});
			
		}
	});

}

update_tt();

/* User Logging */

var log_user = function() {
	if(!util.db['student_id'] || util.db['user_logged']) {
		return;
	}

	util.download("./user_logging/index.php?id={id}".format({
		id: util.db['student_id']
	}), function() {
		util.db['user_logged'] = true;
	});

}

log_user();

/* Routing Functions */

function route_go(route) {
	$.ajaxSetup({
	    cache: true
	 });
	
	$.getScript("./skedular/scripts/{file}.js".format({
		file: route
	}))
		.done(function() {
			/*console.log("Retrieved {file}.js".format({
				file: route
			}));*/
			init(util.db);
		})
		.fail(function(jqxhr, settings, exception) {
			document.getElementById("main").innerHTML = "<pre>Skedular failed to start.\n\nError: {error}</pre>".format({
				error: exception
			});
		})
}

/* Init Sync */

if(util.db['sync_enabled'] == 'true') {
	$.getScript("./skedular/scripts/sync.js").done(function() {
		init_sync();
	});
}

var redacted = function() { route_go('redacted') },
	home = function() {	route_go('home') },
	settings = function() { route_go('settings') },
	FAQ = function() { route_go('FAQ') },
	view = function(day) {	route_go('home'); view_day = day },
	twoweek = function() { route_go('twoweek') };

var routes = {
	'/': redacted,
	'/home': home,
	'/settings': settings,
	'/FAQ': FAQ,
	'/homework': home,
	'/view/:day': view,
	'/twoweek': twoweek
};

var router = Router(routes);

router.notfound = function() {
	window.location.replace('./404.html');
}

router.init();

