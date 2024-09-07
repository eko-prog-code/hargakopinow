import React, { useEffect, useState } from 'react';
import { getDatabase, ref, onValue } from 'firebase/database';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import './ChartPrice.css';

// Register chart.js components
ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const ChartPrice = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const db = getDatabase();
      const priceRef = ref(db, 'GreenBeansShopeePrice');

      onValue(priceRef, (snapshot) => {
        const data = snapshot.val();
        const labels = [];
        const datasets = [];

        // Warna untuk setiap toko
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

        const tempLabels = [];
        const tempDatasets = [];

        Object.values(data).forEach((item, index) => {
          const price = parseInt(item.harga.replace(/\D/g, '')); // Mengambil harga dalam bentuk angka
          const toko = item.toko;

          tempLabels.push(toko);

          tempDatasets.push({
            label: toko,
            data: [price], // Menambahkan harga
            backgroundColor: colors[index % colors.length],
            borderColor: borderColor[index % borderColor.length],
            borderWidth: 1,
          });
        });

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
      <h2>Harga Kopi di Shopee Berdasarkan Toko</h2>
      <Line
        data={chartData}
        options={{
          responsive: true,
          plugins: {
            legend: {
              position: 'top',
            },
            title: {
              display: true,
              text: 'Grafik Harga Kopi per Toko',
            },
          },
          scales: {
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
    </div>
  );
};

export default ChartPrice;
