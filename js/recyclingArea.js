$(document).ready(function () {
    $.getJSON(
      "https://developers.onemap.sg/privateapi/themesvc/retrieveTheme?queryName=ewaste&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjkwNDIsInVzZXJfaWQiOjkwNDIsImVtYWlsIjoibWljaC50YW4xOTk4QGdtYWlsLmNvbSIsImZvcmV2ZXIiOmZhbHNlLCJpc3MiOiJodHRwOlwvXC9vbTIuZGZlLm9uZW1hcC5zZ1wvYXBpXC92MlwvdXNlclwvc2Vzc2lvbiIsImlhdCI6MTY1ODcyNDU3NSwiZXhwIjoxNjU5MTU2NTc1LCJuYmYiOjE2NTg3MjQ1NzUsImp0aSI6ImEwMzIzZmVlMGQ2MGM2ODYzM2U0ZjMzNzNjNTRjNmZhIn0.k1-GQsJ8_-LethUfSf3xeFNZ_OMtTR-WIeZ3LcrlGqU",
      function (data) {
        eWaste = [];
        data.SrchResults.forEach((eWasteData) => {
          eWaste[eWasteData.ADDRESSBUILDINGNAME] = eWasteData.LatLng;
        });


        for (i = 1; i < data.SrchResults.length; i++) {
          let fullAdd = "";
          let name = data.SrchResults[i].ADDRESSBUILDINGNAME;
          let coord = eWaste[data.SrchResults[i].ADDRESSBUILDINGNAME];
          let address = data.SrchResults[i].ADDRESSSTREETNAME;
          let postal = data.SrchResults[i].ADDRESSPOSTALCODE;
          fullAdd = fullAdd.concat(address.toLowerCase(), " ", postal);
          let desc = data.SrchResults[i].DESCRIPTION;

          let latLng = coord.split(",");
          let lat = latLng[0];
          let lng = latLng[1];

          var eWasteIcon = L.AwesomeMarkers.icon({
            icon: 'recycle',
            prefix: 'fa',
            markerColor: 'green'
          });

          var eWasteMarker = L.marker([lat, lng], { icon: eWasteIcon })
            .bindPopup(name + '</br><p><small>' + "Address: " + fullAdd + '</br>' + "Description: " + desc + "</small></p>").openPopup();

          markers.addLayer(eWasteMarker);
        }

      }
    );
  });

  $(document).ready(function () {
    $.getJSON(
      "https://developers.onemap.sg/privateapi/themesvc/retrieveTheme?queryName=secondhandcollecn&token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjkwNDIsInVzZXJfaWQiOjkwNDIsImVtYWlsIjoibWljaC50YW4xOTk4QGdtYWlsLmNvbSIsImZvcmV2ZXIiOmZhbHNlLCJpc3MiOiJodHRwOlwvXC9vbTIuZGZlLm9uZW1hcC5zZ1wvYXBpXC92MlwvdXNlclwvc2Vzc2lvbiIsImlhdCI6MTY1ODcyNDU3NSwiZXhwIjoxNjU5MTU2NTc1LCJuYmYiOjE2NTg3MjQ1NzUsImp0aSI6ImEwMzIzZmVlMGQ2MGM2ODYzM2U0ZjMzNzNjNTRjNmZhIn0.k1-GQsJ8_-LethUfSf3xeFNZ_OMtTR-WIeZ3LcrlGqU",
      function (secHandData) {
        console.log(secHandData);
        secHandAreaData = [];

        secHandData.SrchResults.forEach((secHandAreaData) => {
          secHandAreaData[secHandAreaData.ADDRESSBUILDINGNAME] = secHandAreaData.LatLng;
        });

        for (i = 1; i < secHandData.SrchResults.length; i++) {
          let fullAdd = "";
          let name = secHandData.SrchResults[i].NAME;
          let latlng = secHandData.SrchResults[i].LatLng;
          let blkNo = secHandData.SrchResults[i].ADDRESSBLOCKHOUSENUMBER;
          let streetName = secHandData.SrchResults[i].ADDRESSSTREETNAME;
          let unitNo = secHandData.SrchResults[i].ADDRESSUNITNUMBER;
          let postalCode = secHandData.SrchResults[i].ADDRESSPOSTALCODE;
          let desc = secHandData.SrchResults[i].DESCRIPTION;

          if (unitNo != undefined) {
            fullAdd = fullAdd.concat(blkNo, " ", streetName, " ", unitNo, " ", postalCode);
          }
          else {
            unitNo = "";
            fullAdd = fullAdd.concat(blkNo, " ", streetName, " ", unitNo, " ", postalCode);
          }

          let latLng = latlng.split(",");
          let lat = latLng[0];
          let lng = latLng[1];


          var secHandIcon = L.AwesomeMarkers.icon({
            icon: 'shop',
            prefix: 'fa',
            markerColor: 'red'
          });
          var secHandMarker = L.marker([lat, lng], { icon: secHandIcon })
            .bindPopup(name + '</br><p><small>' + "Address: " + fullAdd + '</br>' + "Description: " + desc + "</small></p>").openPopup();
          markers.addLayer(secHandMarker);
        }
      }
    );
  });

  var markers = L.markerClusterGroup();
  var center = L.bounds([1.56073, 104.1147], [1.16, 103.502]).getCenter();
  var map = L.map("mapdiv").setView([center.x, center.y], 12);

  var basemap = L.tileLayer(
    "https://maps-{s}.onemap.sg/v3/Default/{z}/{x}/{y}.png",
    {
      detectRetina: true,
      maxZoom: 18,
      minZoom: 12,

    }
  );

  map.setMaxBounds([
    [1.56073, 104.11475],
    [1.16, 103.502],
  ]);

  basemap.addTo(map);
  map.addLayer(markers);

  var legend = L.control({ position: 'bottomright' });
  legend.onAdd = function (map) {
    var div = L.DomUtil.create('div', 'info legend'),
      labels = ["<h4 class='leafletLegend'>Legend:</h4>"],
      grades = ["E-Waste Recycle", "Second-Hand Shops"]
    icons = ["recycle", "shop"]


    for (var i = 0; i < grades.length; i++) {
      div.innerHTML += labels.push(
       ("<span class='"+icons[i]+"'>"+ grades[i]+"</span>") + ("<i class='fa-solid fa-" + icons[i] + "'></i>") + '<br>')
    }
    div.innerHTML = labels.join("</div>");
    return div;
  };
  legend.addTo(map);
