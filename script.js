// script.js

// Set the dimensions and margins of the graph
const margin = { top: 20, right: 80, bottom: 50, left: 50 },
    width = 960 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;

// Append the SVG object to the body of the page
const svg = d3.select("#chart")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

// Load the data
d3.csv("CO2emissions.csv").then(function (data) {

    // Parse the data
    data.forEach(d => {
        d.Year = +d.Year;
        d['Annual CO₂ emissions'] = +d['Annual CO₂ emissions'];
    });

    console.log("Parsed data:", data); // Log the parsed data for debugging

    // Group the data by entity
    const nestedData = d3.group(data, d => d.Entity);
    console.log("Nested data:", nestedData); // Log the nested data for debugging

    // Set the scales
    const x = d3.scaleTime()
        .domain(d3.extent(data, d => d.Year))
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(data, d => d['Annual CO₂ emissions'])])
        .nice()
        .range([height, 0]);

    // Define the line
    const line = d3.line()
        .x(d => x(d.Year))
        .y(d => y(d['Annual CO₂ emissions']));

    // Add the X axis
    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    // Add the Y axis
    svg.append("g")
        .call(d3.axisLeft(y));

    // Add the lines
    nestedData.forEach((values, key) => {
        svg.append("path")
            .datum(values)
            .attr("fill", "none")
            .attr("stroke", d3.schemeCategory10[Math.floor(Math.random() * 10)])
            .attr("stroke-width", 1.5)
            .attr("d", line);
    });

    // Add legend
    const legend = svg.selectAll(".legend")
        .data(nestedData.keys())
        .enter().append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(0,${i * 20})`);

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", d3.schemeCategory10[Math.floor(Math.random() * 10)]);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(d => d);

}).catch(error => {
    console.error("Error loading the data: ", error);
});
