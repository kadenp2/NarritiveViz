// Initialize global variables
var sceneId = 0;
var scenes = ['CO2', 'LifeExpectancy', 'Obesity', 'Joint'];
var co2Data, lifeExpectancyData, obesityData;

function initVisualization() {
    d3.csv('CO2emissions.csv').then(function(data) {
        co2Data = data;
        return d3.csv('life-expectancy.csv');
    }).then(function(data) {
        lifeExpectancyData = data;
        return d3.csv('obesitydata.csv');
    }).then(function(data) {
        obesityData = data;
        loadScene();
    }).catch(function(error) {
        console.error('Error loading data: ', error);
    });
}

function loadScene() {
    clearChart();
    clearAnnotation();
    var scene = scenes[sceneId];
    if (scene === 'CO2') {
        loadCO2Chart();
        annotateCO2();
    } else if (scene === 'LifeExpectancy') {
        loadLifeExpectancyChart();
        annotateLifeExpectancy();
    } else if (scene === 'Obesity') {
        loadObesityChart();
        annotateObesity();
    } else if (scene === 'Joint') {
        loadJointChart();
        annotateJoint();
    }
}

function nextScene() {
    if (sceneId < scenes.length - 1) {
        sceneId++;
        loadScene();
    }
}

function previousScene() {
    if (sceneId > 0) {
        sceneId--;
        loadScene();
    }
}

function clearChart() {
    d3.select("#chart").html("");
}

function clearAnnotation() {
    d3.select("#annotation").html("");
}

function loadCO2Chart() {
    const margin = { top: 20, right: 80, bottom: 50, left: 50 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    co2Data.forEach(d => {
        d.Year = +d.Year;
        d['Annual CO₂ emissions'] = +d['Annual CO₂ emissions'];
    });

    var nestedData = d3.group(co2Data, d => d.Entity);

    const x = d3.scaleTime()
        .domain(d3.extent(co2Data, d => d.Year))
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(co2Data, d => d['Annual CO₂ emissions'])])
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
}

function annotateCO2() {
    d3.select("#annotation").html("<p>CO2 emissions annotation: This chart shows the annual CO₂ emissions for various countries over the years. Observe the trends and variations in emissions.</p>");
}

function loadLifeExpectancyChart() {
    const margin = { top: 20, right: 80, bottom: 50, left: 50 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    lifeExpectancyData.forEach(d => {
        d.Year = +d.Year;
        d['Life expectancy'] = +d['Life expectancy'];
    });

    var nestedData = d3.group(lifeExpectancyData, d => d.Entity);

    const x = d3.scaleTime()
        .domain(d3.extent(lifeExpectancyData, d => d.Year))
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(lifeExpectancyData, d => d['Life expectancy'])])
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
}

function annotateLifeExpectancy() {
    d3.select("#annotation").html("<p>Life expectancy annotation: This chart shows the life expectancy for various countries over the years. Notice the general trends of increasing life expectancy and identify any anomalies.</p>");
}

function loadObesityChart() {
    const margin = { top: 20, right: 80, bottom: 50, left: 50 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    obesityData.forEach(d => {
        d.Year = +d.Year;
        d['Obesity rate'] = +d['Obesity rate'];
    });

    var nestedData = d3.group(obesityData, d => d.Entity);

    const x = d3.scaleTime()
        .domain(d3.extent(obesityData, d => d.Year))
        .range([0, width]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(obesityData, d => d['Obesity rate'])])
        .nice()
        .range([height, 0]);

    const line = d3.line()
        .x(d => x(d.Year))
        .y(d => y(d['Obesity rate']));

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
}

function annotateObesity() {
    d3.select("#annotation").html("<p>Obesity annotation: This chart shows the obesity rate for various countries over the years. Observe the trends and identify any significant changes or patterns.</p>");
}

function loadJointChart() {
    const margin = { top: 20, right: 80, bottom: 50, left: 50 },
        width = 960 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    const svg = d3.select("#chart")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    co2Data.forEach(d => {
        d.Year = +d.Year;
        d['Annual CO₂ emissions'] = +d['Annual CO₂ emissions'];
    });

    lifeExpectancyData.forEach(d => {
        d.Year = +d.Year;
        d['Life expectancy'] = +d['Life expectancy'];
    });

    obesityData.forEach(d => {
        d.Year = +d.Year;
        d['Obesity rate'] = +d['Obesity rate'];
    });

    const x = d3.scaleTime()
        .domain(d3.extent(co2Data, d => d.Year))
        .range([0, width]);

    const yLeft = d3.scaleLinear()
        .domain([0, d3.max(co2Data, d => d['Annual CO₂ emissions'])])
        .nice()
        .range([height, 0]);

    const yRight = d3.scaleLinear()
        .domain([0, d3.max(lifeExpectancyData, d => d['Life expectancy'])])
        .nice()
        .range([height, 0]);

    const lineCO2 = d3.line()
        .x(d => x(d.Year))
        .y(d => yLeft(d['Annual CO₂ emissions']));

    const lineLifeExpectancy = d3.line()
        .x(d => x(d.Year))
        .y(d => yRight(d['Life expectancy']));

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x).tickFormat(d3.format("d")));

    svg.append("g")
        .call(d3.axisLeft(yLeft));

    svg.append("g")
        .attr("transform", `translate(${width},0)`)
        .call(d3.axisRight(yRight));

    svg.append("path")
        .datum(co2Data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", lineCO2);

    svg.append("path")
        .datum(lifeExpectancyData)
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 1.5)
        .attr("d", lineLifeExpectancy);

    const nestedObesityData = d3.group(obesityData, d => d.Entity);

    nestedObesityData.forEach((values, key) => {
        svg.append("path")
            .datum(values)
            .attr("fill", "none")
            .attr("stroke", d3.schemeCategory10[Math.floor(Math.random() * 10)])
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(d => x(d.Year))
                .y(d => yRight(d['Obesity rate'])));
    });

    const legend = svg.selectAll(".legend")
        .data(nestedObesityData.keys())
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
}

function annotateJoint() {
    d3.select("#annotation").html("<p>Joint annotation: This chart shows the annual CO₂ emissions, life expectancy, and obesity rate for various countries over the years. Compare and contrast the trends in these variables.</p>");
}

document.getElementById("bh").addEventListener("click", homeScene);
document.getElementById("bp").addEventListener("click", previousScene);
document.getElementById("bn").addEventListener("click", nextScene);

window.onload = initVisualization;

    
