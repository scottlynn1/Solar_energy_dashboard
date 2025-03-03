import Chart from 'chart.js/auto'
import '../styles/style.css'
const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

// main form for solar system configuration data
const form = document.getElementById('form');
//

// chart functions and variables
Chart.defaults.color = '#000';

const barchart = new Chart(document.getElementById('barchart'), {
  type: "bar", 
  data: {labels: [], datasets: [{label: "DC Production by Month in kWh", data: [], borderColor: '#7C372A', backgroundColor: '#9E4434' }]},
  options: {
    responsive: true,
    maintainAspectRatio: false,}
  });

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

const chartoutput = [
  { month: 'jan', kWh: ''},
  { month: 'feb', kWh: ''},
  { month: 'mar', kWh: ''},
  { month: 'apr', kWh: ''},
  { month: 'may', kWh: ''},
  { month: 'jun', kWh: ''},
  { month: 'jul', kWh: ''},
  { month: 'aug', kWh: ''},
  { month: 'sep', kWh: ''},
  { month: 'oct', kWh: ''},
  { month: 'nov', kWh: ''},
  { month: 'dec', kWh: ''},
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
      chartoutput[i].kWh = returndata.dc_monthly[i]
    }
    AnnualData.displayData(returndata);
    clearChart(barchart);
    addData(barchart, chartoutput);
  });
});

const save = document.getElementById('save');
const list = document.getElementById('system_name');

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

const retrieve = document.getElementById('retrieve');

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
      chartoutput[i].kWh = returndata.output.dc_monthly[i]
    }
    [...form.elements].forEach(element => {
      element.value = returndata.sysdata[element.id];
    })
    AnnualData.displayData(returndata.output);
    clearChart(barchart);
    addData(barchart, chartoutput);
  });
});


const deleteconfig = document.getElementById('deleteconfig');

deleteconfig.addEventListener('click', (e) => {
  e.preventDefault();
  AnnualData.clearData();
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
    form.reset();
  });
});



const loadingsign = document.getElementById('loadingsign');

const optimizeoutput = document.getElementById('optimizeoutput');

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