import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend as ChartLegend } from 'chart.js'; // Import dengan alias
import './ChartPrice.css';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, ChartLegend);

const ChartPrice = () => {
  const [chartData, setChartData] = useState(null);

  // Define colors for the bars
  const colors = [
    'rgba(255, 99, 132, 0.2)', // Merah
    'rgba(54, 162, 235, 0.2)', // Biru
    'rgba(75, 192, 192, 0.2)', // Hijau
    'rgba(153, 102, 255, 0.2)', // Ungu
    'rgba(255, 159, 64, 0.2)', // Oranye
    'rgba(255, 206, 86, 0.2)', // Kuning
  ];

  const borderColor = [
    'rgba(255, 99, 132, 1)', // Border Merah
    'rgba(54, 162, 235, 1)', // Border Biru
    'rgba(75, 192, 192, 1)', // Border Hijau
    'rgba(153, 102, 255, 1)', // Border Ungu
    'rgba(255, 159, 64, 1)', // Border Oranye
    'rgba(255, 206, 86, 1)', // Border Kuning
  ];

  useEffect(() => {
    const fetchData = async () => {
      const db = getDatabase();
      const priceRef = ref(db, 'GreenBeansShopeePrice');

      onValue(priceRef, (snapshot) => {
        const data = snapshot.val();
        const labels = [];
        const datasets = [];

        const priceMap = {};

        Object.values(data).forEach((item, index) => {
          const price = parseInt(item.harga.replace(/[^0-9]/g, '')); // Mengambil harga dalam bentuk angka
          const toko = item.toko;

          if (!priceMap[toko]) {
            priceMap[toko] = price;
          }
        });

        const tempLabels = Object.keys(priceMap);
        const tempData = tempLabels.map(label => priceMap[label]);

        const tempDatasets = [{
          label: 'Harga',
          data: tempData,
          backgroundColor: tempLabels.map((_, index) => colors[index % colors.length]),
          borderColor: tempLabels.map((_, index) => borderColor[index % borderColor.length]),
          borderWidth: 1,
        }];

        setChartData({
          labels: tempLabels,
          datasets: tempDatasets,
        });
      });
    };

    fetchData();
  }, []);

  if (!chartData) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>Harga Kopi di Shopee</h2>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              display: false, // Sembunyikan legend default
            },
            title: {
              display: true,
              text: 'Grafik Harga Kopi per Toko',
            },
          },
          scales: {
            x: {
              beginAtZero: true,
              display: false, // Sembunyikan nama toko di bawah sumbu X
            },
            y: {
              beginAtZero: false,
              ticks: {
                stepSize: 20000, // Kelipatan harga setiap 20.000
                callback: function (value) {
                  return 'Rp ' + value.toLocaleString(); // Format angka dengan "Rp"
                },
              },
            },
          },
        }}
      />
      <Legend colors={colors} labels={chartData.labels} />
    </div>
  );
};

// Component for custom legend
const Legend = ({ colors, labels }) => (
  <div className="legend-container">
    {labels.map((label, index) => (
      <div key={index} className="legend-card">
        <div className="legend-color" style={{ backgroundColor: colors[index % colors.length] }}></div>
        <div className="legend-label">{label}</div>
      </div>
    ))}
  </div>
);

export default ChartPrice;
