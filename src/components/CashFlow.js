import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './CashFlow.css'; // Import CSS for styling

const CashFlow = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [category, setCategory] = useState('');
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    // Fetch transactions from Firebase
    axios
      .get('https://pos-coffee-c5073-default-rtdb.firebaseio.com/transaksi.json')
      .then((response) => {
        const fetchedTransactions = [];
        for (const key in response.data) {
          fetchedTransactions.push({
            id: key,
            ...response.data[key]
          });
        }
        // Sort transactions by timestamp (latest first)
        fetchedTransactions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        setTransactions(fetchedTransactions);
        setFilteredTransactions(fetchedTransactions);
      })
      .catch((error) => {
        console.error('Error fetching transactions:', error);
      });
  }, []);

  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    setCategory(selectedCategory);

    // Filter transactions based on selected category
    const filtered = transactions.filter((transaction) => {
      if (selectedCategory === '') {
        return true; // No filter, show all transactions
      }
      return transaction.category === selectedCategory;
    });

    setFilteredTransactions(filtered);
  };

  const handleDetailClick = (transaction) => {
    setSelectedTransaction(transaction);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedTransaction(null);
  };

  const formatNumber = (number) => {
    return number.toLocaleString('id-ID');
  };

  return (
    <div className="cashflow-container">
      <h1>Cash Flow</h1>
      <label htmlFor="category-filter" className="filter-label">Filter by category:</label>
      <select
        id="category-filter"
        value={category}
        onChange={handleCategoryChange}
        className="category-dropdown"
      >
        <option value="">All</option>
        <option value="money spent">Uang Keluar</option>
        <option value="money received">Uang Masuk</option>
      </select>

      <div className="table-container">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>From</th>
              <th>To</th>
              <th>Total</th>
              <th>Date</th>
              <th>Details</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.from}</td>
                <td>{transaction.to}</td>
                <td>{formatNumber(transaction.totalAmount)}</td>
                <td>{new Date(transaction.timestamp).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}</td>
                <td>
                  <button
                    className="detail-icon"
                    onClick={() => handleDetailClick(transaction)}
                  >
                    🔍
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {modalVisible && selectedTransaction && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Transaction Details</h2>
            <p><strong>From:</strong> {selectedTransaction.from}</p>
            <p><strong>To:</strong> {selectedTransaction.to}</p>
            <p><strong>Total Amount:</strong> {formatNumber(selectedTransaction.totalAmount)}</p>
            <p><strong>Payment:</strong> {formatNumber(selectedTransaction.payment)}</p>
            <p><strong>Remaining:</strong> {formatNumber(selectedTransaction.remaining)}</p>
            <p><strong>Date:</strong> {new Date(selectedTransaction.timestamp).toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' })}</p>
            
            <h3>Transaction Items</h3>
            <table className="items-table">
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Price</th>
                  <th>Quantity</th>
                </tr>
              </thead>
              <tbody>
                {selectedTransaction.transactions && selectedTransaction.transactions.map((item, index) => (
                  <tr key={index}>
                    <td>{item.item}</td>
                    <td>{formatNumber(item.price)}</td>
                    <td>{item.quantity}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <button className="close-modal" onClick={handleCloseModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CashFlow;
