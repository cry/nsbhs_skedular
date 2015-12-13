function init(db) {
	if(first_run()) {

		$.getScript("./assets/handlebars/main.js").done(function() {
			util.render(welcome());

			disableMenu();

			document.getElementById("contents").style.paddingLeft = "0px";
			document.getElementById("contents").style.paddingRight = "0px";

			document.getElementById("main").style.paddingLeft = "0px";
			document.getElementById("main").style.paddingRight = "0px";

			initTypeahead();

			$('#pwd').keyup(function (e) {
				if (e.keyCode === 13) {
			    	submit(document.getElementById('id_input').value);
				}
			});

		});

	} else {
		redirect();
	}
}

	function first_run() {
		if(typeof util.db['first_run'] == 'undefined') {
			return true;
		}

		return false;
	}

	function disableMenu() {
		document.body.removeChild(document.getElementById("meny"));
		document.body.removeChild(document.getElementById("meny-arrow"));

		meny.destroy();
	}

	function welcome() {

		var contents = util.html(function() {/*!html

			<div class="welcome center">
				<h2>Welcome to Skedular!</h2><br>
				<div class="row">
					<div class="col-sm-6 col-sm-push-3">
						<input type="text" id="id_input" class="form-control" placeholder="Student ID" />
					</div>
				</div>
				<div style="height: 5px"></div>
				<div class="row">
					<div class="col-sm-6 col-sm-push-3">
						<span class="twitter-typeahead" style="position: relative; display: inline-block; direction: ltr;">
							<input type="password" id="pwd" class="form-control tt-input" placeholder="Access Code" />
						</span>
					</div>
				</div>
				<br>
				<button class="btn btn-info" value="Submit" onClick="submit(document.getElementById('id_input').value)">Submit</button>
			</div>

		*/})

		return contents;
	}

		function initTypeahead() {
			var names = new Bloodhound({
			  datumTokenizer: Bloodhound.tokenizers.obj.whitespace('id', 'year'),
			  queryTokenizer: Bloodhound.tokenizers.whitespace,
			  limit: 30,
			  prefetch: {
			  	cache: false,
			    url: 'names.json'
			  }
			});

			names.initialize();
			names.clearRemoteCache();

			var suggestion = util.html(function(){/*!html

				<table><tr><td style="width: 30px; color: #aaa !important; text-align: center">{{year}} </td><td>{{id}}</td></tr></table>

			*/});
			 
			$('#id_input').typeahead(null, {
			  name: 'name-list',
			  displayKey: 'id',
			  valueKey: 'name',
			  source: names.ttAdapter(),
			  templates: {
			  	empty: util.html(function(){/*!html
					<div class="">
						<span style="padding-left: 15px">No students match, try again.</span>
					</div>
			  	*/}),
			  	suggestion: Handlebars.compile(suggestion)
			  }
			});
		}

		function submit(id) {

			var pwd = document.getElementById("pwd").value;

			var error = function (message) {
				var template = util.html(function(){/*!html

					<div class="modal" id="error">
					  <div class="modal-dialog">
					    <div class="modal-content">
					      <div class="modal-header">
					        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
					        <h4 class="modal-title">Error!</h4>
					      </div>
					      <div class="modal-body">
					        <strong>{message}</strong>
					      </div>
					      <div class="modal-footer">
					        <button type="button" class="btn btn-info" data-dismiss="modal">Close</button>
					      </div>
					    </div>
					  </div>
					</div>					

				*/}).format({
					message: message
				});

				return template;
			}

			if(!pwd || pwd != "falcon") {
				util.render_modal(error("Incorrect access code. Check your email for it."), "error");
				return false;
			}
			

			var trimmed_id = id.substr(0,9);


			if(isNaN(parseFloat(trimmed_id)) || !isFinite(trimmed_id)) {
				util.render_modal(error("Student ID is not in the correct format!"), "error");
				return;
			}

			var result = util.download("./data/index.php?endpoint=classes&id={id}".format({
				id: id
			}), function(data) {
				util.db['classes'] = JSON.stringify(data);
				util.db['student_id'] = document.getElementById("id_input").value;
			});

			if(typeof result != 'undefined') {
				util.render_modal(error("That Student ID doesn't not exist in our database <br /> <br /> If you are sure that your ID is correct, perhaps our server is experiencing issues. Please try again later."), "error");
				return;
			} else {
				util.download("./data/index.php?endpoint=timetable&id={id}".format({
					id: id
				}), function(data) {
					util.db['timetable'] = JSON.stringify(data);
				});

				util.download("./data/index.php?endpoint=times&id={id}".format({
					id: id
				}), function(data) {
					util.db['times'] = JSON.stringify(data);
				});
			}

			util.render_modal(util.html(function() {
				/*!html

				<div class="modal" id="loading">
				  <div class="modal-dialog">
				    <div class="modal-content">
				      <div class="modal-body" style="text-align: center">
				        <h2>Loading<span class="ellipsis">...</span></h2>
				      </div>
				    </div>
				  </div>
				</div>			

			*/}), 'loading');

			window.setTimeout(function() {

				util.db['first_run'] = false;

				redirect();
			}, 4000);
		}


	function redirect() {
		window.location.replace('./#/home');
		window.location.reload();
	}