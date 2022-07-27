let filteredSG;
    let descSG = {};
    var myChart;
    var color = {};

    function filterResult(query) {
      
        if (query.includes("_per_capita")) {
            label = "Singapaore (Tonnes Per Person)";
        } else if (query.includes("_per_gdp")) {
            label = "Singapore (KG per dollar of GDP)";
        } else {
            label = "Singapore (Million Tonnes)";
        }

        yData = []
        for (const valueSg of filteredSG) {
            yData.push(valueSg[query])
        }
        myChart.data.datasets[0].label = label;
        myChart.data.datasets[0].data = yData;
        myChart.data.datasets[0].borderColor = color[query];
        myChart.update();
        document.getElementById("desc").innerHTML = descSG[query];
    }

    //Read the data
    d3.csv("./owid-co2-data.csv").then(function (data) {
        let sg = [];

        for (let i = 0; i < data.length; i++) {
            if (data[i].country.toUpperCase() == "SINGAPORE") {
                sg[data[i].year] = data[i];
            }
        }
        filteredSG = _.filter(sg, Boolean);
        const allYear = new Set(filteredSG.map((d) => d.year));
        // console.log(filteredSG)

        var allType = [
            "co2",
            "trade_co2",
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

        var allColors = [
            "#ff6361",
            "#58508d",
            "#bc5090",
            "#ffa600",
            "#d45087",
            "#7DCEA0",
            "#A9CCE3",
            "#B7950B",
            "#873600",
            "#145A32",
            "#D7BDE2",
            "#E59866",
            "#C39BD3",
            "#138D75",
            "#641E16",
            "#797D7F",
            "#A2D9CE",
            "#D68910",
            "#7D3C98",
            "#ABEBC6"
        ];

        var counter = 0
        for (const type of allType) {
            color[type] = allColors[counter];
            counter++;
        }


        yData = []
        for (const valueSg of filteredSG) {
            yData.push(valueSg.co2)
        }

        for (const cat of allType) {
            $("#selectButton").append("<option value='" + cat + "'>" + cat + "</option>");
        }
        console.log(allYear)
        console.log(yData)

        const lineData = {
            labels: Array.from(allYear),
            datasets: [
                {
                    label: 'Singapore (Million Tonnes)',
                    data: yData,
                    fill: false,
                    borderColor: '#ff6361',
                    backgroundColor: 'rgb(255, 99, 132, 0.5)',
                }
            ]
        };

        myChart = new Chart("lineChart", {
            type: "line",
            data: lineData,
            options: {
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    xAxes: [{
                        ticks: {
                            display: true,
                            autoSkip: true,
                            maxTicksLimit: 7
                        }
                    }]
                },
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    title: {
                        display: true,
                        text: 'Singapore Carbon Emission'
                    }
                }
            },
        });

        //Read the data
        d3.csv("./owid-co2-codebook.csv").then(function (data) {
            for (let i = 0; i < data.length; i++) {
                var colName = data[i].column;
                if (allType.includes(colName)) {
                    descSG[colName] = data[i].description;
                }
            }
            document.getElementById("desc").innerHTML = descSG['co2'];
        })
    });
