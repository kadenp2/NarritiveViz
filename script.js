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
        .domain(d3.extent(co2Data, d => d.Year))
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(co2Data, d => d.Emissions)])
        .range([height, 0]);

    // Define axes
    const xAxis = d3.axisBottom(x);
    const yAxis = d3.axisLeft(y);

    // Add axes to SVG
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis);

    // Add line for CO2 Emissions
    const line = d3.line()
        .x(d => x(d.Year))
        .y(d => y(d.Emissions));

    svg.append("path")
        .datum(co2Data)
        .attr("class", "line")
        .attr("d", line)
        .style("stroke", "steelblue")
        .style("fill", "none");

    // Function to transition between scenes
    function showScene(scene) {
        if (scene === 1) {
            // Show CO2 Emissions
            svg.selectAll(".line")
                .datum(co2Data)
                .transition()
                .duration(1000)
                .attr("d", line)
                .style("stroke", "steelblue");

        } else if (scene === 2) {
            // Show Obesity Data
            const obesityLine = d3.line()
                .x(d => x(d.Year))
                .y(d => y(d.ObesityRate));

            y.domain([0, d3.max(obesityData, d => d.ObesityRate)]);
            svg.select(".y.axis").transition().duration(1000).call(yAxis);

            svg.selectAll(".line")
                .datum(obesityData)
                .transition()
                .duration(1000)
                .attr("d", obesityLine)
                .style("stroke", "orange");

        } else if (scene === 3) {
            // Show Life Expectancy Data
            const lifeExpectancyLine = d3.line()
                .x(d => x(d.Year))
                .y(d => y(d.LifeExpectancy));

            y.domain([0, d3.max(lifeExpectancyData, d => d.LifeExpectancy)]);
            svg.select(".y.axis").transition().duration(1000).call(yAxis);

            svg.selectAll(".line")
                .datum(lifeExpectancyData)
                .transition()
                .duration(1000)
                .attr("d", lifeExpectancyLine)
                .style("stroke", "green");
        }
    }

    // Initial scene
    showScene(1);

    // Add buttons for navigation
    const scenes = ["CO2 Emissions", "Obesity Rate", "Life Expectancy"];
    const nav = d3.select("#visualization").append("div");

    scenes.forEach((scene, i) => {
        nav.append("button")
            .text(scene)
            .on("click", () => showScene(i + 1));
    });
});
