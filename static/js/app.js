//Load in data from the samples.json file
let jsonPath = "./data/samples.json"

d3.json(jsonPath).then(function(data) {
   
   
    //Create empty arrays to store data from json
    ids = [];
    metadata = [];
    otuids = [];
    otulabels = [];
    samplevalues = [];


    //Loop through and populate the array of ids
    for (let i = 0; i < data.names.length; i++) {
        let currentID = data.names[i];
        let currentMeta = data.metadata[i];
        let currentOtids = data.samples[i].otu_ids;
        let currentOtlabs = data.samples[i].otu_labels;
        let currentSampvals = data.samples[i].sample_values;
        ids.push(currentID);
        metadata.push(currentMeta);
        otuids.push(currentOtids);
        otulabels.push(currentOtlabs);
        samplevalues.push(currentSampvals);
    };

    // Initializes the page with a default horizontal bar chart and bubble chart
    function init() {
        
        //Populate the dropdown menu
        var select = document.getElementById("selDataset");

        for(var i = 0; i < data.names.length; i++) {
            var opt = data.names[i];
            var listId = document.createElement("option");
            listId.textContent = opt;
            listId.value = opt;
            select.appendChild(listId);
        };
        
        
        //Populate the Demographic Info panel with initial values
        const container = document.getElementById('sample-metadata');

        container.insertAdjacentText('beforeend', `ID: ${metadata[0].id}`);
        container.insertAdjacentText('beforeend', `Ethnicity: ${metadata[0].ethnicity}`);
        container.insertAdjacentText('beforeend', `Gender: ${metadata[0].gender}`);
        container.insertAdjacentText('beforeend', `Age: ${metadata[0].age}`);
        container.insertAdjacentText('beforeend', `Location: ${metadata[0].location}`);
        container.insertAdjacentText('beforeend', `BBType: ${metadata[0].bbtype}`);
        container.insertAdjacentText('beforeend', `WFreq: ${metadata[0].wfreq}`);


        // Create variables to hold just the top values
        let topTenSamp = samplevalues[0].slice(0,11);
        let topTenOtus = otuids[0].slice(0,11);

        // Enter the data to be shown in the horizontal bar chart
        let barData = [{
            type: 'bar',
            x: topTenSamp,
            y: topTenOtus,
            orientation: 'h'
        }];

        // Create the layout of the horizontal bar chart
        let barLayout = {
            title: "Top 10 OTUs Found in Test Subject",
            height: 650,
            width: 1100
        };
        
        // Plot the initial horizontal bar chart
        Plotly.newPlot("bar", barData, barLayout);

        // Enter the data to be shown in the bubble chart
        var trace1 = {
            x: samplevalues[0],
            y: otuids[0],
            text: otulabels[0],
            mode: 'markers',
            marker: {
              color: otuids[0],
              size: samplevalues[0]
            }
          };
          
          var bubbleData = [trace1];
          
          var bubbleLayout = {
            title: 'All OTUs Found in Test Subject',
            showlegend: false,
            height: 600,
            width: 1400
          };
          
          Plotly.newPlot("bubble", bubbleData, bubbleLayout);
    }; 
    
    // On change to the DOM, call getData()
    d3.selectAll("#selDataset").on("change", optionChanged());

    // Function to getData for selection from dropdown menu
    function optionChanged() {
        let dropdownMenu = d3.select("#selDataset");
        // Assign the value of the dropdown menu option to a letiable
        let dataset = dropdownMenu.property("option");
        // Initialize arrays for new data
        let a = [];
        let b = [];
        let c = [];
        let d = [];
        let e = [];
        let f = [];
        
        function findNum(dataset) {
            //Loop through and find what number test subject has been chosen
            for (let x = 0; x < data.names.length; x++) {
                if (dataset == ids[x]) {
                    return x;
                }
            };
        
        let num = findNum(dataset);

        a = samplevalues[num];
        b = otuids[num];
        c = otulabels[num];
        d = a.slice(0,11);
        e = b.slice(0,11);
        f = metadata[num];

        console.log(d);

        //Call function to update Plotly
        updatePlotly(a, b, c, d, e);

        //Call function to update Demographic Info
        updateDemInfo(f);
        };
    };

    //Update the bar chart and bubble chart with the new data
    function updatePlotly(a,b,c,d,e) {
        let newBarData = [{
            x: d,
            y: e,
        }];

        var newTrace1 = {
            x: a,
            y: b,
            text: c,
            mode: 'markers',
            marker: {
              color: b,
              size: a
            }
          };
          
          var newBubbleData = [newTrace1];

        Plotly.restyle("bar", newBarData);
        Plotly.restyle("bubble", newBubbleData);

    };

    //Update the demographic info


    //Call function to initialize page
    init();
});
    






