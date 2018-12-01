var svgWidth = 1000;
var svgHeight = 500;

var margin = {
    top: 30,
    right: 30,
    bottom: 100,
    left: 30
}

var width = svgWidth - margin.left - margin.right;
var height = svgHeight - margin.top - margin.bottom;

var svg = d3.select("#plot1")
    .append("svg")
    .attr("width", svgWidth)
    .attr("height", svgHeight);

var chartGroup = svg.append("g")
    .attr("transform", `translate(${margin.left}, ${margin.top})`);

const link = "http://127.0.0.1:5000/collections/avgpricepack";

// d3.csv("../../data/avg_price_of_pack_df_2014.csv", function(error, dataCSV) {
d3.json(link, function(dataCSV) {
    // if (error) throw error;

    var countryArr = [];
    var cigPricesArr = [];
    dataCSV.forEach(function(data) {
        if (data.Year === 2014) {
            countryArr.push(data.Entity);
            cigPricesArr.push(+Object.values(data).slice(2, 3));
        }
    })

    var xScaleD = d3.scaleBand()
        .domain(countryArr)
        .range([0, width])
        .padding(1);

    var yScaleD = d3.scaleLinear()
        .domain([0, d3.max(cigPricesArr)])
        .range([height, 0]);

    var bottomAxis = d3.axisBottom(xScaleD);
    var leftAxis = d3.axisLeft(yScaleD);

    var xAxis = chartGroup.append("g")
        .classed("x-axis", true)
        .attr("transform", `translate(0, ${height})`)
        .call(bottomAxis)
        .selectAll("text")
        .style("text-anchor", "end")
        .attr("dx", "-.8em")
        .attr("dy", "-.55em")
        .attr("transform", "rotate(-45)");

    var yAxis = chartGroup.append("g")
        .classed("y-axis", true)
        .call(leftAxis)

    // var objData = {"countries": countryArr,
    //                "cigprices": cigPricesArr}

    // var zippedData = countryArr.map(function(e, i) {
    //   return [e, cigPricesArr[i]];
    // });

    // var lineArray = [];
    // zippedData.forEach(function (infoArray, index) {
    //     var line = infoArray.join(",");
    //     lineArray.push(index == 0 ? "countries,cigprices \n" + line : line);
    // });
    // var csvContent = lineArray.join("\n");

    chartGroup.selectAll(".bar")
        .data()
        .enter()
        .append("rect")
        .attr("class", "bar")
        .style("fill", "steelblue")
        .attr("x", d => xScaleD(d.Entity))
        .attr("y", d => yScaleD(d.CigPrices))
        .attr("width", xScaleD.bandwidth())
        .attr("height", d => height - yScaleD(d.CigPrices));

})

