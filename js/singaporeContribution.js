 // set the dimensions and margins of the graph
 const margin = { top: 10, right: 30, bottom: 30, left: 60 },
 width1 = 460 - margin.left - margin.right,
 height1 = 400 - margin.top - margin.bottom;

// append the svg object to the body of the page
const svg1 = d3
 .select("#lineChart")
 .append("svg")
 .attr("width", width1 + margin.left + margin.right)
 .attr("height", height1 + margin.top + margin.bottom)
 .append("g")
 .attr("transform", `translate(${margin.left}, ${margin.top})`);

//Read the data
d3.csv("./owid-co2-data.csv").then(function (data) {
 let sg = [];

 for (let i = 0; i < data.length; i++) {
   if (data[i].country.toUpperCase() == "SINGAPORE") {
     sg[data[i].year] = data[i];
   }
 }

 const filteredSG = _.filter(sg, Boolean);
 console.log(filteredSG);

 //   delete filteredSG[0].cement_co2
 // console.log(Object.keys(filteredSG[1]))

 //   for(let x=0; x<filteredSG.length; x++){
 //     console.log(filteredSG[x].co2)
 //   }

 const allYear = new Set(filteredSG.map((d) => d.year));
 console.log(allYear);
 // var allType = Object.keys(filteredSG[1]);
 var allType = [
   "co2",
   "trade_co2",
   // "cement_co2",
   "coal_co2",
   "gas_co2",
   "oil_co2",
   "co2_per_gdp",
   "co2_per_unit_energy",
   "consumption_co2",
   "consumption_co2_per_capita",
   "consumption_co2_per_gdp",
   "cumulative_co2",
   "cumulative_coal_co2",
   "cumulative_gas_co2",
   "cumulative_oil_co2",
   "trade_co2_share",
   "total_ghg",
   "ghg_per_capita",
   "methane",
   "nitrous_oxide",
   "energy_per_capita",
 ];

 console.log(allType);
 let selected = "co2";

 // add the options to the button
 d3.select("#selectButton")
   .selectAll("options")
   .data(allType)
   .enter()
   .append("option")
   .text(function (d) {
     return d;
   })
   .attr("value", function (d) {
     return d;
   });

 d3.select("#selectButton").on("change", function (event, d) {
   const selectOption = d3.select(this).property("value");
   // console.log(selectOption);
   update(selectOption);
 });

 function update(selectOption) {
   const dataFilter = filteredSG.filter(function (d) {
     // console.log(d[selectOption]);
     selected = selectOption;
     return d[selectOption];
   });

   y.domain([
     0,
     d3.max(filteredSG, function (d) {
       return +d[selectOption];
     }),
   ])
   .range([height1, 0]);

   // svg.append("g").call(d3.axisLeft(y));
   line
     .datum(dataFilter)
     .transition()
     .duration(1000)
     .attr(
       "d",
       d3
         .line()
         .x(function (d) {
           return x(d.year);
         })
         .y(function (d) {
           return y(+d[selectOption]);
         })
     )
     .attr("stroke", function (d) {
       return myColor(selectOption);
     });
 }

 var myColor = d3.scaleOrdinal().domain(allType).range(d3.schemeSet2);

 var x = d3
   .scaleLinear()
   .domain(
     d3.extent(filteredSG, function (d) {
       return d.year;
     })
   )
   .range([0, width1]);
 svg1
   .append("g")
   .attr("transform", "translate(0," + height1 + ")")
   .call(d3.axisBottom(x).ticks(7));

 // Add Y axis
 var y = d3
   .scaleLinear()
   .domain([
     0,
     d3.max(filteredSG, function (d) {
       return +d[selected];
     }),
   ])
   .range([height1, 0]);
 svg1.append("g").call(d3.axisLeft(y));

 // Initialize line with first group of the list
 var line = svg1
   .append("g")
   .append("path")
   .datum(
     filteredSG.filter(function (d) {
       return allType[0];
     })
   )
   .attr(
     "d",
     d3
       .line()
       .x(function (d) {
         return x(d.year);
       })
       .y(function (d) {
         return y(+d[selected]);
       })
   )
   .attr("stroke", function (d) {
     return myColor("valueA");
   })
   .style("stroke-width", 4)
   .style("fill", "none");
});