import Chart from 'chart.js/auto'

setTimeout(function() {
  const form = document.getElementById('form');
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
        { month: 'jan', kWh: returndata.outputs.dc_monthly[0] },
        { month: 'feb', kWh: returndata.outputs.dc_monthly[1] },
        { month: 'mar', kWh: returndata.outputs.dc_monthly[2] },
        { month: 'apr', kWh: returndata.outputs.dc_monthly[3] },
        { month: 'may', kWh: returndata.outputs.dc_monthly[4] },
        { month: 'jun', kWh: returndata.outputs.dc_monthly[5] },
        { month: 'jul', kWh: returndata.outputs.dc_monthly[6] },
        { month: 'aug', kWh: returndata.outputs.dc_monthly[7] },
        { month: 'sep', kWh: returndata.outputs.dc_monthly[8] },
        { month: 'oct', kWh: returndata.outputs.dc_monthly[9] },
        { month: 'nov', kWh: returndata.outputs.dc_monthly[10] },
        { month: 'dec', kWh: returndata.outputs.dc_monthly[11] },
      ];
      new Chart(
        document.getElementById('acquisitions'),
        {
          type: 'bar',
          data: {
            labels: solardata.map(row => row.month),
            datasets: [
              {
                label: 'Acquisitions by year',
                data: solardata.map(row => row.kWh)
              }
            ]
          }
        }
      );
    });
  });
}, 5000);

/*
setTimeout(function() {
  fetch(`solarapi?${params}`, {
    method: "GET",
    headers: {
      "accept": "application/json",
      "X-Requested-With": "XMLHttpRequest",
    }
  }).then(response => response.json()).then(response => 
    document.getElementById('data').innerText = JSON.stringify(response)
  );
}, 5000);



setTimeout(function() {

  const data = [
    { year: 2010, count: 10 },
    { year: 2011, count: 20 },
    { year: 2012, count: 15 },
    { year: 2013, count: 25 },
    { year: 2014, count: 22 },
    { year: 2015, count: 30 },
    { year: 2016, count: 28 },
  ];

  new Chart(
    document.getElementById('acquisitions'),
    {
      type: 'bar',
      data: {
        labels: data.map(row => row.year),
        datasets: [
          {
            label: 'Acquisitions by year',
            data: data.map(row => row.count)
          }
        ]
      }
    }
  );
}, 5000);
*/