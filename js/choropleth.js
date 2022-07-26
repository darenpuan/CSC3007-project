// let width = 500,
// height = 250;
let width = 1000,
height = 500;

let svg = d3.select(".map").attr("width", width).attr("height", height);
// Map and projection

let projection = d3.geoEquirectangular();
let geopath = d3.geoPath().projection(projection);

// Load GeoJSON data
Promise.all([
d3.json("./worldgeo.json"),
d3.csv("./owid-co2-data.csv"),
]).then((data) => {
// console.log(data[0].features[0].properties.name)
// console.log(data[0].features.length)
map = data[0].features;
co2Data = data[1];
console.log(map[0].properties.name);
dataJson = {};
for (let i = 0; i < map.length; i++) {
  for (let x = 0; x < co2Data.length; x++) {
    if (
      map[i].properties.name.toUpperCase() ==
      co2Data[x].country.toUpperCase()
    ) {
      try {
        var countryName = dataJson[map[i].properties.name];
        dataJson[map[i].properties.name][co2Data[x].year] =
          co2Data[x].co2;
      } catch {
        dataJson[map[i].properties.name] = {};
        dataJson[map[i].properties.name][co2Data[x].year] =
          co2Data[x].co2;
      }
    }
  }
}
console.log(dataJson["Afghanistan"][1964]);
// console.log(dataJson["Singapore"][2001])

console.log(dataJson);

// console.log(data);
// console.log(data.features);
// console.log((d) => geopath(d));

// Draw the map
svg
  .append("g")
  .attr("id", "countries")
  .selectAll("path")
  .data(data[0].features)
  .enter()
  .append("path")
  .attr("d", (d) => geopath(d))
  .attr("fill", "#777")
  .attr("stroke", "#fff")
  .attr("stroke-width", 0.5);
});