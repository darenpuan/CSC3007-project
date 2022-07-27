let width = 1000,
        height = 600;
      let svg = d3.select("svg").attr("width", width).attr("height", height);

      // populate drop-down
      var selected_dataset = 1950;
      d3.select("#dropdown")
        .selectAll("option")
        // .attr('position', 'absolute')
        // .attr('top', '50px')
        // .attr('left', '80px')
        .data(dropdown_options)
        .enter()
        .append("option")
        .attr("value", function (option) {
          return option.year;
        })
        .text(function (option) {
          return option.year;
        });

      var dropDown = d3.select("#dropdown");
      dropDown.on("change", function () {
        console.log("clicked year: ", d3.select("#dropdown").property("value"));
        console.log("clicked");
        selected_dataset = d3.select("#dropdown").property("value");
        updateMap(selected_dataset);
      });

      function updateMap(selected_dataset) {
        map
          // .selectAll("path")
          .transition()
          .duration(400)
          .attr("fill", function (d) {
            console.log(d.length);
            for (let i = 0; i < countryList.length; i++) {
              if (d.properties.name == countryList[i]) {
                if (
                  dataJson[countryList[i]][selected_dataset] > 0 &&
                  dataJson[countryList[i]][selected_dataset] <= 100
                ) {
                  return "#FBDCDC";
                } else if (
                  dataJson[countryList[i]][selected_dataset] > 100 &&
                  dataJson[countryList[i]][selected_dataset] <= 500
                ) {
                  return "#FFD4C9";
                } else if (
                  dataJson[countryList[i]][selected_dataset] > 500 &&
                  dataJson[countryList[i]][selected_dataset] <= 1000
                ) {
                  return "#FBB7B5";
                } else if (
                  dataJson[countryList[i]][selected_dataset] > 1000 &&
                  dataJson[countryList[i]][selected_dataset] <= 4000
                ) {
                  return "#F9A5A0";
                } else if (
                  dataJson[countryList[i]][selected_dataset] > 4000 &&
                  dataJson[countryList[i]][selected_dataset] <= 10000
                ) {
                  return "#F5928C";
                } else if (
                  dataJson[countryList[i]][selected_dataset] > 10000 &&
                  dataJson[countryList[i]][selected_dataset] <= 40000
                ) {
                  return "#F17F76";
                } else if (
                  dataJson[countryList[i]][selected_dataset] > 40000 &&
                  dataJson[countryList[i]][selected_dataset] <= 100000
                ) {
                  return "#EB6C61";
                } else if (
                  dataJson[countryList[i]][selected_dataset] > 100000 &&
                  dataJson[countryList[i]][selected_dataset] <= 200000
                ) {
                  return "#E4594B";
                } else if (
                  dataJson[countryList[i]][selected_dataset] > 200000 &&
                  dataJson[countryList[i]][selected_dataset] <= 300000
                ) {
                  return "#DC4435";
                } else if (
                  dataJson[countryList[i]][selected_dataset] > 300000
                ) {
                  return "#D32C1E";
                } else {
                  return "#D7DCFC";
                }
              }
              if (
                d.properties.name == "French Southern and Antarctic Lands" ||
                d.properties.name == "Western Sahara"
              ) {
                return "#D7DCFC";
              }
            }
          });
      }
      var geomap;
      let legendRetangleSize = 30;
      var countryList = [];
      let legends = [
        { label: "No Data", color: "#D7DCFC" },
        { label: 0, color: "#FBDCDC" },
        { label: 100, color: "#FFD4C9" },
        { label: 500, color: "#fbb7b5" },
        { label: 1000, color: "#f9a5a0" },
        { label: 4000, color: "#f5928c" },
        { label: 10000, color: "#f17f76" },
        { label: 40000, color: "#eb6c61" },
        { label: 100000, color: "#e4594b" },
        { label: 200000, color: "#dc4435" },
        { label: 300000, color: "#d32c1e" },
      ];

      // Map and projection
      let projection = d3.geoEquirectangular();
      let geopath = d3.geoPath().projection(projection);

      // Load GeoJSON data
      Promise.all([
        d3.json("./worldgeo.json"),
        d3.csv("./owid-co2-data.csv"),
      ]).then((data) => {
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
                  co2Data[x].cumulative_co2;
              } catch {
                dataJson[map[i].properties.name] = {};
                dataJson[map[i].properties.name][co2Data[x].year] =
                  co2Data[x].cumulative_co2;
              }
            }
          }
        }

        console.log(typeof dataJson["Afghanistan"]);
        // console.log(typeof (dataJson["Singapore"][2001]))

        console.log(dataJson);
        for (var property in dataJson) {
          if (dataJson.hasOwnProperty(property)) {
            // do stuff
            // console.log("property:", property);
            countryList.push(property);

            // console.log("value:", dataJson[property]);
          }
        }
        console.log("country list:", countryList);

        // find the co2 max and min values
        const co2_values = [];
        for (const property in dataJson) {
          console.log(`${property}: ${dataJson[property]}`);
          let arr = Object.values(dataJson[property]);
          let min = Math.min(...arr);
          let max = Math.max(...arr);
          co2_values.push(min, max);
          // console.log(`Min value: ${min}, max value: ${max}`);
        }
        // console.log(co2_values);
        min_co2_value = Math.min(...co2_values);
        max_co2_value = Math.max(...co2_values);
        console.log("min co2: ", min_co2_value);
        console.log("max co2: ", max_co2_value);
        function displayData(d, selected_dataset) {
          try {
            if (
              dataJson[d.properties.name][selected_dataset] == undefined ||
              dataJson[d.properties.name][selected_dataset] == ""
            ) {
              dataString = d.properties.name +": No Data";

            }
            else {
              dataString =
                d.properties.name +
                ": \n" +
                dataJson[d.properties.name][selected_dataset] + " Million Tonnes";
            }
            return dataString;
          } catch {
            dataString = d.properties.name + ": No Data";
            console.log("catch: " + d.properties.name);
            return dataString;
          }
        }

        // Draw the map
        map = svg
        
          .append("g")
          .attr("id", "countries")
          .selectAll("path")
          .data(data[0].features)
          .enter()
          .append("path")
          .attr("d", (d) => geopath(d))
          .attr("stroke", "#808080")
          .attr("stroke-width", 0.5)

          .on("mouseover", (event, d) => {
            d3.select(".tooltip")
              .text(displayData(d, selected_dataset))
              .style("position", "absolute")
              // .style("background", "white")
              .style("left", event.pageX + "px")
              .style("top", event.pageY+200 + "px")
              .style("line-height", "1")
              .style("padding", "12px")
              .style("background", "rgba(43,43,43, 0.8)")
              .style("color", "#fff")
              .style("border-radius", "2px")
              .style("opacity",1);

            d3.select(event.currentTarget)
              .style("stroke", "#3f4741")
              .style("stroke-width", 2);
          })
          .on("mouseout", (event, d) => {
            d3.select(".tooltip").text("").style("opacity",0);

            d3.select(event.currentTarget)
              .style("stroke", "#2F3030")
              .style("stroke-width", 0.5);
          });

        // .call(selected_dataset)
        updateMap(selected_dataset);

        // changeColor();
      });

      // add legends start
      let legendsMap = svg.append("g").attr("id", "legends");
      legendsMap
        .selectAll("rect")
        .data(legends)
        .enter()
        .append("rect")
        .attr("x", function (d, i) {
          return (i === 0 ? 50 : 150) + i * (legendRetangleSize * 2);
        })
        // .attr("x", function (d, i) {
        //   return (i === 1 ? 150 : 250) + i * (legendRetangleSize * 2);
        // })
        .attr("y", function (d, i) {
          return 500 + (legendRetangleSize + 5);
        })
        .attr("width", legendRetangleSize * 2)
        .attr("height", legendRetangleSize)
        .style("fill", function (d) {
          return d.color;
        });

      // LEGENDS TEXT
      legendsMap
        .selectAll("text")
        .data(legends)
        .enter()
        .append("text")
        .style("font", "14px times")
        .text(function (d) {
          return d.label;
        })
        .attr("text-anchor", "left")
        .attr("x", function (d, i) {
          return (i === 0 ? 50 : 150) + i * (legendRetangleSize * 2);
        })
        // .attr("x", function (d, i) {
        //   return (i === 1 ? 150 : 250) + i * (legendRetangleSize * 2);
        // })
        .attr("y", function (d, i) {
          return 500 + legendRetangleSize;
        });
      // add legends end