function updateCounts() {
	var visible = $(".book:visible").length;
	var total = $(".book").length;
	
	$("#counts").html(visible.toLocaleString() + "/" + total.toLocaleString());
}

function appendKeyValue(label, value, parent) {
	if (value)
	{
		// Numbers should always be comma-separated.
		if (typeof(value) == "number")
		{
			value = value.toLocaleString();
		}
		
		// Create a line item for it.
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
	
	// Go through each URL and add the entry.
	label += ":";
	
	for (url of urls)
	{
		// Create the elements we'll append to.
		var row = $("<div class='row'></div>");
		var key = $("<div class='col-md-2 metadata-key'>" + label + "</div>");
		var values = $("<div class='col-md-3 metadata-value'></div>");
		var urlText = $("<div class='col-md-7 metadata-url'></div>");
		
		row.append(key);
		row.append(values);
		row.append(urlText);
		parent.append(row);
		
		// Reset the label so it doesn't repeat.
		label = "";

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
				urlText.append("<a href='https://www.amazon.com/dp/" + url.asin + "'>https://www.amazon.com/dp/" + url.asin + "</a><br/>");
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
		urlText.append("<a href='" + u + "'>" + u + "</a><br/>");
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
				case "Withdrawn": panelType = "panel-danger"; break;
			}
			
			var panel = $(
				"<div class='panel "
				+ panelType + " "
				+ status_slug + " "
				+ gender_slug + " "
				+ race_slug + " "
				+ group_slug + " "
				+ nationality_slug
				+ " book'></div>");
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
				
			panel.hide();
			container.append(panel);
			panel.append(panelHeading);
			panel.append(panelBodyContainer);
			panelBodyContainer.append(panelBody);
						
			// Add in the information about the book.
			var summaryRow = $("<div class='row'></div>");
			var cover = $("<div class='col-md-2'></div>");
			var summary = $("<div class='col-md-10'></div>");
			
			panelBody.append("<h3>" + book.title + "</h3>");
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
			
			panelBody.append("<h3>" + book.author + "</h3>");
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
			
			// Update the count of books.
			updateCounts();
		})
	});
	
	// Hide the loading box and display the results.
	$("#loading").hide();
	$(".book").show();

	// Update the count of books.
	updateCounts();
}

$(document).ready(function() {
	// Retrieve the results and populate them.
	$.get("spfbo.json", onData)
		.done(showResults);
});