import Chart from 'chart.js/auto'

const params = new URLSearchParams({
  'search': 'keyword',
  'filter': 'category',
  'sort': 'date'
});

setTimeout(function() {
  fetch("solarapi", {
    method: "GET",
    headers: {
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