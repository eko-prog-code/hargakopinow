import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toPng } from 'html-to-image';
import download from 'downloadjs';
import './Detail.css'; // Import CSS
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation

const Detail = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [filterDate, setFilterDate] = useState('');
  const [transactionStatus, setTransactionStatus] = useState({}); // State to manage checkbox status
  const cardRefs = useRef({});
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    // Fetch transactions from Firebase
    axios
      .get('https://pos-coffee-c5073-default-rtdb.firebaseio.com/transaksi.json')
      .then((response) => {
        const fetchedTransactions = [];
        const initialStatus = {};
        for (const key in response.data) {
          fetchedTransactions.push({
            id: key,
            ...response.data[key],
          });
          initialStatus[key] = response.data[key].status || false; // Initialize status from fetched data
        }
        // Sort transactions by timestamp descending
        fetchedTransactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setTransactions(fetchedTransactions);
        setFilteredTransactions(fetchedTransactions);
        setTransactionStatus(initialStatus); // Set initial status
      })
      .catch((error) => {
        console.error('Error fetching transactions:', error);
      });
  }, []);

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    setFilterDate(selectedDate);

    const filtered = transactions.filter((transaction) => {
      const transactionDate = new Date(transaction.timestamp).toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' }); // Set timezone to Asia/Jakarta
      return transactionDate === selectedDate;
    });
    setFilteredTransactions(filtered);
  };

  const handleDelete = (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
      // Delete transaction from Firebase
      axios
        .delete(`https://pos-coffee-c5073-default-rtdb.firebaseio.com/transaksi/${id}.json`)
        .then(() => {
          setTransactions(transactions.filter((transaction) => transaction.id !== id));
          setFilteredTransactions(filteredTransactions.filter((transaction) => transaction.id !== id));
        })
        .catch((error) => {
          console.error('Error deleting transaction:', error);
        });
    }
  };

  const handleDownload = (transaction) => {
    const exportContainer = cardRefs.current[transaction.id];
    const scale = 2; // Increase scale to improve resolution
    toPng(exportContainer, {
      backgroundColor: 'white',
      width: exportContainer.scrollWidth * scale,
      height: exportContainer.scrollHeight * scale,
      style: {
        transform: `scale(${scale})`,
        transformOrigin: 'top left',
        width: exportContainer.scrollWidth + 'px',
        height: exportContainer.scrollHeight + 'px',
      },
    })
      .then((dataUrl) => {
        const formattedDate = new Date(transaction.timestamp).toISOString().split('T')[0];
        const fileName = `Dari ${transaction.from} Untuk ${transaction.to} ${formattedDate}.png`;
        download(dataUrl, fileName);
      })
      .catch((error) => {
        console.error('Error generating image:', error);
      });
  };

  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleIconClick = () => {
    navigate('/CashFlow'); // Navigate to CashFlow.js
  };

  const handleCheckboxChange = (transactionId) => {
    const newStatus = !transactionStatus[transactionId];
    setTransactionStatus({ ...transactionStatus, [transactionId]: newStatus });

    // Optionally, update the transaction status in Firebase
    axios
      .patch(`https://pos-coffee-c5073-default-rtdb.firebaseio.com/transaksi/${transactionId}.json`, { status: newStatus })
      .then(() => {
        console.log('Transaction status updated');
      })
      .catch((error) => {
        console.error('Error updating transaction status:', error);
      });
  };

  return (
    <div className="container">
      <h1>Cari Transaksi</h1>
      <label htmlFor="filter-date" className="filter-label">
        Filter dengan tanggal:
      </label>
      <input type="date" id="filter-date" value={filterDate} onChange={handleDateChange} />
      <div className="transactions">
        {filteredTransactions.map((transaction) => (
          <div key={transaction.id} className="transaction-card" id={`transaction-card-${transaction.id}`} ref={(el) => (cardRefs.current[transaction.id] = el)}>
            <h3>Dari: {transaction.from}</h3>
            <p>Di Bayar kepada: {transaction.to}</p>
            <p className="summary-text">
              Total: <span className="summary-value">{formatNumber(transaction.totalAmount)}</span>
            </p>
            <p className="summary-text">
              Bayar: <span className="summary-value">{formatNumber(transaction.payment)}</span>
            </p>
            <p className="summary-text">
              Sisa: <span className="summary-value">{formatNumber(transaction.remaining)}</span>
            </p>
            <p>Tanggal: {new Date(transaction.timestamp).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}</p>
            <h4>Items:</h4>
            <table className="item-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Quantity (kg)</th>
                  <th>Harga per kg</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {transaction.transactions.map((item, index) => (
                  <tr key={index}>
                    <td>{item.item}</td>
                    <td>{formatNumber(item.quantity)}</td>
                    <td>{formatNumber(item.price)}</td>
                    <td>{formatNumber(item.total)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="transaction-status">
            <p><strong>Note:</strong></p>
            <p>Status Transaksi:</p>
              <label>
                <input
                  type="checkbox"
                  checked={transactionStatus[transaction.id] || false}
                  onChange={() => handleCheckboxChange(transaction.id)}
                />
                Transaksi Selesai
              </label>
              <p>Sisa uang tersebut telah dikembalikan.</p>
            </div>
            <button className="delete-button" onClick={() => handleDelete(transaction.id)}>
              Hapus
            </button>
            <button className="download-button" onClick={() => handleDownload(transaction)}>
              Download Transaksi
            </button>
          </div>
        ))}
      </div>

      {/* Floating icon */}
      <img
        src="https://firebasestorage.googleapis.com/v0/b/pos-coffee-c5073.appspot.com/o/cashflow-icon.png?alt=media&token=0eecf725-3fbd-4ccc-8333-95f3395af7a9"
        alt="Cash Flow Icon"
        className="cashflow-icon"
        onClick={handleIconClick}
      />
    </div>
  );
};

export default Detail;