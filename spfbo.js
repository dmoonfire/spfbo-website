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
				var a = "<a target='_new' href='https://www.amazon.com/dp/" + url.id + "?tag=dmoo-20'>Amazon US</a>";
				a += " <a target='_new' href='https://www.amazon.co.uk/dp/" + url.id + "?tag=dmoo-20'>UK</a>";
				a += "<br/>"
				urlText.append("<a target='_new' href='https://www.amazon.com/dp/" + url.id + "?tag=dmoo-20'>https://www.amazon.com/dp/" + url.id + "</a><br/>");
				values.append(a);
				continue;
				
			case "smashwords":
				u = "https://www.smashwords.com/books/view/" + url.id;
				t = "Smashwords";
				break;
				
			case "tumblr":
				u = "https//" + url.id + ".tumblr.com/";
				t = "Tumblr";
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
		urlText.append("<a target='_new' href='" + u + "'>" + u + "</a><br/>");
		values.append("<a target='_new' href='" + u + "'>" + t + "</a><br/>");
	}
}

var totalBooks = 0;
var loadedBooks = 0;

function updateLoading() {
	$("#loading").text("Loading " + loadedBooks + " of " + totalBooks);
}

function onIndexData(data) {
	// Parse the results as JSON.
	if (typeof(data) === "string")
	{
		data = JSON.parse(data);
	}

	// Update the loading screen.
	totalBooks = data.length;
	updateLoading();

	// Go through the sequence and pull out the names.
	for (var entry of data)
	{
		// Retrieve the results and populate them.
		console.log("Loading", entry);
		$.get("data/" + entry + ".json?r=1", onBookData).done(onBookEnd);
	}
}

function onBookData(book) {
	try {
		// Parse the results as JSON.
		if (typeof(book) === "string")
		{
			book = JSON.parse(book);
		}

		// Get the element we'll be adding to.
		var container = $("#book-container");

		// Figure out slugs and IDs.
		var slug = book.title.toLowerCase().replace(/['’:]/, "").replace(/\s+/g, "-");
		var status_slug = "status-" + book.status.toLowerCase().replace(/['’:]/, "").replace(/\s+/g, "-");
		var gender_slug = "gender-" + book.gender.toLowerCase().replace(/['’:]/, "").replace(/\s+/g, "-");
		var race_slug = "race-" + book.race.toLowerCase().replace(/['’:]/, "").replace(/\s+/g, "-");
		var nationality_slug = "nationality-" + book.nationality.toLowerCase().replace(/['’:]/, "").replace(/\s+/g, "-");
		var group_slug = "group-" + book.reviewer.toLowerCase().replace(/['’:]/, "").replace(/\s+/g, "-");

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
		var badge = "";

		switch (book.status)
		{
			case "Winner":
				panelType = "panel-primary";
				badge = '<strong>Winner</strong>&nbsp;<span class="glyphicon glyphicon-star" aria-hidden="true"></span>';
				break;
			case "Finalist":
				panelType = "panel-success";
				badge = 'Finalist&nbsp;<span class="glyphicon glyphicon-star-empty" aria-hidden="true"></span>';
				break;
			case "Passed":
				panelType = "panel-default";
				break;
			case "Honorable":
				panelType = "panel-info";
				badge = 'Honorable Mention&nbsp;<span class="glyphicon glyphicon-heart-empty" aria-hidden="true"></span>';
				break;
			case "Withdrawn":
				panelType = "panel-danger";
				break;
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
			+ " book'"
			+ " data-status='" + book.status + "'></div>");
		var panelHeading = $(
			"<div class='panel-heading collapsed' id='" + slug + "-title' data-toggle='collapse' href='#" + slug + "' aria-expanded='true' aria-controls='" + slug + "'>"
			+ "<div class='pull-right'>"
			+ badge
			+ "</div><h4 class='panel-title'>"
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
		appendKeyValue("Reviewer", book.reviewer, summary);
		appendKeyValue("Words", book.words, summary);
		appendKeyValue("POV", book.pov, summary);
		appendKeyValue("Tense", book.tense, summary);

		if (book.urls)
		{
			appendKeyUrls("Reviews", book.urls.reviews, summary);
			appendKeyUrls("Links", book.urls.book, summary);
		}

		// Add the Google search.
		var q = '"';
		var qTitle = book.title.replace("'", "");
		var searchString = q + qTitle + '" "' + book.author + q;
		var qString = encodeURIComponent(searchString);

		appendKeyValue(
			"Google",
			"<a target='_new' href='https://google.com/search?q="
				+ qString
				+ "'>Google</a>",
			summary);

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

		// Add in the corrections and updates line.
		searchString = qTitle + ' by ' + book.author;
		qString = encodeURIComponent(searchString);

		updatesRow = $("<div class='row'></div>");
		updates = $("<div class='col-md-12 updates'></div>");
		panelBody.append(updatesRow);
		updatesRow.append(updates);

		console.log("book", book.title, book.processed);

		if (book.processed)
		{
			link = $("<a href='mailto:contact@moonfire.us?subject=Updates%20and%20Corrections%20for%20" + qString + "'>Please send corrections and updates to contact@moonfire.us.</a>");
		}
		else
		{
			link = $("<span>Data has not been gathered for this book. If you have summaries, links, or links to pictures, please send them to <a href='mailto:contact@moonfire.us?subject=Updates%20and%20Corrections%20for%20" + qString + "'>contact@moonfire.us.</a> and it will get updated as soon as reasonable.</span>");
		}

		updates.append(link);
	}
	catch(err) {
		// Report what we're reading.
		console.log("Error loading", book, err);
	}
}

function onBookEnd() {
	// Update the loading status.
	loadedBooks += 1;
	updateLoading();
	
	// If we've completely loaded, then finish up.
	if (loadedBooks == totalBooks)
	{
		showResults();
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
	
	// Sort through the books.
	var container = $("#book-container");
	var books = $(".book");
	
	books.sort(function(a, b) {
		var at = $(a).find("h4 strong").text();
		var bt = $(b).find("h4 strong").text();
		
		if (at > bt) { return 1; }
		else if (bt < at) { return -1; }
		else { return 0; }
	});
	
	books.detach().appendTo(container);
	
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
		var status = $(this).data("status").toLowerCase();
		var haystack = name + " " + status;
		var valid = true;

		//console.log("searching", haystack);
		
		for (term of terms)
		{
			var found = haystack.search(term) >= 0;
			
			if (!found)
			{
				valid = false;
				break;
			}
		}
		
		// Based on the valid flag, we hide or show it.
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
	$.get("data/index.json", onIndexData);

	// Hoop up the live search.
	$("#search").keyup(searchBooks);
});

//.done(onIndexLoaded);
