function toggleFilter(data, data2) {
	console.log("data", data);
	console.log("data2", data2);
}

function onData(textData) {
	// Parse the results as JSON.
	var data = JSON.parse(textData);
	
	// Loop through the reviewer and create the results.
	var container = $("#book-container");
	
	for (var reviewer of data)
	{
		for (var book of reviewer.books)
		{
			// Figure out slugs and IDs.
			var slug = book.title.toLowerCase().replace(/\s+/g, "-").replace("’", "");
			var status_slug = "status-" + book.status.toLowerCase().replace(/\s+/g, "-").replace("’", "");;
			var gender_slug = "gender-" + book.gender.toLowerCase().replace(/\s+/g, "-").replace("’", "");;
			var race_slug = "race-" + book.race.toLowerCase().replace(/\s+/g, "-").replace("’", "");;
			var nationality_slug = "nationality-" + book.nationality.toLowerCase().replace(/\s+/g, "-").replace("’", "");;
			var group_slug = "group-" + reviewer.group.toLowerCase().replace(/\s+/g, "-").replace(/['’]/, "");;
			
			// Figure out the panel based on the status.
			var panelType = "panel-warning";
			
			switch (book.status)
			{
				case "Finalist": panelType = "panel-success"; break;
				case "Passed": panelType = "panel-default"; break;
				case "Honorable": panelType = "panel-info"; break;
			}
			
			var panel = $(
				"<div class='panel "
				+ panelType + " "
				+ status_slug + " "
				+ gender_slug + " "
				+ race_slug + " "
				+ group_slug + " "
				+ nationality_slug
				+ "'></div>");
			var panelHeading = $(
				"<div class='panel-heading'>"
				+ "<h4 class='panel-title'>"
				+ "<a role='button'><strong>" + book.title + "</strong></a>"
				+ " <small>" + book.author + "</small>"
				+ "</h4>"
				+ "</div>");
			
			panelHeading.appendTo(panel);
			panel.appendTo(container);

			/*
<div class="panel panel-default">
    <div class="panel-heading" role="tab" id="headingOne">
      <h4 class="panel-title">
        <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
          Collapsible Group Item #1
        </a>
      </h4>
    </div>
    <div id="collapseOne" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="headingOne">
      <div class="panel-body">
        Anim pariatur cliche reprehenderit, enim eiusmod high life accusamus terry richardson ad squid. 3 wolf moon officia aute, non cupidatat skateboard dolor brunch. Food truck quinoa nesciunt laborum eiusmod. Brunch 3 wolf moon tempor, sunt aliqua put a bird on it squid single-origin coffee nulla assumenda shoreditch et. Nihil anim keffiyeh helvetica, craft beer labore wes anderson cred nesciunt sapiente ea proident. Ad vegan excepteur butcher vice lomo. Leggings occaecat craft beer farm-to-table, raw denim aesthetic synth nesciunt you probably haven't heard of them accusamus labore sustainable VHS.
      </div>
    </div>
  </div>
  */
		}
	}
}

function showResults() {
	// Hook up the various click events.
	$("div.checkbox input").each(function(index, item) {
		var elem = $(item);
		var classId = item.id.replace("checkbox-", "");

		elem.on('click', function() {
			// Get the toggle state.
			var checked = elem.prop("checked");
			console.log("toggle", classId, checked);
			
			if (checked) {
				$("div." + classId).removeClass(classId + "-hide");
			} else {
				$("div." + classId).addClass(classId + "-hide");
			}
		})
		//console.log(classId, item);
	});

	// Hide the loading box and display the results.
	$("#loading").hide();
	console.log("Done loading.");
}

$(document).ready(function() {
	// Retrieve the results and populate them.
	$.get("spfbo.json", onData)
		.done(showResults);
});
