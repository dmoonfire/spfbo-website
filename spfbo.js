function appendKeyValue(label, value, parent) {
	if (value)
	{
		$("<div class='row'><div class='col-md-2 metadata-key'>" + label + ":</div><div class='col-md-10 metadata-value'>" + value + "</div></div>")
			.appendTo(parent);
	}
}

function appendKeyUrls(label, urls, parent) {
	// If we don't have urls, then skip it.
	if (!urls)
	{
		return;
	}
	
	// Create the elements we'll append to.
	var row = $("<div class='row'></div>");
	var key = $("<div class='col-md-2 metadata-key'>" + label + "</div>");
	var values = $("<div class='col-md-10 metadata-value'></div>");
	
	row.append(key);
	row.append(values);
	parent.append(row);

	// Go through each URL and add the entry.
	for (url of urls)
	{
		// Figure out the actual url.
		var u = url.url;
		var t = u;
		
		if (url.title)
		{
			t = url.title;
		}
		
		switch (url.type)
		{
			case "twitter":
				u = "https://twitter.com/" + url.id;
				t = "Twitter";
				break;
				
			case "amazon":
				var a = "<a href='https://www.amazon.com/dp/" + url.asin + "'>Amazon US</a>";
				a += " <a href='https://www.amazon.co.uk/dp/" + url.asin + "'>UK</a>";
				a += "<br/>"
				values.append(a);
				continue;
				
			case "smashwords":
				u = "https://www.smashwords.com/books/view/" + url.id;
				t = "Smashwords";
				break;
				
			case "goodreads":
				u = "https://www.goodreads.com/book/show/" + url.id;
				t = "Goodreads";
				break;
			
			case "facebook":
				u = "https://facebook.com/" + url.id;
				t = "Facebook";
				break;
			
			case "google+":
				u = "https://plus.google.com/b/" + url.id + "/";
				t = "Google+";
				break;
			
			case "ello":
				u = "https://ello.co/" + url.id;
				t = "Ello";
				break;
			
			case "reddit":
				u = "https://www.reddit.com/u/" + url.id;
				t = "Reddit";
				break;
		}
		
		// Add in the entry.
		values.append("<a href='" + u + "'>" + t + "</a><br/>");
	}
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
			
			//if (status_slug === "status-passed") { status_slug += " status-passed-hide"; }
			//if (gender_slug === "gender-unknown") { status_slug += " gender-unknown-hide"; }
			
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
				"<div class='panel-heading' id='" + slug + "-title' data-toggle='collapse' href='#" + slug + "' aria-expanded='true' aria-controls='" + slug + "'>"
				+ "<h4 class='panel-title'>"
				+ "<strong>" + book.title
				+ " <small>" + book.author + "</small>"
				+ "</a></h4>"
				+ "</div>");
			var panelBodyContainer = $(
				"<div id='" + slug
				+ "' class='panel-collapse collapse out' aria-labelledby='"
				+ slug + "-title'></div>");
			var panelBody = $("<div class='panel-body'></div></div>");
				
			container.append(panel);
			panel.append(panelHeading);
			panel.append(panelBodyContainer);
			panelBodyContainer.append(panelBody);
						
			// Add in the information about the book.
			var summaryRow = $("<div class='row'></div>");
			var cover = $("<div class='col-md-2'></div>");
			var summary = $("<div class='col-md-10'></div>");
			
			panelBody.append(summaryRow);
			summaryRow.append(cover);
			summaryRow.append(summary);
			
			if (book.urls && book.urls.cover)
			{
				$("<img class='img-responsive' src='" + book.urls.cover + "' alt='" + book.title + " cover'/>")
					.appendTo(cover);
			}
			
			if (book.summary)
			{
				$(book.summary).appendTo(summary);
			}

			// Add in the metadata
			appendKeyValue("Words", book.words, summary);
			appendKeyValue("POV", book.pov, summary);
			appendKeyValue("Tense", book.tense, summary);
			
			if (book.urls)
			{
				appendKeyUrls("Reviews", book.urls.reviews, summary);
				appendKeyUrls("Links", book.urls.book, summary);
			}
			
			// Add in the author information.
			summaryRow = $("<div class='row'></div>");
			cover = $("<div class='col-md-2'></div>");
			summary = $("<div class='col-md-10'></div>");
			
			panelBody.append(summaryRow);
			summaryRow.append(cover);
			summaryRow.append(summary);
			
			if (book.urls && book.urls.avatar)
			{
				$("<img class='img-responsive' src='" + book.urls.avatar + "' alt='" + book.author + " picture'/>")
					.appendTo(cover);
			}
			
			if (book.about)
			{
				$(book.about).appendTo(summary);
			}
			
			if (book.urls)
			{
				appendKeyUrls("Links", book.urls.author, summary);
			}
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
