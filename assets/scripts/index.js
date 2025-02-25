import Chart from 'chart.js/auto'


const form = document.getElementById('form');

const barchart = new Chart(document.getElementById('acquisitions'), {
  type: "bar", 
  data: {labels: [], datasets: [{label: "DC Production by Month", data: []}]},
  options: {
    responsive: true,
    maintainAspectRatio: false,}
  });

const save = document.getElementById('save');
const deleteconfig = document.getElementById('deleteconfig');
const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;
const retrieve = document.getElementById('retrieve');
const ac_annual = document.getElementById('ac_annual');
const solrad_annual = document.getElementById('solrad_annual');

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
  const list = document.getElementById('system_name');
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
    const output = [
      { month: 'jan', kWh: returndata.output.dc_monthly[0] },
      { month: 'feb', kWh: returndata.output.dc_monthly[1] },
      { month: 'mar', kWh: returndata.output.dc_monthly[2] },
      { month: 'apr', kWh: returndata.output.dc_monthly[3] },
      { month: 'may', kWh: returndata.output.dc_monthly[4] },
      { month: 'jun', kWh: returndata.output.dc_monthly[5] },
      { month: 'jul', kWh: returndata.output.dc_monthly[6] },
      { month: 'aug', kWh: returndata.output.dc_monthly[7] },
      { month: 'sep', kWh: returndata.output.dc_monthly[8] },
      { month: 'oct', kWh: returndata.output.dc_monthly[9] },
      { month: 'nov', kWh: returndata.output.dc_monthly[10] },
      { month: 'dec', kWh: returndata.output.dc_monthly[11] },
    ];
    [...form.elements].forEach(element => {
      element.value = returndata.sysdata[element.id];
    })
    ac_annual.textContent = 'Annual AC Production: ';
    solrad_annual.textContent = 'Annual Solar Radiation: ';
    ac_annual.textContent = ac_annual.textContent + Math.round(returndata.output.ac_annual);
    solrad_annual.textContent = solrad_annual.textContent + Math.round(returndata.output.solrad_annual);
    clearChart(barchart);
    addData(barchart, output);
  });
});

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
  });
});