d3.csv('C02emissions.csv').then(c02Data => {
    d3.csv('obesitydata.csv').then(obesityData => {
        d3.csv('life-expectancy.csv').then(lifeExpectancyData => {
            let mergedData = c02Data.map(d => {
                let obesity = obesityData.find(o => o.Country === d.Country && o.Year === d.Year);
                let lifeExpectancy = lifeExpectancyData.find(l => l.Country === d.Country && l.Year === d.Year);
                return {
                    Country: d.Country,
                    Year: +d.Year,
                    CO2Emissions: +d.CO2Emissions,
                    Obesity: obesity ? +obesity.Obesity : null,
                    LifeExpectancy: lifeExpectancy ? +lifeExpectancy.LifeExpectancy : null
                };
            });

            initVisualization(mergedData);
        });
    });
});

function initVisualization(data) {
    // Create scenes
    createScene1(data);
    createScene2(data);
    createScene3(data);
}

function createScene1(data) {
    let svg = d3.select("#visualization").append("div").attr("id", "scene1").attr("class", "chart s0")
        .append("svg").attr("width", 800).attr("height", 600);

    let margin = { top: 50, right: 50, bottom: 50, left: 50 },
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

    let x = d3.scaleTime().range([0, width]);
    let y = d3.scaleLinear().range([height, 0]);

    let g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(d3.extent(data, d => d.Year));
    y.domain([0, d3.max(data, d => d.CO2Emissions)]);

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(10));

    g.append("g")
        .call(d3.axisLeft(y).ticks(10));

    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "steelblue")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(d => x(d.Year))
            .y(d => y(d.CO2Emissions))
        );

    // Add annotations
    const annotations = [
        {
            note: {
                label: "CO2 Emissions increased significantly.",
                title: "Significant Increase"
            },
            data: { Year: 2005, CO2Emissions: 4000 },
            dy: -100,
            dx: 100
        }
    ];

    addAnnotations(svg, annotations);
}

function createScene2(data) {
    let svg = d3.select("#visualization").append("div").attr("id", "scene2").attr("class", "chart s1")
        .append("svg").attr("width", 800).attr("height", 600);

    let margin = { top: 50, right: 50, bottom: 50, left: 50 },
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

    let x = d3.scaleTime().range([0, width]);
    let y = d3.scaleLinear().range([height, 0]);

    let g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(d3.extent(data, d => d.Year));
    y.domain([0, d3.max(data, d => d.Obesity)]);

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(10));

    g.append("g")
        .call(d3.axisLeft(y).ticks(10));

    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "red")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(d => x(d.Year))
            .y(d => y(d.Obesity))
        );
        const annotations = [
        {
            note: {
                label: "Obesity rates rose dramatically.",
                title: "Rising Obesity"
            },
            data: { Year: 2010, Obesity: 30 },
            dy: -80,
            dx: 80
        }
    ];

    addAnnotations(svg, annotations);
}

function createScene3(data) {
    let svg = d3.select("#visualization").append("div").attr("id", "scene3").attr("class", "chart s2")
        .append("svg").attr("width", 800).attr("height", 600);

    let margin = { top: 50, right: 50, bottom: 50, left: 50 },
        width = +svg.attr("width") - margin.left - margin.right,
        height = +svg.attr("height") - margin.top - margin.bottom;

    let x = d3.scaleTime().range([0, width]);
    let y = d3.scaleLinear().range([height, 0]);

    let g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    x.domain(d3.extent(data, d => d.Year));
    y.domain([0, d3.max(data, d => d.LifeExpectancy)]);

    g.append("g")
        .attr("transform", "translate(0," + height + ")")
        .call(d3.axisBottom(x).ticks(10));

    g.append("g")
        .call(d3.axisLeft(y).ticks(10));

    g.append("path")
        .datum(data)
        .attr("fill", "none")
        .attr("stroke", "green")
        .attr("stroke-width", 1.5)
        .attr("d", d3.line()
            .x(d => x(d.Year))
            .y(d => y(d.LifeExpectancy))
        );

    // Add annotations
    const annotations = [
        {
            note: {
                label: "Life expectancy has increased over time.",
                title: "Increasing Life Expectancy"
            },
            data: { Year: 2015, LifeExpectancy: 70 },
            dy: -60,
            dx: 60
        }
    ];

    addAnnotations(svg, annotations);
}

function addAnnotations(svg, annotations) {
    const makeAnnotations = d3.annotation()
        .type(d3.annotationLabel)
        .annotations(annotations);

    svg.append("g")
        .attr("class", "annotation-group")
        .call(makeAnnotations);
}
