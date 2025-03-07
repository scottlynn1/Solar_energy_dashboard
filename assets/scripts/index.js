import Chart from 'chart.js/auto'
import '../styles/style.css'
window.onload = function() {

const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

// main form for solar system configuration data
const form = document.getElementById('form');
//

// chart functions and variables
Chart.defaults.color = '#000';

const barchart = new Chart(document.getElementById('barchart'), {
  type: "bar", 
  data: {
    labels: [], 
    datasets: [{
      label: "DC Production by Month in kWh", 
      data: [],
      borderColor: '#7C372A', 
      backgroundColor: '#992417',
    }, {
      label: "AC Production by Month in kWh",
      data: [],
      borderColor: '#7C372A',
      backgroundColor: '#94401c',
    }
  ]},
  options: {
    responsive: true,
    maintainAspectRatio: false,
  }
  });

  const barchart2 = new Chart(document.getElementById('barchart2'), {
    type: "bar", 
    data: {
      labels: [], 
      datasets: [{
        label: "Plane of Irradiance kWh/m^2", 
        data: [],
        borderColor: '#7C372A', 
        backgroundColor: '#992417',
        yAxisID: 'left'
      }, {
        label: "Monthly Solar Radiation kWh/m^2/day",
        data: [],
        borderColor: '#7C372A',
        backgroundColor: '#94401c',
        yAxisID: 'right'
      }
    ]},
    options: {
      scales: {
        left: {
          type: 'linear',
          position: 'left',
        },
        right: {
          type: 'linear',
          position: 'right',
        }},
      responsive: true,
      maintainAspectRatio: false,
    }
    });

function addData(chart, data) {
  data.forEach(row => {
    chart.data.labels.push(row.month);
    chart.data.datasets[0].data.push(row.kWh[0]);
    chart.data.datasets[1].data.push(row.kWh[1]);
  });
  chart.update();
}

function clearChart(chart) {
  if (chart.data.labels.length !==0) {
    chart.data.labels.length = 0;
    chart.data.datasets[0].data.length = 0;
    chart.data.datasets[1].data.length = 0;
    chart.update();
  } else {
    console.log('no data to clear');
  }

}

const chartoutput = [
  { month: 'jan', kWh: []},
  { month: 'feb', kWh: []},
  { month: 'mar', kWh: []},
  { month: 'apr', kWh: []},
  { month: 'may', kWh: []},
  { month: 'jun', kWh: []},
  { month: 'jul', kWh: []},
  { month: 'aug', kWh: []},
  { month: 'sep', kWh: []},
  { month: 'oct', kWh: []},
  { month: 'nov', kWh: []},
  { month: 'dec', kWh: []},
];

const chartoutput2 = [
  { month: 'jan', kWh: []},
  { month: 'feb', kWh: []},
  { month: 'mar', kWh: []},
  { month: 'apr', kWh: []},
  { month: 'may', kWh: []},
  { month: 'jun', kWh: []},
  { month: 'jul', kWh: []},
  { month: 'aug', kWh: []},
  { month: 'sep', kWh: []},
  { month: 'oct', kWh: []},
  { month: 'nov', kWh: []},
  { month: 'dec', kWh: []},
];
// 

const AnnualData = (function () {
  const ac_annual = document.getElementById('ac_annual');
  const solrad_annual = document.getElementById('solrad_annual');
  const capacity_factor = document.getElementById('capacity_factor');
  const optimizeddata = document.getElementById('optimizeddata');

  const displayData = function(annualdata) {
      ac_annual.textContent = '';
      solrad_annual.textContent = '';
      optimizeddata.textContent = '';
      capacity_factor.textContent = '';
      ac_annual.textContent = Math.round(annualdata.ac_annual);
      solrad_annual.textContent = Math.round(annualdata.solrad_annual);
      capacity_factor.textContent = Math.round(annualdata.capacity_factor);
    };

  const clearData = function() {
    ac_annual.textContent = '';
    solrad_annual.textContent = '';
    optimizeddata.textContent = '';
    capacity_factor.textContent = '';
  }

  return {ac_annual, solrad_annual, capacity_factor, optimizeddata, displayData, clearData}
})();

//
form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formdata = new FormData(form);
  const params = new URLSearchParams(formdata);
  fetch(`solarapi?${params}`, {
    method: "GET",
    headers: {
      "accept": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    }
  }).then(response => response.json()).then(returndata => {
    for (let i = 0; i < chartoutput.length; i++) {
      chartoutput[i].kWh[0] = returndata.dc_monthly[i];
      chartoutput[i].kWh[1] = returndata.ac_monthly[i];
      chartoutput2[i].kWh[0] = returndata.poa_monthly[i];
      chartoutput2[i].kWh[1] = returndata.solrad_monthly[i];
    }
    AnnualData.displayData(returndata);
    clearChart(barchart);
    addData(barchart, chartoutput);
    clearChart(barchart2);
    addData(barchart2, chartoutput2);
  });
});
//

