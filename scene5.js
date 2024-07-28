// Scene 5: Interactive Scatter Plot for Exploration
Promise.all([
    d3.csv("C02emissions.csv"),
    d3.csv("life-expectancy.csv"),
    d3.csv("obesitydata.csv")
]).then(([co2Data, lifeExpectancyData, obesityData]) => {
    // Merge data
    const data = co2Data.map(co2 => {
        const life = lifeExpectancyData.find(l => l.Country === co2.Country && l.Year === co2.Year);
        const obesity = obesityData.find(o => o.Country === co2.Country && o.Year === co2.Year);
        return {
            Country: co2.Country,
            Year: +co2.Year,
            CO2: +co2.CO2,
            LifeExpectancy: life ? +life.LifeExpectancy : null,
            ObesityRate: obesity ? +obesity.ObesityRate : null
        };
    }).filter(d => d.LifeExpectancy !== null && d.ObesityRate !== null);

    // Set up the SVG canvas dimensions
    const margin = { top: 20, right: 30, bottom: 40, left: 50 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#scene5").append("svg")
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
        .domain(d3.extent(data, d => d.LifeExpectancy))
        .nice()
        .range([height, 0]);

    const z = d3.scaleLinear()
        .domain(d3.extent(data, d => d.ObesityRate))
        .range([5, 20]);

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
        .attr("cy", d => y(d.LifeExpectancy))
        .attr("r", d => z(d.ObesityRate))
        .attr("fill", "steelblue")
        .attr("opacity", 0.7)
        .append("title")
        .text(d => `${d.Country}: CO2=${d.CO2}, Life Expectancy=${d.LifeExpectancy}, Obesity Rate=${d.ObesityRate}`);

    // Add title
    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Interactive Scatter Plot: CO2 Emissions, Life Expectancy, and Obesity Rates");

    // Add interactivity (tooltip, zoom, etc.)
    const tooltip = d3.select("body").append("div")
        .attr("class", "tooltip")
        .style("opacity", 0);

    svg.selectAll(".dot")
        .on("mouseover", (event, d) => {
            tooltip.transition()
                .duration(200)
                .style("opacity", .9);
            tooltip.html(`${d.Country}<br/>CO2: ${d.CO2}<br/>Life Expectancy: ${d.LifeExpectancy}<br/>Obesity Rate: ${d.ObesityRate}`)
                .style("left", (event.pageX + 5) + "px")
                .style("top", (event.pageY - 28) + "px");
        })
        .on("mouseout", (event, d) => {
            tooltip.transition()
                .duration(500)
                .style("opacity", 0);
        });

    // Zoom functionality
    const zoom = d3.zoom()
        .scaleExtent([1, 10])
        .translateExtent([[0, 0], [width, height]])
        .on("zoom", (event) => {
            svg.attr("transform", event.transform);
        });

    svg.call(zoom);
});

