function init(db) {
	util.render(contents());

	$('#sync_enable').bootstrapToggle();

	$('#sync_enable').change(function() {
	  sync_details.toggleSync($(this).prop('checked'));
	});

	$("head").append("<link rel=\"stylesheet\" type=\"text/css\" href=\"{link}\">".format({
		link: "assets/purtypicker/main.css"
	}));

	$.getScript("assets/purtypicker/main.js").done(function() {

	});
}

	function contents() {
		return util.html(function() {/*!html
			<h1>Settings</h1>
			<div class="filler"></div>

			<div class="row">

				<div class="col-sm-12">
					
					<div class="panel panel-info">
					  <div class="panel-heading">
					    <h3 class="panel-title">General Options</h3>
					  </div>
					  <div class="panel-body" style="margin: 15px">
						
						

					  </div>
					</div>

				</div>
			</div>

			<div class="filler"></div>

			<div class="row">
				<div class="col-sm-12">
					
					<div class="panel panel-info">
					  <div class="panel-heading">
					    <h3 class="panel-title">Sync</h3>
					  </div>
					  <div class="panel-body" style="margin: 15px">
					    <blockquote><p style="font-size: 16px">Skedular Sync allows you to access your data on all of your web-capable devices with a sync passphrase. <br> Viewing your data on another device requires the same student ID and passphrase, so other students using the same passphrase can't see your data.<br> <strong>Beware: Sync is in beta. Data loss may occur. <br> Sync is off by default.</strong></p></blockquote>
						<div class="filler"></div>

						<div class="row">
							<div class="col-sm-8">
								<label for="sync_enable">Sync Status</label>
							</div>
							<div class="col-sm-4">
								<input type="checkbox" class="form-control" id="sync_enable"  data-toggle="toggle" {sync_state} {sync_status} />
							</div>
						</div>

						<div class="filler"></div>

						<div class="row">
							<div class="col-sm-8">
								<label for="sync_Key">Sync Password</label>
							</div>
							<div class="col-sm-4">
								<div class="input-group">
									<input type="text" class="form-control" id="sync_key" placeholder="A Large Elephant" value="{sync_key}" />
									<span class="input-group-btn">
										<input type="button" class="btn btn-default" id="sync_key" value="Save" onclick="sync_details.setSyncKey(document.getElementById('sync_key').value)" />
									</span>
								</div>
							</div>
						</div>

						<div class="filler"></div>

						<div class="row">
							<div class="col-sm-12">
								<div class="filler"></div>
								<p class="text-muted">Last Sync: <em>{lastsync}</em></p>
							</div>
						</div>
						
					  </div>
					</div>

				</div>

			</div>

			<div class="filler"></div>

			<div class="row">

				<div class="col-sm-12">
					
					<div class="panel panel-info">
					  <div class="panel-heading">
					    <h3 class="panel-title">Class Colours</h3>
					  </div>
					  <div class="panel-body" style="margin: 15px">
						
						{colour_config}

						<div class="filler"></div>

						<button class="btn btn-info" style="width: 100%" onclick="save_colours()">Save</button>

					  </div>
					</div>

				</div>
			</div>

			<div class="filler"></div>

			<div class="row">

				<div class="col-sm-12">
					
					<div class="panel panel-info">
					  <div class="panel-heading">
					    <h3 class="panel-title">Export/Backup Data</h3>
					  </div>
					  <div class="panel-body" style="margin: 15px">

					  	<h3>Export</h3>
						
						<div class="row">
							<div class="col-sm-9">
								<input type="text" class="form-control" id="export_data" disabled>
							</div>

							<div class="col-sm-3">
								<button class="btn btn-info form-control" style="width: 100%" onclick="export_data()">Export</button>
							</div>
						</div>

						<div class="filler"></div>

						<h3>Import</h3>

						<div class="row">
							<div class="col-sm-9">
								<input type="text" class="form-control" id="export_data" disabled>
							</div>

							<div class="col-sm-3">
								<button class="btn btn-info form-control" style="width: 100%" onclick="" disabled>Import</button>
							</div>
						</div>

					  </div>
					</div>

				</div>
			</div>

			<div class="filler"></div>

			<div class="row">

				<div class="col-sm-12">
					
					<div class="panel panel-info">
					  <div class="panel-heading">
					    <h3 class="panel-title">General Info</h3>
					  </div>
					  <div class="panel-body" style="margin: 15px">

					  	<h5>You are currently using Skedular v{revision}. Timetable data was last updated at <em>{lastupdate}</em></h5><br>
						
						<h5>Debug mode: {debug}</h5>
						<h5>Student ID: {id}</h5>
					  </div>
					</div>

				</div>
			</div>

		</div>

		*/}).format({
			lastsync: 		sync_details.getLastSync(),
			sync_key: 		sync_details.getSyncKey(),
			sync_state: 	sync_details.getSyncState(),
			sync_status: 	sync_details.getSyncStatus(),
			colour_config:  colour_markup(),
			lastupdate: 	lastupdate(),
			revision: 		1.2,
			debug: 			(debug() ? "Enabled" : "Disabled"),
			id: 			util.sanitize(util.db['student_id'])
		});
	}
		var lastupdate = function() {
			if(!util.db['ttversion']) {
				return "???";
			}

			var d = new Date(0);
			d.setUTCSeconds(util.db['ttversion']);

			return d;
		}

		var export_data = function() {
			var raw = util.db;
			var raw_keys = Object.keys(util.db);

			for(i = 0; i < raw_keys.length; i++) {
				if(raw_keys[i].substr(0, 2) == "__") {
					delete raw[raw_keys[i]];
				}
			}

			document.getElementById('export_data').value = btoa(JSON.stringify(raw));
		}

		var colour_markup = function() {
			var template = util.html(function() {/*!html

				<div class="row">
					<h3 onclick="toggle('{class_name}')" style="cursor: pointer;">&nbsp; <i class="fa fa-caret-down"></i> &nbsp; {class_name} </h3>

					<fieldset class="color-picker" style="display: none" id="{class_name}">
						<select class="format" style="display: none">
							<option>Hex</option>
							<option selected>RGB</option>
							<option>HSL</option>
						</select>
						<input class="color" type="text" id="{class_input}" value="{colour}" />
						<div class="spectrum">
							<div>
								<div class="pin"></div>
							</div>
						</div>
						<input class="luminosity" type="range" min="0" max="100" />
					</fieldset>
				</div>

			*/});

			var class_data = classes.get_class_data();
			var class_keys = Object.keys(class_data);

			class_keys.sort();

			var final_markup = "";

			for(i = 0; i < class_keys.length; i++) {

				var data = class_data[class_keys[i]];

				final_markup += template.format({
					class_name: util.sanitize(data.class_code),
					colour: util.sanitize(data.colour),
					class_input: btoa(data.class_code + "_colour")
				})

			}

			return final_markup;
		}

		var save_colours = function() {

			var class_data = classes.get_class_data();
			var class_keys = Object.keys(class_data);

			class_keys.sort();

			for(i = 0; i < class_keys.length; i++) {

				var data = class_data[class_keys[i]];

				var new_colour = document.getElementById("{id}".format({
					id: btoa(data.class_code + "_colour")
				})).value;

				class_data[class_keys[i]].colour = new_colour;

			}

			classes.set_class_data(class_data);

			util.setLastChange();

			util.syncIfEnabled();

		}

		function toggle(id) {
			$("[id='" + id + "']").toggle();
		}

		var sync_details = new Object;

			sync_details.getLastSync = function() {
				if(!util.db['last_change']) {
					return "Never";
				}

				var d = new Date(0);
				d.setUTCSeconds(util.db['last_change']);

				return d;
			}

			sync_details.getSyncKey = function() {
				if(!util.db['sync_key']) {
					return "";
				}

				return util.db['sync_key'];
			}

			sync_details.getSyncState = function() {
				if(!util.db['sync_key']) {
					return "disabled";
				}

				return "";
			}

			sync_details.getSyncStatus = function() {
				if(util.db['sync_enabled'] == "false" || typeof util.db['sync_enabled'] == "undefined") {
					return "";
				}

				return "checked";
			}

			sync_details.setSyncKey = function(value) {
				if(value) {
					util.db['sync_key'] = value;
				} else {
					return false;
				}

				util.render(contents());
				$('#sync_enable').bootstrapToggle('enable');

				location.reload();
			}

			sync_details.toggleSync = function(state) {
				util.db['sync_enabled'] = state;

				if(state == true) {
					window.location.replace('./#/home');
					window.location.reload();
				}
			}