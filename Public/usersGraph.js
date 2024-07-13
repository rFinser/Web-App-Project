
//render graph of users registered on each month
$(async function (){
    const usersData = await getUsersData();
    
    const margin = {top: 50, right: 50, bottom: 50, left: 50};
    const width = 1200 - margin.left - margin.right;
    const height = 500 - margin.top - margin.bottom;

    const x = d3.scaleTime()
        .range([0, width])

    const y = d3.scaleLinear()
        .range([height, 0])

    const svg = d3.select("#graph")
        .append("svg")
            .attr("width", width + margin.right + margin.left)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform", `translate(${margin.left}, ${margin.top})`)
    
    x.domain(d3.extent(usersData, e => e.month))
    y.domain([0, d3.max(usersData, e => e.users)])

    svg.append("g")
        .attr("transform", `translate(0, ${height})`)
        .call(d3.axisBottom(x)
            .tickFormat((d, i) => getDate(i)));


    svg.append("g")
        .call(d3.axisLeft(y));

    const line = d3.line()
        .x(e => x(e.month))
        .y(e => y(e.users));

    svg.append("path")
        .datum(usersData)
        .attr("fill", "none")
        .attr("stroke", "royalblue")
        .attr("stroke-width", 1)
        .attr("d", line);
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
        url: `/users/${month}`,
        success: (data) => {return data}
    })
}