document.addEventListener("DOMContentLoaded", function () {
    let currentSection = 0;
    const sections = document.querySelectorAll(".section");
    sections[currentSection].classList.add("active");

    const nextSection = () => {
        sections[currentSection].classList.remove("active");
        currentSection = (currentSection + 1) % sections.length;
        sections[currentSection].classList.add("active");
    };

    setInterval(nextSection, 5000);
});

// Load data and create visualizations
d3.csv("data.csv").then(data => {
    data.forEach(d => {
        d.Year = +d.Year;
        d['Annual CO₂ emissions'] = +d['Annual CO₂ emissions'];
    });

    const margin = { top: 20, right: 30, bottom: 40, left: 50 },
        width = 800 - margin.left - margin.right,
        height = 600 - margin.top - margin.bottom;

    function createChart(elementId, filterYear, title) {
        const svg = d3.select(elementId)
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const filteredData = data.filter(d => d.Year === filterYear);

        const x = d3.scaleBand()
            .domain(filteredData.map(d => d.Entity))
            .range([0, width])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(filteredData, d => d['Annual CO₂ emissions'])])
            .nice()
            .range([height, 0]);

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).tickFormat(d => d));

        svg.append("g")
            .call(d3.axisLeft(y).tickFormat(d3.format(".2s")));

        svg.selectAll(".bar")
            .data(filteredData)
            .enter().append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.Entity))
            .attr("y", d => y(d['Annual CO₂ emissions']))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d['Annual CO₂ emissions']))
            .style("fill", "steelblue");

        svg.append("text")
            .attr("x", width / 2)
            .attr("y", -margin.top / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .style("font-weight", "bold")
            .text(title);

        const annotations = filteredData.map(d => ({
            note: { label: `${d.Entity}: ${d3.format(".2s")(d['Annual CO₂ emissions'])} Mt`, title: "CO2 Emissions" },
            x: x(d.Entity) + x.bandwidth() / 2,
            y: y(d['Annual CO₂ emissions']),
            dy: -10,
            dx: 10
        }));

        const makeAnnotations = d3.annotation()
            .type(d3.annotationLabel)
            .annotations(annotations);

        svg.append("g")
            .call(makeAnnotations);
    }

    createChart("#viz1", 1949, "CO2 Emissions in 1949");
    createChart("#viz2", 1950, "CO2 Emissions in 1950");
    createChart("#viz3", 1951, "CO2 Emissions in 1951");
});
