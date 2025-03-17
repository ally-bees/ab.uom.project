// Generate time series data helper function
function generateTimeSeriesData(baseValue, volatility) {
  const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan'];
  let value = baseValue;
  const result = [];

  months.forEach(month => {
    // Generate data points for each month (simplified)
    for (let i = 0; i < 10; i++) {
      // Add some volatility and overall upward trend
      value = Math.max(5, value + (Math.random() * volatility * 2 - volatility) + 0.5);
      result.push({
        name: `${month}-${i+1}`,
        value: Math.round(value),
        month
      });
    }
  });

  return result;
}

// Create the sample data
const incomeData = generateTimeSeriesData(20, 8);
const usersData = generateTimeSeriesData(15, 10);

const salesData = [
  { name: 'Jan-2019', value: 2 },
  { name: 'Apr-2019', value: 5 },
  { name: 'Jul-2019', value: 6 },
  { name: 'Oct-2019', value: 7 },
  { name: 'Jan-2020', value: 9 }
];

const salesCategoriesData = [
  { name: 'Exotic items', value: 25, color: '#ff6b6b' },
  { name: 'Jewelries', value: 15, color: '#ff9e45' },
  { name: 'Clothing items', value: 25, color: '#ffee58' },
  { name: 'Other', value: 35, color: '#6495ed' }
];

const deliveryData = [
  { name: 'Delivery properly in-time', value: 75, color: '#ff6b6b' },
  { name: 'Delivery failures', value: 25, color: '#ffee58' }
];

// Initialize charts when the page loads
document.addEventListener('DOMContentLoaded', () => {
  createLineChart('incomeChart', incomeData, '#20b2aa', true);
  createLineChart('salesChart', salesData, '#20b2aa', false);
  createLineChart('usersChart', usersData, '#20b2aa', true);
  createPieChart('categoriesChart', salesCategoriesData);
  createPieChart('deliveriesChart', deliveryData);
});

// Create line chart function
function createLineChart(elementId, data, color, fillArea) {
  const ctx = document.getElementById(elementId);
  if (!ctx) return;

  // Extract labels and values
  const labels = data.map(item => item.month || item.name);
  const values = data.map(item => item.value);

  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Value',
        data: values,
        borderColor: color,
        backgroundColor: fillArea ? `${color}33` : 'transparent', // 33 is 20% opacity in hex
        fill: fillArea,
        tension: 0.4,
        pointRadius: 0,
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          grid: {
            color: '#e9ecef'
          }
        },
        x: {
          grid: {
            display: false
          }
        }
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      }
    }
  });
}

// Create pie chart function
function createPieChart(elementId, data) {
  const ctx = document.getElementById(elementId);
  if (!ctx) return;

  new Chart(ctx, {
    type: 'pie',
    data: {
      labels: data.map(item => item.name),
      datasets: [{
        data: data.map(item => item.value),
        backgroundColor: data.map(item => item.color),
        borderColor: '#ffffff',
        borderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          callbacks: {
            label: function(context) {
              const label = context.label || '';
              const value = context.raw;
              return `${label}: ${value}%`;
            }
          }
        }
      }
    }
  });
}
