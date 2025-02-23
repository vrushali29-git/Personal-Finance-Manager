import React, { useState } from "react";
import { ResponsiveContainer, LineChart,PieChart,Pie,Cell, Line, XAxis, YAxis, Legend, Tooltip } from "recharts";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import './style.css';
import { Card, CardContent } from "./components/ui/card";
import { Button } from "./components/ui/button"

export default function PersonalFinanceDashboard() {
  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [date, setDate] = useState(new Date());
  const [showPopup, setShowPopup] = useState(false);
  const [transactionType, setTransactionType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [transactions, setTransactions] = useState([]);
  const [activePanel, setActivePanel] = useState("dashboard");

  const data = transactions.map((t) => ({
    name: t.date,
    income: t.type === "income" ? t.amount : 0,
    expenses: t.type === "expense" ? t.amount : 0,
  }));

  const pieData = [
    { name: "Income", value: income, color: "#0000FF" },
    { name: "Expenses", value: expenses, color: "#FF0000" },
    { name: "Savings", value: balance, color: "#00FF00" },
  ];

  const handleSaveTransaction = () => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      alert("Please enter a valid amount");
      return;
    }
    const newTransaction = { date: date.toDateString(), type: transactionType, amount: amt, description };
    setTransactions([...transactions, newTransaction]);
    if (transactionType === "income") {
      setIncome(income + amt);
      setBalance(balance + amt);
    } else {
      setExpenses(expenses + amt);
      setBalance(balance - amt);
    }
    setShowPopup(false);
    setAmount("");
    setDescription("");
  };

  return (
    <div className="dashboard-container">
      {/* Sidebar */}
      <div className="sidebar">
        <h2 className="menu-title">Menu</h2>
        <ul className="menu-list">
          <li className={`menu-item ${activePanel === "dashboard" ? "active" : ""}`} onClick={() => setActivePanel("dashboard")}>Dashboard</li>
          <li className={`menu-item ${activePanel === "transactions" ? "active" : ""}`} onClick={() => setActivePanel("transactions")}>Transactions</li>
          <li className={`menu-item ${activePanel === "reports" ? "active" : ""}`} onClick={() => setActivePanel("reports")}>Reports</li>
          <li className={`menu-item ${activePanel === "loans" ? "active" : ""}`} onClick={() => setActivePanel("loans")}>Loans</li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="main-content">
        {activePanel === "dashboard" && (
          <>
            {/* Summary Cards */}
            <div className="card-container">
              <div className="card balance-card">
                <h3>Balance</h3>
                <p>₹{balance}</p>
              </div>
              <div className="card income-card">
                <h3>Income</h3>
                <p>₹{income}</p>
              </div>
              <div className="card expense-card">
                <h3>Expenses</h3>
                <p>₹{expenses}</p>
              </div>
            </div>

            {/* Calendar & Chart */}
            <div className="dashboard-widgets">
              <Calendar onClickDay={(selectedDate) => { setDate(selectedDate); setShowPopup(true); }} value={date} className="calendar" />
              <div className="chart-container">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={data}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Legend />
                    <Tooltip />
                    <Line type="monotone" dataKey="income" stroke="blue" />
                    <Line type="monotone" dataKey="expenses" stroke="red" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Add Transaction Popup */}
            {showPopup && (
              <div className="popup-overlay">
                <div className="popup">
                  <h2>Add Transaction</h2>
                  <select value={transactionType} onChange={(e) => setTransactionType(e.target.value)} className="input-field">
                    <option value="expense">Expense</option>
                    <option value="income">Income</option>
                  </select>
                  <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="input-field" />
                  <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} className="input-field" />
                  <div className="button-group">
                    <button onClick={() => setShowPopup(false)} className="cancel-button">Cancel</button>
                    <button onClick={handleSaveTransaction} className="save-button">Save</button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* Transactions Panel */}
        {activePanel === "transactions" && (
          <div className="transactions-panel">
            <h2>Transactions</h2>
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Amount</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((t, index) => (
                  <tr key={index}>
                    <td>{t.date}</td>
                    <td>{t.type}</td>
                    <td>₹{t.amount}</td>
                    <td>{t.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activePanel === "reports" && (
          <div className="reports-container">
            <h2>Financial Summary</h2>
            {income || expenses || balance ? (
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={pieData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="no-data-message">No data available for reports.</p>
            )}
            <div className="summary-details">
              <p><strong>Total Income:</strong> ₹{income}</p>
              <p><strong>Total Expenses:</strong> ₹{expenses}</p>
              <p><strong>Current Balance:</strong> ₹{balance}</p>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
        
      