// Initialize global variables
var sceneId = 0;
var dataPath = '';
var co2DataPath = 'CO2emissions.csv';
var lifeExpectancyDataPath = 'life-expectancy.csv';

function homeScene() {
    sceneId = 0;
    document.getElementById("bp").style.visibility = 'hidden';
    document.getElementById("bn").style.visibility = 'hidden';
    document.getElementById("bh").style.visibility = 'hidden';
    document.getElementById("introDivId").style.display = "block";
    d3.select("#sourceDivId").html("");
    clearChart();
}

function initVisualization() {
    document.getElementById("bn").disabled = false;
    document.getElementById("bp").style.visibility = 'visible';
    document.getElementById("bn").style.visibility = 'visible';
    document.getElementById("bh").style.visibility = 'visible';
    document.getElementById("introDivId").style.display = "none";
    nextScene(0);
    d3.select("#sourceDivId").html("<p>*Original data source: <a href='https://data-source-url'>Data Source</a></p>");
}

function nextScene(clickId) {
    if (clickId != 0) {
        sceneId = clickId - 1;
    }
    sceneId += 1;
    clearChart();
    loadChart(sceneId);
}

function previousScene() {
    if (sceneId > 1) {
        sceneId -= 1;
        clearChart();
        loadChart(sceneId);
    }
}

function clearChart() {
    d3.select("#chart").html("");
}

function loadChart(sceneId) {
    if (sceneId % 2 === 1) {
        dataPath = co2DataPath;
        loadCO2Chart();
    } else {
        dataPath = lifeExpectancyDataPath;
        loadLifeExpectancyChart();
    }
}

function loadCO2Chart() {
    d3.csv(dataPath).then(function(data) {
        data.forEach(d => {
            d.Year = +d.Year;
            d['Annual CO₂ emissions'] = +d['Annual CO₂ emissions'];
        });

        var nestedData = d3.group(data, d => d.Entity);

        const margin = { top: 20, right: 80, bottom: 50, left: 50 },
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        const svg = d3.select("#chart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleTime()
            .domain(d3.extent(data, d => d.Year))
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d['Annual CO₂ emissions'])])
            .nice()
            .range([height, 0]);

        const line = d3.line()
            .x(d => x(d.Year))
            .y(d => y(d['Annual CO₂ emissions']));

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).tickFormat(d3.format("d")));

        svg.append("g")
            .call(d3.axisLeft(y));

        nestedData.forEach((values, key) => {
            svg.append("path")
                .datum(values)
                .attr("fill", "none")
                .attr("stroke", d3.schemeCategory10[Math.floor(Math.random() * 10)])
                .attr("stroke-width", 1.5)
                .attr("d", line);
        });

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
}

function loadLifeExpectancyChart() {
    d3.csv(dataPath).then(function(data) {
        data.forEach(d => {
            d.Year = +d.Year;
            d['Life expectancy'] = +d['Life expectancy'];
        });

        var nestedData = d3.group(data, d => d.Entity);

        const margin = { top: 20, right: 80, bottom: 50, left: 50 },
            width = 960 - margin.left - margin.right,
            height = 500 - margin.top - margin.bottom;

        const svg = d3.select("#chart")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const x = d3.scaleTime()
            .domain(d3.extent(data, d => d.Year))
            .range([0, width]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(data, d => d['Life expectancy'])])
            .nice()
            .range([height, 0]);

        const line = d3.line()
            .x(d => x(d.Year))
            .y(d => y(d['Life expectancy']));

        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x).tickFormat(d3.format("d")));

        svg.append("g")
            .call(d3.axisLeft(y));

        nestedData.forEach((values, key) => {
            svg.append("path")
                .datum(values)
                .attr("fill", "none")
                .attr("stroke", d3.schemeCategory10[Math.floor(Math.random() * 10)])
                .attr("stroke-width", 1.5)
                .attr("d", line);
        });

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
}

document.getElementById("bh").addEventListener("click", homeScene);
document.getElementById("bp").addEventListener("click", previousScene);
document.getElementById("bn").addEventListener("click", nextScene);

window.onload = initVisualization;
