function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
  let url = `/metadata/${sample}`;

    // Use d3 to select the panel with id of `#sample-metadata`
    d3.json(url).then(function(sample){
      let sampleMatadata = d3.select('#sample-metadata');
    
      // Use `.html("") to clear any existing metadata
      sampleMatadata.html('');


    });

  

    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(sample).forEach(function ([key, value]) {
      var row = sampleMetadata.append("p");
      row.text(`${key}: ${value}`);
    });
  });

  // BONUS: Build the Gauge Chart
  // buildGauge(data.WFREQ);
}

function buildCharts(sample) {

// @TODO: Use `d3.json` to fetch the sample data for the plots
var url = `/samples/${sample}`;
d3.json(url).then(function(data) {
  
  // @TODO: Build a Bubble Chart using the sample data
  var x = data.otu_ids;
  var y = data.sample_values;
  var size = data.sample_values;
  var colors = data.otu_ids; 
  var values = data.otu_labels;

    var trace1 = {
    x: x,
    y: y,
    text: values,
    mode: 'markers',
    marker: {
      color: colors,
      size: size
    }
  };
  var data = [trace1];

  var layout = {
    xaxis: { title: "OTU ID"},
  };

  Plotly.newPlot('bubble', data, layout); 

  // @TODO: Build a Pie Chart
  d3.json(url).then(function(data) {  
    var values = data.sample_values.slice(0,10);
    var labels = data.otu_ids.slice(0,10);
    var hoverText = data.otu_labels.slice(0,10);

    var data = [{
      values: values,
      labels: labels,
      hovertext: hoverText,
      type: 'pie'
    }];

  Plotly.newPlot('pie', data);

  });

  // HINT: You will need to use slice() to grab the top 10 sample_values,
  // otu_ids, and labels (10 each).
});
}

// // BONUS: Build the Gauge Chart
// buildGauge(data.WFREQ);
/**
* BONUS Solution
* */
function buildGauge(sample) {

// code resource:
// https://community.plot.ly/t/animations-on-gauge-needle/5804/3
//https://codepen.io/ascotto/pen/eGNaqe?editors=0010

  var url = `/metadata/${sample}`;

  // grab the value of frequency from metadata
  d3.json(url).then(function(sampleData) {
  
  var wfreq = sampleData.WFREQ;

  // create a level for the sample
  var level = parseFloat(wfreq) * 20;
 
  // Trig to calc meter point
   
  var degrees = 180 - level,
  radius = .5;
  var radians = degrees * Math.PI / 180;
  var x = radius * Math.cos(radians);
  var y = radius * Math.sin(radians);

  // Path: may have to change to create a better triangle
  var mainPath = 'M -.0 -0.035 L .0 0.035 L ',
      pathX = String(x),
      space = ' ',
      pathY = String(y),
      pathEnd = ' Z';
  var path = mainPath.concat(pathX,space,pathY,pathEnd);


  var data = [
    {
      type: "scatter",
      x: [0], y:[0],
      marker: {size: 18, color:'850000'},
      showlegend: false,
      name: "Wash Frequency",
      text: level,
      hoverinfo: "text+name"},

    {values: [50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50 / 9, 50],
      rotation: 90,
      text: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
      textinfo: "text",
      textposition: "inside",
      marker: {colors:['rgba(0, 102, 0, .5)', 'rgba(0, 153, 0, .5)',
           'rgba(0, 204, 0, .5)', 'rgba(51, 255, 51, .5)',
                       'rgba(102, 255, 102, .5)', 'rgba(140, 255, 140, .5)',
                       'rgba(170, 255, 170, .5)', 'rgba(204, 255, 204, .5)',
                       'rgba(229, 255, 229, .5)', 'rgba(229, 255, 255, 0)']},
      labels: ["8-9", "7-8", "6-7", "5-6", "4-5", "3-4", "2-3", "1-2", "0-1", ""],
      hoverinfo: "label",
      hole: 0.5,
      type: "pie",
      showlegend: false
    }];

  var layout = {
      shapes:[{
          type: 'path',
          path: path,
          fillcolor: '850000',
          line: {
            color: '850000'
          }
        }],
      title: "<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",
      autosize:true,
      xaxis: {
          zeroline: false,
          showticklabels: false,
          showgrid: false,
          range: [-1, 1]
      },
      yaxis: {
          zeroline: false,
          showticklabels: false,
          showgrid: false,
          range: [-1, 1]
      }
      };

  Plotly.newPlot("gauge", data, layout);
  });
}


function init() {
// Grab a reference to the dropdown select element
var selector = d3.select("#selDataset");

// Use the list of sample names to populate the select options
d3.json("/names").then((sampleNames) => {
  sampleNames.forEach((sample) => {
    selector
      .append("option")
      .text(sample)
      .property("value", sample);
  });

  // Use the first sample from the list to build the initial plots
  const firstSample = sampleNames[0];
  buildCharts(firstSample);
  buildMetadata(firstSample);
  buildGauge(firstSample);
});
}

function optionChanged(newSample) {
// Fetch new data each time a new sample is selected
buildCharts(newSample);
buildMetadata(newSample);
buildGauge(newSample);
}

// Initialize the dashboard
init();