// Load data
Promise.all([
    d3.csv('C02emissions.csv'),
    d3.csv('obesitydata.csv'),
    d3.csv('life-expectancy.csv')
]).then(function(files) {
    const co2Data = files[0];
    const obesityData = files[1];
    const lifeExpectancyData = files[2];

    // Parse data
    co2Data.forEach(d => {
        d.Year = +d.Year;
        d.Emissions = +d.Emissions;
    });

    obesityData.forEach(d => {
        d.Year = +d.Year;
        d.ObesityRate = +d.ObesityRate;
    });

    lifeExpectancyData.forEach(d => {
        d.Year = +d.Year;
        d.LifeExpectancy = +d.LifeExpectancy;
    });

    // Define dimensions and margins
    const margin = {top: 20, right: 20, bottom: 30, left: 40},
          width = 960 - margin.left - margin.right,
          height = 500 - margin.top - margin.bottom;

    // Create SVG container
    const svg = d3.select("#visualization").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    // Define scales
    const x = d3.scaleLinear()
        .domain([d3.min(co2Data, d => d.Year), d3.max(co2Data, d => d.Year)])
        .range([0, width]);

    const y = d3.scaleLinear()
        .range([height, 0]);

    // Define axes
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    // Add axes to SVG
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    const yAxisGroup = svg.append("g")
        .attr("class", "y axis");

    // Add line
    const line = svg.append("path")
        .attr("class", "line")
        .style("fill", "none")
        .style("stroke-width", "2px");

    // Function to update the line
    function updateLine(data, yValue, color) {
        y.domain([0, d3.max(data, yValue)]);
        yAxisGroup.transition().duration(1000).call(yAxis);

        const lineFunction = d3.line()
            .x(d => x(d.Year))
            .y(d => y(yValue(d)));

        line.datum(data)
            .transition()
            .duration(1000)
            .attr("d", lineFunction)
            .style("stroke", color);
    }

    // Initial scene
    updateLine(co2Data, d => d.Emissions, "steelblue");

    // Event listeners for buttons
    d3.select("#scene1").on("click", () => updateLine(co2Data, d => d.Emissions, "steelblue"));
    d3.select("#scene2").on("click", () => updateLine(obesityData, d => d.ObesityRate, "orange"));
    d3.select("#scene3").on("click", () => updateLine(lifeExpectancyData, d => d.LifeExpectancy, "green"));
});
