function init(db) {
	util.sanityCheck();

	util.render(contents());
}

	function contents() {
		return util.html(function() {/*!html
			<div class="row">
				<div class="home_timetable" id="timetable" style="display: {toggle}">
					<div class="{columns1}">
						<h2>{timetable_header} <small> <a style="cursor: pointer;" onclick="timetable.generate_modal()">[>]</a></small></h2>
						<div class="home_timetable_container">
							<div class="filler"></div>

							{timetable}

						</div>
					</div>
				</div>

				<div class="home_events hide_on_mobile" id="homework" style="display: {toggle1}">
					<div class="{columns}">
						<h2>Homework <small><a style="cursor: pointer;" onclick="homework.addHomework()">[+]</a></small></h2>
						<div class="filler"></div>

						<div class="panel panel-default">
			            	<div class="panel-body">
			            		{homework}
			            	</div>
			            </div>
					</div>
				</div>
			</div>
		*/}).format({
			toggle: timetable.toggle(),
			toggle1: timetable.toggle1(),
			timetable_header: timetable.header(),
			timetable: timetable.contents(),
			homework: homework.contents(),
			columns: columns(),
			columns1: columns1()
		})
	}

	var timetable = new Object;

		timetable.generate_modal = function() {
			var modal = util.html(function() {/*!html

				<div class="modal" id="change_day">
				  <div class="modal-dialog">
				    <div class="modal-content">
				      <div class="modal-header">
				        <button type="button" class="close" data-dismiss="modal" aria-hidden="true">×</button>
				        <h4 class="modal-title">Change Day</h4>
				      </div>
				      <div class="modal-body">
				        <select class="selectpicker show-menu-arrow" id="day" title="day">
				        	<option value="1">Monday A</value>
				        	<option value="2">Tuesday A</value>
				        	<option value="3">Wednesday A</value>
				        	<option value="4">Thursday A</value>
				        	<option value="5">Friday A</value>
				        	<option data-divider="true"></option>
				        	<option value="6">Monday B</value>
				        	<option value="7">Tuesday B</value>
				        	<option value="8">Wednesday B</value>
				        	<option value="9">Thursday B</value>
				        	<option value="10">Friday B</value>
				         </select>
				      </div>
				      <div class="modal-footer">
				        <button type="button" id="cancel" class="btn btn-default" data-dismiss="modal" onclick="">Cancel</button>
				        <button type="button" class="btn btn-info" data-dismiss="modal" onclick="timetable.change_day(document.getElementById('day').value)">Submit</button>
				      </div>
				    </div>
				  </div>
				</div>		

			*/});

			util.render_modal(modal, 'change_day');
			$('.selectpicker').selectpicker({
				style: 'btn-info'
			});


		}
			timetable.change_day = function(day) {
				window.location.href = "./#/view/{day}".format({
					day: day
				});
			}

		timetable.toggle = function() {
			if (location.href.substr(-3) == "rk/" || location.href.substr(-3) == "ork") {
				return "none";
			}

			return "block";
		}

		timetable.toggle1 = function() {
			if (location.href.substr(-3) == "rk/" || location.href.substr(-3) == "ork") {
				return "block";
			}
		}

		var columns = function() {
			if(timetable.toggle() == "block") {
				return "col-sm-6";
			}

			return "col-sm-12";
		}

		var columns1 = function() {
			if(timetable.toggle1() == "block") {
				return "col-lg-12 col-sm-12 col-md-12";
			}

			return "col-lg-6 col-sm-6 col-md-6";
		}

		timetable.header = function() {
			if(typeof view_day != "undefined") {
				var x = view_day <= 5 ? "A" : "B";

				return "{day} {week}".format({
					day: time.get_specific_day(view_day),
					week: x
				});
			} else {
				return "{day} {week}".format({
					day: time.get_day(true),
					week: time.get_week(true)
				});
			}
		};

		timetable.contents = function() {
			return timetable.generate_markup();
		}

		timetable.generate_markup = function() {

			var template = util.html(function() {/*!html
					
				<div class="panel panel-default" id="{panelid}">
	            	<div class="panel-body card-color" style="border-left-color: {colour} !important">
	            		<h2 class="class-name">{name}</h2>
	            		<h4 style="margin-bottom: 11.5px !important;">{room} &nbsp;| &nbsp;<i class="fa fa-clock-o">&nbsp;</i>{start} - {end}</h4>
	            	</div>
	            </div>

			*/});

			if(typeof view_day != "undefined") {
				var classes_today = classes.get_day_classes(view_day);
				var times = classes.get_class_times()[view_day];
			} else {
				var classes_today = classes.get_today_classes();
				var times = classes.get_class_times()[time.get_timetable_day()];
			}

			var class_data = classes.get_class_data();
			var final_markup = "";

			for(i = 0; i < classes_today.length; i++) {

				if(classes_today[i]['class_code'] == "Free" && (i == 0 || i == classes_today.length-1)) {
					continue;
				}

				final_markup += template.format({
					panelid: "period" + i,
					colour: util.sanitize(class_data[classes_today[i]['class_code']]['colour']),
					name: util.sanitize(classes_today[i]['class_code']),
					room: util.sanitize(classes_today[i]['room_code']),
					start: util.sanitize(times[i]['starttime']),
					end: util.sanitize(times[i]['endtime'])
				});
			}

			return final_markup;
		}

	var homework = new Object;

		homework.addHomework = function() {

			var modal = util.html(function() {/*!html

				<div class="modal" id="add_homework">
				  <div class="modal-dialog">
				    <div class="modal-content">
				      <div class="modal-header">
				        <button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="homework.removeModal();">×</button>
				        <h4 class="modal-title">Add Homework</h4>
				      </div>
				      <div class="modal-body">
				        <select class="selectpicker show-menu-arrow" id="subject" title="Subject">
				        	{subjects}
				         </select>
				         <hr>
				         <label for="name">Homework Description</label> 
				         <input type="text" id="name" class="form-control" placeholder="Speech on Resource Scarcity"><br>

				         <label for="duedate">Due Date</label> 
				         <input type="date" id="date" class="form-control" placeholder="02/04/2015">
				      </div>
				      <div class="modal-footer">
				        <button type="button" id="cancel" class="btn btn-default" data-dismiss="modal" onclick="homework.removeModal();">Cancel</button>
				        <button type="button" class="btn btn-info" data-dismiss="modal" onclick="homework.addHomeworkHelper.save_homework()">Save</button>
				      </div>
				    </div>
				  </div>
				</div>		

			*/}).format({
				subjects: homework.addHomeworkHelper.subject_markup()
			});

			util.render_modal(modal, 'add_homework');
			$('.selectpicker').selectpicker({
				style: 'btn-info'
			});

		}

		homework.contents = function() {
			if(homework.generate_markup() == "") {
				return "<div class=\"filler\"></div><h3 style=\"margin-top: 10.5px !important\">No outstanding homework.</h3><div class=\"filler\"></div>";
			}

			return homework.generate_markup();
		}

			homework.generate_markup = function() {
				var template = util.html(function() {/*!html

            		<h3 class="card-color" style="border-left-color: {colour} !important"> &nbsp; {subject}</h3>
						<ul style="padding-top: 3px;list-style: square outside none;">
							{list}
						</ul>

				*/});

				var subjects = Object.keys(classes.get_class_data());
				var class_data = classes.get_class_data();
				subjects.sort();
				var final_markup = "";

				for(var i = 0; i < subjects.length; i++) {
					if(subjects[i] == "Free" || subjects[i] == "Roll Call") {
						continue;
					}

					var homework_list = class_data[subjects[i]]['homework'];

					if(homework_list.length == 0) {
						continue;
					}

					final_markup += template.format({
						colour: util.sanitize(class_data[subjects[i]]['colour']),
						subject: util.sanitize(subjects[i]),
						list: homework.generate_homework_list(subjects[i], homework_list)
					});
				}

				return final_markup;
			}

			homework.generate_homework_list = function(subject, homework) {
				var calculate_due = function(time) {

					if(!time) {
						return "";
					}
					
					/* Calculate Unix Epoch of time due */
					var parts = time.split("-");
					var holder = new Date(Date.UTC(parts[0], parts[1] - 1, parts[2]));
					var due = Math.round(holder.getTime() / 1000);
					
					var now = Math.floor((new Date).getTime()/1000);
					var days = Math.round(((due-now)/3600/24));

					if(days > 1) {
						return " — {day} days until due".format({
							day: days
						});
					} else if(days == 1) {
						return " — <strong>due tomorrow</strong>";
					} else if(days == 0) {
						return " — <strong>due today</strong>";
					} else if(days < 0) {
						return " — <strong>overdue</strong>";
					} else {
						return " - <strong>???</strong>";
					}
				}

				var template = util.html(function() {/*!html

					<li id="{subject}_{number}_{name}" onclick="homework.prompt_homework_done(this.id)" style="cursor: pointer"><h4>{name} <small> {days}</small></h4></li>

				*/});

				var final_markup = "";

				homework.sort();

				for(var i = 0; i < homework.length; i++) {
					final_markup += template.format({
						subject:    util.sanitize(subject),
						number: 	i,  
						name: 		util.sanitize(homework[i].name),
						days: 		calculate_due(homework[i].date)
					});
				}

				return final_markup;

			}

			homework.prompt_homework_done = function(id) {
				var id = id.split('_');
				var homework_info = classes.get_class_data()[id[0]]['homework'][id[1]];

				var modal = util.html(function() {/*!html
					<div class="modal" id="prompt">
					  <div class="modal-dialog">
					    <div class="modal-content">

						    <div class="modal-header">
						      <button type="button" class="close" data-dismiss="modal" aria-hidden="true" onclick="homework.removeModal();">×</button>
						      <h4 class="modal-title">Edit</h4>
						    </div>

						    <div class="modal-body">
						       <label for="name">Homework Description</label> 
						       <input type="text" id="name" class="form-control" value="{name}"><br>

						       <label for="duedate">Due Date</label> 
						       <input type="date" id="date" class="form-control" value="{date}">
						    </div>

						    <div class="modal-footer">
						      <button type="button" class="btn btn-danger" data-dismiss="modal" onclick="homework.delete('{id}')">Delete</button>
						      <button type="button" class="btn btn-info" data-dismiss="modal" onclick="homework.save('{id}', document.getElementById('name').value, document.getElementById('date').value)">Save</button>
						    </div>

					    </div>
					  </div>
					</div>		
				*/}).format({
					name: homework_info['name'],
					date: homework_info['date'],
					id:   btoa("{subject}--{id}".format({
						subject: id[0],
						id: 	 id[1]
					}))
				});

				util.render_modal(modal, 'prompt');
			}

				homework.delete = function(id) {
					var data = atob(id).split("--");

					var homework = classes.get_class_data()[data[0]]['homework'];

					homework.splice(data[1], 1);

					var class_data = classes.get_class_data();
					class_data[data[0]]['homework'] = homework;

					classes.set_class_data(class_data);

					util.setLastChange();

					util.syncIfEnabled();

					util.render(contents());

					return true;
				}

				homework.save = function(id, name, date) {
					var data = atob(id).split("--");

					var class_data = classes.get_class_data();

					class_data[data[0]]['homework'][data[1]]['name'] = name;
					class_data[data[0]]['homework'][data[1]]['date'] = date;

					classes.set_class_data(class_data);

					util.setLastChange();

					util.syncIfEnabled();

					util.render(contents());

					return true;
				}

		homework.addHomeworkHelper = new Object;

			homework.addHomeworkHelper.subject_markup = function() {

				var subjects = Object.keys(classes.get_class_data()).sort();
				var template = "<option>{subject}</option>";
				var final_markup = ""

				for(i = 0; i < subjects.length; i++) {
					if(subjects[i] == "Free" || subjects[i] == "Roll Call") {
						continue;
					}

					final_markup += template.format({
						subject: util.sanitize(subjects[i])
					});
				};

				return final_markup;
			}

			homework.addHomeworkHelper.save_homework = function() {
				var data = new Object;
				var subject = document.getElementById("subject").value;
				var class_data = classes.get_class_data();

				data.name = util.sanitize(document.getElementById("name").value);
				data.date = util.sanitize(document.getElementById("date").value);

				class_data[subject]['homework'].push(data);

				classes.set_class_data(class_data);

				homework.removeModal();

				util.setLastChange();

				util.syncIfEnabled();

				util.render(contents());

				return true;
			}

		homework.removeModal = function() {
			document.getElementById("modals").innerHTML = "";
		}