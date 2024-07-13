$(async function () {
    $.ajax({
        type: 'POST',
        url: '/restaurantOrders',
        data: { restaurant: getRestaurantName() },
        success: data => { renderGraph(data.products) },
        error: () => { console.error(`Error getting data for: ${getRestaurantName()}`) }
    })
});

function renderGraph(productsData) {

    const width = 800;
    const height = 400;
    const margin = {top: 50, bottom: 50, left: 50, right: 50};

    const svg = d3.select("#graph")
       .append("svg")
       .attr("height", height - margin.top - margin.bottom)
       .attr("width", width - margin.right - margin.left)
       .attr("viewBox", [0, 0, width, height]);

    const x = d3.scaleBand()
        .domain(d3.range(productsData.length))
        .range([margin.left, width - margin.right])
        .padding(0.1);

    const y = d3.scaleLinear()
        .domain([0, findMax(productsData) + 10])
        .range([height - margin.bottom, margin.top]);
    
    svg.append("g")
        .attr("fill", "royalblue")
        .selectAll("rect")
        .data(productsData.sort((a, b) => d3.descending(a.count, b.count)))
        .join("rect")
          .attr("x", (d, i) => x(i))
          .attr("y", d => y(d.count))
          .attr("height", d => y(0) - y(d.count))
          .attr("width", x.bandwidth())
    
    function xAxis(g){
        g.attr("transform", `translate(0, ${height - margin.bottom})`);
        g.call(d3.axisBottom(x).tickFormat(i => productsData[i].name))
        .attr("font-size", "18px");
    }

    function yAxis(g){
        g.attr("transform", `translate(${margin.left}, 0)`)
         .call(d3.axisLeft(y).ticks(null, productsData.count))
    }
    
    svg.append("g").call(xAxis);
    svg.append("g").call(yAxis);
    svg.node();
}

function findMax(arr){
    let max = arr[0].count
    for (element of arr){
        if (element.count > max)
            max = element.count
    }
    return max;
}