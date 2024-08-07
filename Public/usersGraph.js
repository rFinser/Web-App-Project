
//render graph of users registered on each month
$(async function (){
    const usersData = await getUsersData();
    
    const margin = {top: 50, right: 50, bottom: 50, left: 50};
    const width = 1200 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;


    const x = d3.scaleBand()
        .domain(d3.range(usersData.length))
        .range([0, width])
        .padding(0.1)

    const y = d3.scaleLinear()
        .range([height, 0])
        .domain([0, d3.max(usersData, e => e.users) + 20]) // the *20* here is a placeholder until we will have more data https://stackoverflow.com/questions/13599118/how-to-remove-decimal-point-from-my-y-axis-scale-in-d3js-graph

    const svg = d3.select("#graph")
        .append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)


    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x)
            .tickFormat((d, i) => getDate(i)));


    svg.append("g")

        .call(d3.axisLeft(y)
        .tickFormat(d3.format(".0f")));

    svg.append("g")
        .attr("fill", "#fff")
        .selectAll("rect")
        .data(usersData)
        .join("rect")
          .attr("class", "bar")
          .attr("x", (d, i) => x(i))
          .attr("y", d => y(d.users))
          .attr("height", d => y(0) - y(d.users))
          .attr("width", x.bandwidth())

    svg.append("style")
        .text(`
            .bar:hover {
              fill: #C8C8C8;
              transition: fill 0.3s ease;
            }
        `);
})

function getDate(i){
    return ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"][i];
}

async function getUsersData(){
    let usersData = [];
    for (let month=1; month <= 12; month++){
        const users = await getUsersRegisteredOnMonth(month);
        usersData.push({month, users: users.users.length})
    }

    return usersData;
}

async function getUsersRegisteredOnMonth(month){
    return $.ajax({
        type: 'POST',
        url: `/users/${month}`,
        success: (data) => {return data}
    })
}