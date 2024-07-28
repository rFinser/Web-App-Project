function getRestaurantName() {
    return window.location.href.split("/").slice(-1)[0];
}

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
    const height = 900;
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
        .domain([0, findMax(productsData) + 5])
        .range([height - margin.bottom, margin.top]);
    
    const tooltip = d3.select("#tooltip");

    svg.selectAll("rect")
        .data(productsData.sort((a, b) => d3.descending(a.count, b.count)))
        .join("rect")
        .attr("x", (d, i) => x(i))
        .attr("y", d => y(d.count))
        .attr("height", d => y(0) - y(d.count))
        .attr("width", x.bandwidth())
        .attr("fill", "green")
        .on("mouseover", function(event, d) {
            tooltip.style("opacity", 1);
        })
        .on("mousemove", function(event, d) {
            tooltip
                .html(`${d.count}`)
                .style("left", (event.pageX - 30) + "px")
                .style("top", (event.pageY - 10) + "px");
        })
        .on("mouseout", function(d) {
            tooltip.style("opacity", 0);
        });
    
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