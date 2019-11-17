// from data.js
var tableData = data;

// Initialize the filterCriteria object
var filterCriteria = {};

// Initialize filteredData
var filteredData = tableData;

// Select "Filter Table" button
var filterTableBtn = d3.select("#filter-btn");

// Select tbody
var tbody = d3.select("tbody");	

// Prepare an object for looping through to populate each of the five dropdowns in the HTML
var keyAndOptions = [{
		fieldName: 'Date', 
		tableKey: 'datetime'
	},
	{
		fieldName: 'City', 
		tableKey: 'city'
	},
	{
		fieldName: 'State', 
		tableKey: 'state'
	},
	{
		fieldName: 'Country', 
		tableKey: 'country'
	},
	{
		fieldName: 'Shape', 
		tableKey: 'shape'
	}
];

// Populate each of the five dropdowns in the HTML
Object.entries(keyAndOptions).forEach(([key, value]) => selectAndPopulate(value.fieldName, value.tableKey));

// Function to select and and populate each of the five dropdowns in the HTML
function selectAndPopulate(fieldName, tableKey) {

	// Select the select tag for the fieldName
	var field_menu = d3.select('#sel'+fieldName);

	// Populate dropdown with dates available
	var optionsArray = [...new Set(tableData.map(sighting => sighting[tableKey]))];
	optionsArray.unshift('No filter');
	optionsArray.forEach(option => field_menu.append('option').attr('value', option).text(option.toUpperCase()));
}

// Function that updates the filteredData set (called when user selects an option in index.html)
function updateFilteredData(queryField, queryValue) {

	// Reset filteredData to complete set of data (ie. tableData)
	// Note: New filters cannot be performed from a set of data that may already have
	// 		 multiple filters.
	filteredData = tableData; 

	// Update filterCriteria's queryField with new queryValue
	filterCriteria[queryField] = queryValue;

  	// Loop through each criteria and update filteredData
  	Object.entries(filterCriteria).forEach(([key, value]) => {
		filteredData = filteredData.filter(function (sighting) {
			if (value === 'No filter') {
				return sighting[key];
			} else {
				return sighting[key] === value;
			}
		});
  	});
}

// Handle click for the "Filter Table" button
filterTableBtn.on("click", function() {

	// Prevent the page from refreshing (since this button has type "submit")
	d3.event.preventDefault();

	updateTbody(filteredData);
});

// Function to update the table in the tbody
function updateTbody(filteredData) {

	// Clear the data in tbody
	tbody.text('');

	// Populate tbody with rows and cells needed for filteredData
	filteredData.forEach(record => { 

		// Assign new appended row into a variable for later use
		var row = tbody.append('tr');

		// Loop through each record
		Object.entries(record).forEach( ([key, value]) => {

			// Append a 'td' element to the row with the value of each key in the object
			row.append('td').text(value);
		});
	});
}

