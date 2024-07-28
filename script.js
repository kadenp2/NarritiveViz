// script.js

// Load the datasets
Promise.all([
    d3.csv('/mnt/data/life-expectancy.csv'),
    d3.csv('/mnt/data/obesitydata.csv')
]).then(([lifeExpectancyData, obesityData]) => {
    // Preprocess data
    lifeExpectancyData.forEach(d => {
        d.Year = +d.Year;
        d.LifeExpectancy = +d.LifeExpectancy;
    });

    obesityData.forEach(d => {
        d.ObesityRate = +d.ObesityRate;
    });

    // Initial visualization parameters
    const width = 800;
    const height = 600;
    const margin = { top: 50, right: 50, bottom: 50, left: 50 };

    // Create SVG container
    const svg = d3.select('#visualization')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    // Scene 1: Life Expectancy over Time
    function scene1() {
        svg.selectAll('*').remove(); // Clear previous scene

        // Define scales
        const x = d3.scaleTime()
            .domain(d3.extent(lifeExpectancyData, d => d.Year))
            .range([margin.left, width - margin.right]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(lifeExpectancyData, d => d.LifeExpectancy)])
            .nice()
            .range([height - margin.bottom, margin.top]);

        // Define axes
        const xAxis = d3.axisBottom(x);
        const yAxis = d3.axisLeft(y);

        // Append axes
        svg.append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(xAxis);

        svg.append('g')
            .attr('transform', `translate(${margin.left},0)`)
            .call(yAxis);

        // Line generator
        const line = d3.line()
            .x(d => x(d.Year))
            .y(d => y(d.LifeExpectancy));

        // Append line
        svg.append('path')
            .datum(lifeExpectancyData)
            .attr('fill', 'none')
            .attr('stroke', 'steelblue')
            .attr('stroke-width', 1.5)
            .attr('d', line);

        // Append title
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', margin.top / 2)
            .attr('text-anchor', 'middle')
            .attr('font-size', '16px')
            .attr('font-weight', 'bold')
            .text('Life Expectancy Over Time');
    }

    // Scene 2: Obesity Rates by Country
    function scene2() {
        svg.selectAll('*').remove(); // Clear previous scene

        // Define scales
        const x = d3.scaleBand()
            .domain(obesityData.map(d => d.Country))
            .range([margin.left, width - margin.right])
            .padding(0.1);

        const y = d3.scaleLinear()
            .domain([0, d3.max(obesityData, d => d.ObesityRate)])
            .nice()
            .range([height - margin.bottom, margin.top]);

        // Define axes
        const xAxis = d3.axisBottom(x);
        const yAxis = d3.axisLeft(y);

        // Append axes
        svg.append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(xAxis)
            .selectAll('text')
            .attr('transform', 'rotate(-45)')
            .style('text-anchor', 'end');

        svg.append('g')
            .attr('transform', `translate(${margin.left},0)`)
            .call(yAxis);

        // Append bars
        svg.selectAll('.bar')
            .data(obesityData)
            .enter().append('rect')
            .attr('class', 'bar')
            .attr('x', d => x(d.Country))
            .attr('y', d => y(d.ObesityRate))
            .attr('width', x.bandwidth())
            .attr('height', d => height - margin.bottom - y(d.ObesityRate))
            .attr('fill', 'steelblue');

        // Append title
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', margin.top / 2)
            .attr('text-anchor', 'middle')
            .attr('font-size', '16px')
            .attr('font-weight', 'bold')
            .text('Obesity Rates by Country');
    }

    // Scene 3: Correlation between Life Expectancy and Obesity
    function scene3() {
        svg.selectAll('*').remove(); // Clear previous scene

        // Combine data based on country
        const combinedData = obesityData.map(ob => {
            const lifeExp = lifeExpectancyData.find(le => le.Country === ob.Country);
            return {
                Country: ob.Country,
                ObesityRate: ob.ObesityRate,
                LifeExpectancy: lifeExp ? lifeExp.LifeExpectancy : null
            };
        }).filter(d => d.LifeExpectancy !== null);

        // Define scales
        const x = d3.scaleLinear()
            .domain([0, d3.max(combinedData, d => d.ObesityRate)])
            .nice()
            .range([margin.left, width - margin.right]);

        const y = d3.scaleLinear()
            .domain([0, d3.max(combinedData, d => d.LifeExpectancy)])
            .nice()
            .range([height - margin.bottom, margin.top]);

        // Define axes
        const xAxis = d3.axisBottom(x);
        const yAxis = d3.axisLeft(y);

        // Append axes
        svg.append('g')
            .attr('transform', `translate(0,${height - margin.bottom})`)
            .call(xAxis);

        svg.append('g')
            .attr('transform', `translate(${margin.left},0)`)
            .call(yAxis);

        // Append scatter plot
        svg.selectAll('.dot')
            .data(combinedData)
            .enter().append('circle')
            .attr('class', 'dot')
            .attr('cx', d => x(d.ObesityRate))
            .attr('cy', d => y(d.LifeExpectancy))
            .attr('r', 5)
            .attr('fill', 'steelblue');

        // Append title
        svg.append('text')
            .attr('x', width / 2)
            .attr('y', margin.top / 2)
            .attr('text-anchor', 'middle')
            .attr('font-size', '16px')
            .attr('font-weight', 'bold')
            .text('Correlation between Life Expectancy and Obesity');
    }

    // Define parameters and triggers
    let currentScene = 0;
    const scenes = [scene1, scene2, scene3];

    function showNextScene() {
        currentScene = (currentScene + 1) % scenes.length;
        scenes[currentScene]();
    }

    // Initial scene
    scenes[currentScene]();

    // Trigger to show the next scene
    d3.select('body').on('click', showNextScene);
});
