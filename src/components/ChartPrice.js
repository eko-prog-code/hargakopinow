import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend as ChartLegend } from 'chart.js';
import './ChartPrice.css';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, ChartLegend);

const ChartPrice = () => {
  const [chartData, setChartData] = useState(null);
  const [loading, setLoading] = useState(true); // State untuk menangani loading

  // Define colors for the bars
  const colors = [
    'rgba(255, 99, 132, 0.2)',
    'rgba(54, 162, 235, 0.2)',
    'rgba(75, 192, 192, 0.2)',
    'rgba(153, 102, 255, 0.2)',
    'rgba(255, 159, 64, 0.2)',
    'rgba(255, 206, 86, 0.2)',
  ];

  const borderColor = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)',
    'rgba(255, 206, 86, 1)',
  ];

  useEffect(() => {
    const fetchData = async () => {
      const db = getDatabase();
      const priceRef = ref(db, 'GreenBeansShopeePrice');

      onValue(priceRef, (snapshot) => {
        const data = snapshot.val();
        const priceMap = {};

        Object.values(data).forEach((item) => {
          const price = parseInt(item.harga.replace(/[^0-9]/g, ''));
          const toko = item.toko;

          if (!priceMap[toko]) {
            priceMap[toko] = price;
          }
        });

        const tempLabels = Object.keys(priceMap);
        const tempData = tempLabels.map(label => priceMap[label]);

        setChartData({
          labels: tempLabels,
          datasets: [
            {
              label: 'Harga',
              data: tempData,
              backgroundColor: tempLabels.map((_, index) => colors[index % colors.length]),
              borderColor: tempLabels.map((_, index) => borderColor[index % borderColor.length]),
              borderWidth: 1,
            },
          ],
        });

        setLoading(false); // Set loading menjadi false setelah data berhasil diambil
      });
    };

    fetchData();
  }, []);

  // Tampilkan animasi loading jika data belum tersedia
  if (loading) {
    return (
      <div className="loading-container">
        <video
          src="https://firebasestorage.googleapis.com/v0/b/medlink-3efcf.appspot.com/o/loading-icon%2Fj9JiPlC6B0.webm?alt=media&token=2800b2f3-7098-47d5-9c82-5f9280750f5f"
          autoPlay
          loop
          muted
          className="loading-video"
        ></video>
      </div>
    );
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
              display: false,
            },
            title: {
              display: true,
              text: 'Grafik Harga Kopi per Toko',
            },
          },
          scales: {
            x: {
              beginAtZero: true,
              display: false,
            },
            y: {
              beginAtZero: false,
              ticks: {
                stepSize: 20000,
                callback: function (value) {
                  return 'Rp ' + value.toLocaleString();
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
