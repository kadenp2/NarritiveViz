// Scene 4: Correlation between CO2 Emissions and Obesity Rates
Promise.all([
    d3.csv("C02emissions.csv"),
    d3.csv("obesitydata.csv")
]).then(([co2Data, obesityData]) => {
    // Merge data
    const data = co2Data.map(co2 => {
        const obesity = obesityData.find(o => o.Country === co2.Country && o.Year === co2.Year);
        return {
            Country: co2.Country,
            Year: +co2.Year,
            CO2: +co2.CO2,
            ObesityRate: obesity ? +obesity.ObesityRate : null
        };
    }).filter(d => d.ObesityRate !== null);

    // Set up the SVG canvas dimensions
    const margin = { top: 20, right: 30, bottom: 40, left: 50 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#scene4").append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + margin.top + ")");

    // Set up scales
    const x = d3.scaleLinear()
        .domain(d3.extent(data, d => d.CO2))
        .nice()
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain(d3.extent(data, d => d.ObesityRate))
        .nice()
        .range([height, 0]);

    // Add the x-axis
    svg.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x));

    // Add the y-axis
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add scatter plot points
    svg.selectAll(".dot")
        .data(data)
        .enter().append("circle")
        .attr("class", "dot")
        .attr("cx", d => x(d.CO2))
        .attr("cy", d => y(d.ObesityRate))
        .attr("r", 3)
        .attr("fill", "steelblue");

    // Add title
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Correlation between CO2 Emissions and Obesity Rates");
});

