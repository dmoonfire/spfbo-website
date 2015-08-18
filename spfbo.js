function updateCounts() {
	var visible = $(".book:visible").length;
	var total = $(".book").length;
	var percentage = Math.floor(10000 * visible / total) / 100;
	
	$("#counts").html(visible.toLocaleString() + "/" + total.toLocaleString());
	$("#percentage").html(percentage + "%");
	
	if (visible === 0)
	{
		$("#nothing").show();
	} else {
		$("#nothing").hide();
	}
}

function appendKeyValue(label, value, parent) {
	if (value && value !== "Unknown")
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

			case "kobo":
				u = "https://store.kobobooks.com/en-US/ebook/" + url.id;
				t = "Kobo";
				break;
				
			case "wattpad":
				u = "https://www.wattpad.com/story/" + url.id;
				t = "Wattpad";
				break;
				
			case "amazon":
				var a = "<a href='https://www.amazon.com/dp/" + url.id + "'>Amazon US</a>";
				a += " <a href='https://www.amazon.co.uk/dp/" + url.id + "'>UK</a>";
				a += "<br/>"
				urlText.append("<a href='https://www.amazon.com/dp/" + url.id + "'>https://www.amazon.com/dp/" + url.id + "</a><br/>");
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
			
			case "goodreads-author":
				u = "https://www.goodreads.com/author/show/" + url.id;
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

function onData(data) {
	// Parse the results as JSON.
	if (typeof(data) === "string")
	{
		data = JSON.parse(data);
		console.log("Switching from string to JSON object");
	}
	
	// Loop through the reviewer and create the results.
	var container = $("#book-container");
	
	for (var reviewer of data)
	{
		for (var book of reviewer.books)
		{
			// Figure out slugs and IDs.
			var slug = book.title.toLowerCase().replace(/['’:]/, "").replace(/\s+/g, "-");
			var status_slug = "status-" + book.status.toLowerCase().replace(/['’:]/, "").replace(/\s+/g, "-");
			var gender_slug = "gender-" + book.gender.toLowerCase().replace(/['’:]/, "").replace(/\s+/g, "-");
			var race_slug = "race-" + book.race.toLowerCase().replace(/['’:]/, "").replace(/\s+/g, "-");
			var nationality_slug = "nationality-" + book.nationality.toLowerCase().replace(/['’:]/, "").replace(/\s+/g, "-");
			var group_slug = "group-" + reviewer.group.toLowerCase().replace(/['’:]/, "").replace(/\s+/g, "-");
			
			// Figure out which social networks we have.
			var has_twitter = false;
			var has_facebook = false;
			
			if (book.urls && book.urls.author)
			{
				for (author of book.urls.author)
				{
					if (author.type === "twitter") { has_twitter = true; }
					if (author.type === "facebook") { has_facebook = true; }
				}
			}
			
			var twitter_class = "twitter-" + (has_twitter ? "yes" : "no");
			var facebook_class = "facebook-" + (has_facebook ? "yes" : "no");
			
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
				+ nationality_slug + " "
				+ twitter_class + " "
				+ facebook_class + " "
				+ " book'></div>");
			var panelHeading = $(
				"<div class='panel-heading collapsed' id='" + slug + "-title' data-toggle='collapse' href='#" + slug + "' aria-expanded='true' aria-controls='" + slug + "'>"
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
			
			appendKeyValue("Gender", book.gender, summary);
			appendKeyValue("Race", book.race, summary);
			appendKeyValue("Nationality", book.nationality, summary);

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

		// Hook up events when the button is toggled.
		elem.on('click', function() {
			var checked = elem.prop("checked");
			$("div." + classId).toggleClass(classId + "-hide", !checked);
			updateCounts();
		});
		
		// Add in the counts at the end.
		var number = $("." + classId).length;
		elem.parent().append(" (" + number + ")");
	});
	$("label.radio-inline input").each(function(index, item) {
		var elem = $(item);
		var classId = item.name.replace("radio-", "");
		var value = item.value;
		
		elem.on('click', function() {
			$("div." + classId + "-yes").toggleClass(classId + "-yes-hide", value == "no");
			$("div." + classId + "-no").toggleClass(classId + "-no-hide", value == "yes");
			updateCounts();
		});
	});
	
	// Hide the loading box and display the results.
	$("#loading").hide();
	$(".book").show();
	$("#search-form").show();

	// If there is a hash, then use that.
	if (window.location.hash)
	{
		var hash = decodeURIComponent(window.location.hash)
			.substring(1)
			.replace(/\+/g, " ");
		console.log("hash", hash);
		$("#search").prop("value", hash);
		searchBooks();
	}

	// Update the count of books.
	updateCounts();
}

function searchBooks() {
	// Get the search terms from the box.
	var filter = $("#search").val();
	var terms = filter.toLowerCase().split(/[\s,]+/);
	
	console.log("searching", terms);
	
	// Loop through the book and figure out which one we are showing.
	var total = 0;
	
	$(".book").each(function(){
		// Get a combined title and text, then search that every token
		// is inside the token.
		var name = $(this).find("h4").text().toLowerCase();
		var valid = true;
		
		for (term of terms)
		{
			var found = name.search(term) >= 0;
			
			if (!found)
			{
				valid = false;
				break;
			}
		}
		
		// Based on the valid flag, we hide or show it.
		console.log("  found", name);
		
		$(this).toggleClass("search-hide", !valid);
		
		if (valid) total++;
	});
	
	// Update the counts.
	updateCounts();
	
	// If we have only a single one, then expand it.
	console.log("Found entries: " + total);
	
	if (total == 1)
	{
		console.log("Expanding single entry");
		$(".book:visible div.panel-heading.collapsed").click();
	}
}

$(document).ready(function() {
	// Retrieve the results and populate them.
	$.get("spfbo.json", onData).done(showResults);

	// Hoop up the live search.
	$("#search").keyup(searchBooks);
});
