function init(db) {
	util.render(table.format({
		a0: twoweek.getMarkup('a', '0'),
		a1: twoweek.getMarkup('a', '1'),
		a2: twoweek.getMarkup('a', '2'),
		a3: twoweek.getMarkup('a', '3'),
		a4: twoweek.getMarkup('a', '4'),
		a5: twoweek.getMarkup('a', '5'),
		a6: twoweek.getMarkup('a', '6'),
		a7: twoweek.getMarkup('a', '7'),
		a8: twoweek.getMarkup('a', '8'),
		b0: twoweek.getMarkup('b', '0'),
		b1: twoweek.getMarkup('b', '1'),
		b2: twoweek.getMarkup('b', '2'),
		b3: twoweek.getMarkup('b', '3'),
		b4: twoweek.getMarkup('b', '4'),
		b5: twoweek.getMarkup('b', '5'),
		b6: twoweek.getMarkup('b', '6'),
		b7: twoweek.getMarkup('b', '7'),
		b8: twoweek.getMarkup('b', '8')
	}))
}

	var table = util.html(function() {/*!html

		<h2>2 Week Timetable</h2>

		<div class="filler"></div>

		<div class="row">
			<div class="col-sm-12 col-md-12 col-lg-12">
				<table class="table table-condensed table-hover">
				    <thead>
				        <tr>
				            <th></th>
				            <th>MonA</th>
				            <th>TueA</th>
				            <th>WedA</th>
				            <th>ThuA</th>
				            <th>FriA</th>
				        </tr>
				    </thead>
				    <tbody>
				    	<col span="1" class="wide">
				        <tr>
				            <td>0</td>
				            {a0}
				        </tr>
				        <tr>
				            <td>RC</td>
				            {a1}
				        </tr>
				        <tr>
				            <td>1</td>
				            {a2}
				        </tr>
				        <tr>
				            <td>2</td>
				           	{a3}
				        </tr>
				        <tr>
				            <td>3</td>
				            {a4}
				        </tr>
				        <tr>
				            <td>4</td>
				            {a5}
				        </tr>
				        <tr>
				            <td>5</td>
				            {a6}
				        </tr>
				        <tr>
				            <td>6</td>
				            {a7}
				        </tr>
				        <tr>
				            <td>AS</td>
				            {a8}
				        </tr>
				    </tbody>
				</table>
			</div>
		</div>

		<div class="row">
			<div class="col-sm-12 col-md-12 col-lg-12">
				<table class="table table-condensed table-hover">
				    <thead>
				        <tr>
				            <th></th>
				            <th>MonB</th>
				            <th>TueB</th>
				            <th>WedB</th>
				            <th>ThuB</th>
				            <th>FriB</th>
				        </tr>
				    </thead>
				    <tbody>
				    	<col span="1" class="wide">
				        <tr>
				            <td>0</td>
				            {b0}
				        </tr>
				        <tr>
				            <td>RC</td>
				            {b1}
				        </tr>
				        <tr>
				            <td>1</td>
				            {b2}
				        </tr>
				        <tr>
				            <td>2</td>
				           	{b3}
				        </tr>
				        <tr>
				            <td>3</td>
				            {b4}
				        </tr>
				        <tr>
				            <td>4</td>
				            {b5}
				        </tr>
				        <tr>
				            <td>5</td>
				            {b6}
				        </tr>
				        <tr>
				            <td>6</td>
				            {b7}
				        </tr>
				        <tr>
				            <td>AS</td>
				            {b8}
				        </tr>
				    </tbody>
				</table>
			</div>
		</div>

	*/});

	var twoweek = new Object;

	twoweek.getMarkup = function(week, period) {
		if(week == "A") {
			days = [1,2,3,4,5];
		} else {
			days = [6,7,8,9,10];
		}

		var return_markup = "";
		var template = util.html(function() {/*!html

				<td class="hide_on_mobile" style="padding: 2px !important; padding-left:10px !important; background-color: {colour};{border};"><h5 style="{text}">{class_name} <br><small style="{text}">{teacher} {delimiter} {room}</small></h5></td>

				<td class="hide_on_desktop" style="padding: 2px !important; background-color: {colour};{border}; text-align: center"><h5 style="{text}">{short_class_name}<br><small style="{text}">{teacher}<br>{room}</small></h5></td>

		*/});

		var data = classes.get_period_classes(week, period);

		for(x = 0; x < data.length; x++) {
			if((data[x][0] == "Free" || data[x][0] == "") && ("05678".indexOf(period) > -1)) {
				var delimiter = "";
			} else {
				var delimiter = "—";
			}

			colour = data[x][3].split(",");

			if(("05678".indexOf(period) > -1) && (data[x][0] == "Free" || !data[x][0])) {
				return_markup += template.format({
					colour: 		"",
					class_name: 	"",
					short_class_name: "",
					teacher: 		"",
					room: 			"",
					delimiter: 		delimiter,
					border: 		"border-bottom: 0px solid #ffffff;"
				});
			} else if (data[x][0] == "Free") {
				return_markup += template.format({
					colour: 		"",
					class_name: 	"",
					short_class_name: "",
					teacher: 		"",
					room: 			"",
					delimiter: 		"",
					border: 		"border-top: 1px solid #ffffff !important;",
					text: 			"color: rgb({r}, {g}, {b})".format({
						r: Math.round(colour[0].substr(4)*0.35),
						g: Math.round(colour[1]*0.35),
						b: Math.round(colour[2].slice(0,-1)*0.35)
					})
				});
			} else  {
				return_markup += template.format({
					colour: 		data[x][3],
					class_name: 	data[x][0],
					short_class_name: data[x][4],
					teacher: 		data[x][2],
					room: 			data[x][1],
					delimiter: 		delimiter,
					border: 		"border-top: 1px solid #ffffff !important; border-right: 1px solid #ffffff !important",
					text: 			"color: rgb({r}, {g}, {b})".format({
						r: Math.round(colour[0].substr(4)*0.35),
						g: Math.round(colour[1]*0.35),
						b: Math.round(colour[2].slice(0,-1)*0.35)
					})
				});
			}

			
		}

		return return_markup;
	}