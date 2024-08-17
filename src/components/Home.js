import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toPng } from 'html-to-image';
import download from 'downloadjs';
import { useNavigate } from 'react-router-dom';
import './Home.css'; // Mengimpor CSS

const Home = () => {
  const [from, setFrom] = useState('');
  const [item, setItem] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [transactions, setTransactions] = useState([]);
  const [payment, setPayment] = useState('');
  const [to, setTo] = useState('');
  const [currentTime, setCurrentTime] = useState(new Date());
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = () => {
    const total = parseInt(quantity.replace(/\./g, ''), 10) * parseFloat(price.replace(/\./g, ''));
    const newTransaction = { item, quantity: parseInt(quantity.replace(/\./g, ''), 10), price: parseFloat(price.replace(/\./g, '')), total };
    setTransactions([...transactions, newTransaction]);
    setItem('');
    setQuantity('');
    setPrice('');
  };

  const handleSave = async () => {
    const transactionData = {
      from,
      to,
      transactions,
      payment: parseFloat(payment.replace(/\./g, '')),
      totalAmount: transactions.reduce((acc, curr) => acc + curr.total, 0),
      remaining: parseFloat(payment.replace(/\./g, '')) - transactions.reduce((acc, curr) => acc + curr.total, 0),
      timestamp: currentTime.toISOString()
    };
    try {
      await axios.post('https://pos-coffee-c5073-default-rtdb.firebaseio.com/transaksi.json', transactionData);
      alert('Transaksi Tersimpan!');
    } catch (error) {
      console.error('Error saving transaction:', error);
    }
  };

  const handleDownload = () => {
    const exportContainer = document.getElementById('export-container');
    exportContainer.style.backgroundColor = 'white'; // Ensure white background
    toPng(exportContainer)
      .then((dataUrl) => {
        const formattedDate = currentTime.toISOString().split('T')[0];
        const fileName = `Dari ${from} Di Bayarkan Kepada ${to} ${formattedDate}.png`;
        download(dataUrl, fileName);
      });
  };

  const formatNumber = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handleQuantityChange = (e) => {
    setQuantity(e.target.value.replace(/^0+/, ''));
  };

  const handlePriceChange = (e) => {
    setPrice(e.target.value.replace(/^0+/, ''));
  };

  const handlePaymentChange = (e) => {
    setPayment(e.target.value.replace(/^0+/, ''));
  };

  const handleQuantityBlur = () => {
    setQuantity(formatNumber(quantity));
  };

  const handlePriceBlur = () => {
    setPrice(formatNumber(price));
  };

  const handlePaymentBlur = () => {
    const formattedPayment = formatNumber(payment);
    setPayment(formattedPayment);
  };

  const handleRemoveTransaction = (index) => {
    const confirmed = window.confirm('Apakah Anda yakin menghapus item ini?');
    if (confirmed) {
      const updatedTransactions = transactions.filter((_, i) => i !== index);
      setTransactions(updatedTransactions);
    }
  };

  const totalAmount = transactions.reduce((acc, curr) => acc + curr.total, 0);
  const remaining = parseFloat(payment.replace(/\./g, '')) - totalAmount;

  return (
    <div className="container">
      <h1>Catatan Kopi</h1>
      <div className="form-group">
        <label>Dari:</label>
        <input 
          type="text" 
          placeholder="Dari..." 
          value={from} 
          onChange={(e) => setFrom(e.target.value)} 
        />
      </div>
      <div className="form-group">
        <label>Di Bayarkan kepada:</label>
        <input 
          type="text" 
          placeholder="Penerima" 
          value={to} 
          onChange={(e) => setTo(e.target.value)} 
        />
      </div>
      <div>
        <label>Tanggal: {currentTime.toLocaleString()}</label>
      </div>
      <div className="form-group">
        <input 
          type="text" 
          placeholder="Nama Item (Kopi Robusta Grade I, Kopi Robusta Asalan)" 
          value={item} 
          onChange={(e) => setItem(e.target.value)} 
        />
        <input 
          type="text" 
          placeholder="Quantity (kg)" 
          value={quantity} 
          onChange={handleQuantityChange} 
          onBlur={handleQuantityBlur}
        />
        <input 
          type="text" 
          placeholder="Harga per kg" 
          value={price} 
          onChange={handlePriceChange} 
          onBlur={handlePriceBlur}
        />
        <button onClick={handleSubmit}>Tambah transaksi</button>
      </div>

      <div id="export-container" style={{ backgroundColor: 'white', padding: '20px' }}>
        <div className="header-info">
          <p><strong>Dari:</strong> {from}</p>
          <p><strong>Di Bayar kepada:</strong> {to}</p>
        </div>
        <h2>Transactions</h2>
        <table id="transaction-table">
          <thead>
            <tr>
              <th>Item</th>
              <th>Quantity (kg)</th>
              <th>Harga per kg</th>
              <th>Total</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((transaction, index) => (
              <tr key={index}>
                <td>{transaction.item}</td>
                <td>{formatNumber(transaction.quantity)}</td>
                <td>{formatNumber(transaction.price)}</td>
                <td>{formatNumber(transaction.total)}</td>
                <td>
                  <button onClick={() => handleRemoveTransaction(index)}>X</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="summary">
          <div className="summary-item">
            <h2>Total Harga: <span>{formatNumber(totalAmount)}</span></h2>
          </div>
          <div className="summary-item">
            <input 
              type="text" 
              placeholder="Nominal Bayar..." 
              value={payment} 
              onChange={handlePaymentChange} 
              onBlur={handlePaymentBlur}
            />
          </div>
          <div className="summary-item">
            <h2>Sisa: <span>{formatNumber(remaining)}</span></h2>
          </div>
        </div>
      </div>

      <div className="button-container">
        <button className="button-save" onClick={handleSave}>Simpan Transaksi</button>
        <button className="button-download" onClick={handleDownload}>Download Transaksi</button>
      </div>

      <img 
        src="https://firebasestorage.googleapis.com/v0/b/pos-coffee-c5073.appspot.com/o/receipt.png?alt=media&token=37680c5c-8764-4d2f-ade0-b98ecfe1dfdc" 
        alt="Receipt" 
        className="fixed-bottom-right" 
        onClick={() => navigate('/detail')}
      />
    </div>
  );
};

export default Home;