const save = document.getElementById('save');
const list = document.getElementById('system_name');
//
save.addEventListener('click', (e) => {
  save.preventDefault;
  const client = prompt('name of client: ');
  const data = new FormData(form);
  data.append('system_name', client);
  fetch('solarapi', {
    method: "POST",
    body: data,
    mode: 'same-origin',
    headers: {
      'X-CSRFtoken': csrftoken,
      "X-Requested-With": "XMLHttpRequest",
    }
  }).then(response => response.json()).then(response => {
    if (response.response === "system name already exists") {
      alert('system name already exists');
    }
    else {
      const newsys = document.createElement('option');
      newsys.setAttribute('value', response.system);
      newsys.innerText = response.system;
      list.appendChild(newsys);
    }
  });
})
//

const retrieve = document.getElementById('retrieve');
//
retrieve.addEventListener('submit', (e) => {
  e.preventDefault();
  const system_name = document.getElementById('system_name');
  fetch(`retrieve?system_name=${system_name.value}`, {
    method: "GET",
    headers: {
      "accept": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    }
  }).then(response => response.json()).then(returndata => {
    for (let i = 0; i < chartoutput.length; i++) {
      chartoutput[i].kWh[0] = returndata.output.dc_monthly[i];
      chartoutput[i].kWh[1] = returndata.output.ac_monthly[i];
      chartoutput2[i].kWh[0] = returndata.output.poa_monthly[i];
      chartoutput2[i].kWh[1] = returndata.output.solrad_monthly[i];
    }
    [...form.elements].forEach(element => {
      element.value = returndata.sysdata[element.id];
    })
    AnnualData.displayData(returndata.output);
    clearChart(barchart2);
    addData(barchart2, chartoutput2);
    clearChart(barchart);
    addData(barchart, chartoutput);
    map.setCenter({lat: Number(returndata.sysdata.lat), lng: Number(returndata.sysdata.lon)});
    map.setZoom(8);
    infoWindow.close();
    // Create a new InfoWindow.
    infoWindow = new google.maps.InfoWindow({
      position: {lat: Number(returndata.sysdata.lat), lng: Number(returndata.sysdata.lon)},
    });
    infoWindow.setContent(
      JSON.stringify({lat: Number(returndata.sysdata.lat), lng: Number(returndata.sysdata.lon)}, null, 2),
    );
    infoWindow.open(map);
  });
});
//

const deleteconfig = document.getElementById('deleteconfig');
//
deleteconfig.addEventListener('click', (e) => {
  e.preventDefault();
  const system_name = document.getElementById('system_name');
  fetch(`retrieve?system_name=${system_name.value}`, {
    method: "DELETE",
    headers: {
      "accept": "application/json",
      "X-Requested-With": "XMLHttpRequest",
      'X-CSRFtoken': csrftoken,
    }
  }).then(response => response.json()).then(response => {
    for (var i=0; i<system_name.length; i++) {
      if (system_name.options[i].value == system_name.value)
          system_name.remove(i);
    }
    clearChart(barchart);
    clearChart(barchart2);
    AnnualData.clearData();
    form.reset();
  });
});
//

const loadingsign = document.getElementById('loadingsign');
const optimizeoutput = document.getElementById('optimizeoutput');
//
optimizeoutput.addEventListener('click', (e) => {
  e.preventDefault();
  loadingsign.className = "loadingshow";
  const formdata = new FormData(form);
  formdata.append('ac_annual', ac_annual.textContent);
  const params = new URLSearchParams(formdata);
  fetch(`optimize?${[params]}`, {
    method: "GET",
    headers: {
      "accept": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    }
  }).then(response => {
    if (response.ok) {
      return response.json();
    } else {
      if (response.status === 404) throw new Error('404, not found');
      if (response.status === 500) throw new Error('500, internal server error');
      throw new Error(response.status);
    }
  }).then(returndata => {
    loadingsign.className = "loadinghide"
    AnnualData.optimizeddata.textContent = '';
    AnnualData.optimizeddata.textContent = `${Math.round(returndata.optimal_ac_annual)} for ${returndata.optimal_tilt} degrees tilt`;
  }).catch(error => {
    loadingsign.className = 'loadinghide';
    console.error('Fetch', error)
  });
});

//

const myLatlng = { lat: 40.773, lng: -96.379 }
const map = new google.maps.Map(document.getElementById("map"), {
  zoom: 4,
  center: myLatlng,
});
console.log(map.center.toJSON())
let infoWindow = new google.maps.InfoWindow({
  content: "Click the map to get Lat/Lng!",
  position: myLatlng,
});

infoWindow.open(map);

map.addListener("click", (mapsMouseEvent) => {
  // Close the current InfoWindow.
  infoWindow.close();
  // Create a new InfoWindow.
  infoWindow = new google.maps.InfoWindow({
    position: mapsMouseEvent.latLng,
  });
  infoWindow.setContent(
    JSON.stringify(mapsMouseEvent.latLng.toJSON(), null, 2),
  );
  infoWindow.open(map);
  form.elements.lat.value = Math.round(mapsMouseEvent.latLng.toJSON().lat*100000)/100000;
  form.elements.lon.value = Math.round(mapsMouseEvent.latLng.toJSON().lng*100000)/100000;
});

};