import Chart from 'chart.js/auto'


const form = document.getElementById('form');
const barchart = new Chart(document.getElementById('acquisitions'), {type: "bar", data: {labels: [], datasets: [{label: "DC Production by Month", data: []}]}})
const save = document.getElementById('save');
const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
const retrieve = document.getElementById('retrieve');


function addData(chart, data) {
  data.forEach(row => {
    chart.data.labels.push(row.month);
    chart.data.datasets[0].data.push(row.kWh);
  });
  chart.update();
}

function clearChart(chart) {
  if (chart.data.labels.length !==0) {
    chart.data.labels.length = 0;
    chart.data.datasets[0].data.length = 0;
    chart.update();
  } else {
    console.log('no data to clear');
  }

}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const formdata = new FormData(form);
  const params = new URLSearchParams({
    "system_capacity": formdata.get('system_capacity'),
    "module_type": formdata.get('module_type'),
    "losses": formdata.get('losses'),
    "array_type": formdata.get('array_type'),
    "tilt": formdata.get('tilt'),
    "azimuth": formdata.get('azimuth'),
    "lat": formdata.get('lat'),
    "lon": formdata.get('lon')
  });
  fetch(`solarapi?${params}`, {
    method: "GET",
    headers: {
      "accept": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    }
  }).then(response => response.json()).then(returndata => {
    const solardata = [
      { month: 'jan', kWh: returndata.dc_monthly[0] },
      { month: 'feb', kWh: returndata.dc_monthly[1] },
      { month: 'mar', kWh: returndata.dc_monthly[2] },
      { month: 'apr', kWh: returndata.dc_monthly[3] },
      { month: 'may', kWh: returndata.dc_monthly[4] },
      { month: 'jun', kWh: returndata.dc_monthly[5] },
      { month: 'jul', kWh: returndata.dc_monthly[6] },
      { month: 'aug', kWh: returndata.dc_monthly[7] },
      { month: 'sep', kWh: returndata.dc_monthly[8] },
      { month: 'oct', kWh: returndata.dc_monthly[9] },
      { month: 'nov', kWh: returndata.dc_monthly[10] },
      { month: 'dec', kWh: returndata.dc_monthly[11] },
    ];
    clearChart(barchart);
    addData(barchart, solardata);
  });
});

save.addEventListener('click', (e) => {
  save.preventDefault;
  const list = document.getElementById('system_name')
  const newsys = document.createElement('option')
  const client = prompt('name of client: ');
  const data = new FormData(form);
  data.append('system_name', client);
  const fulldata = {};
  data.forEach((key, value)=>{
    fulldata[value] = key;
  })
  fetch('save', {
    method: "POST",
    body: JSON.stringify(fulldata),
    mode: 'same-origin',
    headers: {
      'content-type': 'application/json',
      'X-CSRFtoken': csrftoken,
    }
  }).then(response => response.json()).then(response => {
  newsys.setAttribute('value', response.system);
  newsys.innerText = response.system;
  list.appendChild(newsys);
});
})

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
    console.log(returndata);
    const solardata = [
      { month: 'jan', kWh: returndata.dc_monthly[0] },
      { month: 'feb', kWh: returndata.dc_monthly[1] },
      { month: 'mar', kWh: returndata.dc_monthly[2] },
      { month: 'apr', kWh: returndata.dc_monthly[3] },
      { month: 'may', kWh: returndata.dc_monthly[4] },
      { month: 'jun', kWh: returndata.dc_monthly[5] },
      { month: 'jul', kWh: returndata.dc_monthly[6] },
      { month: 'aug', kWh: returndata.dc_monthly[7] },
      { month: 'sep', kWh: returndata.dc_monthly[8] },
      { month: 'oct', kWh: returndata.dc_monthly[9] },
      { month: 'nov', kWh: returndata.dc_monthly[10] },
      { month: 'dec', kWh: returndata.dc_monthly[11] },
    ];
    clearChart(barchart);
    addData(barchart, solardata);
  });
});