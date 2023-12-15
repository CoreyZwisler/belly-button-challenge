// set URL to variable
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json";

// Create an in it function that creates the dropdown menu and calls the graphs
// associated with the selected id
function init() {

    // select the dropdown menu
    let dropdownMenu = d3.select("#selDataset");

    // fetch data
    d3.json(url).then((data) => {
        console.log("Data: ", data);

        // array of names
        let names = data.names;
        
        // assign each name to a dropdown menu value
        names.forEach((name) => {
            dropdownMenu.append("option").text(name).property("value", name);
        });

        // assign first name to variable
        let name = names[0];

        //call graph functions
        barchart(name);
        bubblechart(name);
        demographicChart(name);
    });
};

// Create a function for the horizontal barchart
function barchart(dropdownID) {

    // Fetch data
    d3.json(url).then((data) => {
        console.log("Data: ", data);
        
        // Pull the samples into an array
        let samples = data.samples;
        
        // Filter the samples by their id
        let filteredData = samples.filter((sample) => sample.id === dropdownID);

        // Assign first id to variable
        let id = filteredData[0];

        // Trace data
        // Putting the trace within [] allows it to be turned into an array at the same
        // time it is created
        let trace = [{
            x: id.sample_values.slice(0, 10).reverse(),
            y: id.otu_ids.slice(0, 10).map((otu_id) => `OTU ${otu_id}`).reverse(),
            text: id.otu_labels.slice(0, 10).reverse(),
            type: "bar",
            orientation: "h"
        }];

        // Plot chart
        Plotly.newPlot("bar", trace);
    });
};

// Create a function for the bubble chart
function bubblechart(dropdownID) {

    // Fetch data
    d3.json(url).then((data) => {
        console.log("Data: ", data);
        
        // Pull the samples into an array
        let samples = data.samples;
        
        // Filter the samples by their id
        let filteredData = samples.filter((sample) => sample.id === dropdownID);
        
        // Assign first id to variable
        let id = filteredData[0];

        // Trace data
        // Putting the trace within [] allows it to be turned into an array at the same
        // time it is created
        let trace = [{
            x: id.otu_ids,
            y: id.sample_values,
            text: id.otu_labels,
            mode: "markers",
            marker: {
                color: id.otu_ids,
                size: id.sample_values,
                colorscale: "Earth"
            }
        }];

        //Layout to display x axis title
        let layout = {
            xaxis: {title: "OTU ID"}
        };

        //Plot the chart
        Plotly.newPlot("bubble", trace, layout);
    });
};

function demographicChart(dropdownID) {
        
    // Fetch data
    d3.json(url).then((data) => {
        console.log("Data: ", data);
    
        // Pull metadata into array
        let metadata = data.metadata;

        // Filter data
        let filteredData = metadata.filter((meta) => meta.id == dropdownID);

        // Assign first id to variable
        let id = filteredData[0];

        // Select the panel to contain metadata and clear it
        d3.select("#sample-metadata").html("");

        // Use object.entries (found using documentation) to pull key-value pairs and append to table
        Object.entries(id).forEach(([key, value]) => {
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
        });
    });
};

// Create a function to handle the id change in the dropdown menu
function optionChanged(dropdownID) {
    barchart(dropdownID);
    bubblechart(dropdownID);
    demographicChart(dropdownID);
};

init();