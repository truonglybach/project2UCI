// Zips for each item out of two arrays together and returns an array of objects
function JSONify(arr1, arr2) {
        var JSONdata = [];
        var o;
        arr1.forEach(function(e, i) {
            o = arr2[i];
            JSONdata.push({e, o});
        })
        return JSONdata;
    }

// Function that takes removes duplicates in an array and returns a new array
function onlyUnique(value, index, self) { 
    return self.indexOf(value) === index;
}

// Set height and width of SVGs
var svgWidth = 1000;
var svgHeight = 500;

// Set margins
var margin = {
    top: 30,
    right: 30,
    bottom: 100,
    left: 30
}

// Set the height and width of the actual plot/chart
var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

// Create the barChartSVG
var barChartSVG = d3.select("#barChart")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

// Create the lineChartSVG
var lineChartSVG = d3.select("#lineChart")
    .append("svg")
    .attr("width", svgWidth + 40)
    .attr("height", svgHeight);


// Add an SVG group to each chart
var barChartGroup = barChartSVG.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

var lineChartGroup = lineChartSVG.append("g")
    .attr("transform", `translate(${margin.left + 24}, ${margin.top})`);

const barLink = "http://127.0.0.1:5000/collections/avgpricepack";
const lineLink = "http://127.0.0.1:5000/collections/numdeathstobaccosmoking";

d3.json(barLink, function(error, barJSON) {
    if (error) throw error;

    var entityArr = [];
    var cigPricesArr = [];
    barJSON.forEach(function(data) {
        if (data.Year === 2014) {
            entityArr.push(data.Entity);
            cigPricesArr.push(+Object.values(data).slice(2, 3));
        }
    })

    var xScaleD = d3.scaleBand()
        .domain(entityArr)
        .range([0, width])
        .padding(.1);

    var yScaleD = d3.scaleLinear()
        .domain([0, d3.max(cigPricesArr)])
        .range([height, 0]);

    var bottomAxis = d3.axisBottom(xScaleD);
    var leftAxis = d3.axisLeft(yScaleD);

    var xAxis = barChartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-45)");

    var yAxis = barChartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis);

    var objDJSON = JSONify(entityArr, cigPricesArr)

    var barChart = barChartGroup.selectAll(".bar")
        .data(objDJSON)
        .enter()
        .append("rect")
        .attr("class", "bar")
        .style("fill", "#960A24")
        .attr("x", d => xScaleD(d.e))
        .attr("y", d => yScaleD(d.o))
        .attr("width", xScaleD.bandwidth())
        .attr("height", d => height - yScaleD(d.o));

    var toolTip = d3.tip()
        .attr("class", "tooltip")
        .offset([80, -60])
        .html(function(d) {
            return (`<b>Avg Price per Pack</b> (<i>in Int'l Dollars</i>)<br/><br/>${d.e}: $${d.o}`);
        });

    barChart.call(toolTip);

    barChart.on("mouseover", function(data) {
        toolTip.show(data);
    })
        .on("mouseout", function(data) {
            toolTip.hide(data);
        });

})

var parseTime = d3.timeParse("%Y");

d3.json(lineLink, function(error, lineJSON) {
    if (error) throw error;

    var yearArr = []
    var smokeCountArr = []
    var entityArr = []

    lineJSON.forEach(function(data) {
        entityArr.push(data.Entity);

        data.Year = parseTime(data.Year);
        yearArr.push(data.Year);

        data.smokeCount = +data.smokeCount;
        smokeCountArr.push(+data.smokeCount);
    })

// Filter JSON based on entity/country

function filterbyEntity(JSON, val) {
    var filteredData = [];
    JSON.forEach(function(data) {
        if (data.Entity === val) {
            filteredData.push(data);
        }
    });
    return filteredData;
}

var uniqueEntities = entityArr.filter(onlyUnique);
var uniqueYears = yearArr.filter(onlyUnique);

for (i=0; i<uniqueEntities.length; i++) {
    var countryName = uniqueEntities[i];
    var countryData = filterbyEntity(lineJSON, uniqueEntities[i]);
    // var countryYears = []
    // var countrySC = []

    // countryData.forEach(function(data) {
    //     countryYears.push(data.Year);
    //     countrySC.push(data.smokeCount);
    // })

    var xTimeScale = d3.scaleTime()
        .domain(d3.extent(countryData, data => data.Year))
        .range([0, width]);

    var yLinearScale = d3.scaleLinear()
        .domain([0, d3.max(countryData, data => data.smokeCount)])
        .range([height, 0]);

    var bottomAxis = d3.axisBottom(xTimeScale);
    var leftAxis = d3.axisLeft(yLinearScale);

    // !!!drawLine function not working!!!
    var drawLine = d3.line()
        .x(d => xTimeScale(d.Year))
        .y(d => yLinearScale(d.smokeCount))

    // lineChartGroup.append("path")
    //     .attr("d", drawLine)
    //     .classed("line", true);

    // lineChartGroup.append("g")
    //     .classed("axis", true)
    //     .call(leftAxis);

    // lineChartGroup.append("g")
    //     .classed("axis", true)
    //     .attr("transform", `translate(0, ${height})`)
    //     .call(bottomAxis);


}





    // var objData = JSONify(yearArr, smokeCountArr);

// CONTINUE HERE TO APPEND


})


// Add user interaction by having a text box/option thing where 
// they can choose country to filter by and create line chart from

