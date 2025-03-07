import React, { useState,useEffect} from "react";
import { ResponsiveContainer, LineChart,PieChart,Pie,Cell, Line, XAxis, YAxis, Legend, Tooltip} from "recharts";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import './style.css';
import { Menu ,User,Home, CreditCard, BarChart as BarChartIcon,Banknote,CheckCircle,Globe, Bell } from "lucide-react"; 
import {Link} from 'react-router-dom';

export default function PersonalFinanceDashboard() {
  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expenses, setExpenses] = useState(0); 
  const [date, setDate] = useState(new Date());
  const [showPopup, setShowPopup] = useState(false);
  const [transactionType, setTransactionType] = useState("expense");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const token = localStorage.getItem('token');
  const [transactions, setTransactions] = useState([]);
  const [activePanel, setActivePanel] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [username, setUsername] = useState("");
  const [bills, setBills] = useState([]);
  const [billName, setBillName] = useState("");
  const [billAmount, setBillAmount] = useState("");
const [billDueDate, setBillDueDate] = useState("");
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [convertedAmount, setConvertedAmount] = useState(null);

  const currencyOptions = [
    "USD", "EUR", "INR", "GBP", "AUD", "CAD", "SGD", "JPY", "CNY", "CHF", "SEK", "NZD", "MXN", "HKD", "NOK", "KRW", "TRY", "RUB", "BRL", "ZAR"
  ];

  const handleCurrencyConversion = async () => {
    if (!amount || isNaN(amount)) {
      alert("Please enter a valid amount");
      return;
    }
    
    try {
      const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${fromCurrency}`);
      const data = await response.json();
      const rate = data.rates[toCurrency];
      if (rate) {
        setConvertedAmount((amount * rate).toFixed(2));
      } else {
        alert("Conversion rate not available");
      }
    } catch (error) {
      alert("Failed to fetch exchange rates");
    }
  };

  


  // Loan state
  const [loans, setLoans] = useState([]);
  const [loanAmount, setLoanAmount] = useState("");
  const [interestRate, setInterestRate] = useState("");
  const [tenure, setTenure] = useState("");

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/auth/profile', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          setUsername(data.name); // Assuming your user object has a name field
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
      }
    };
  
    if (token) {
      fetchUserDetails();
    }
  }, [token]);
  // Add these functions in your Dashboard component

const handleAddBill = async () => {
  try {
    const response = await fetch('http://localhost:5000/api/bills', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        name: billName,
        amount: parseFloat(billAmount),
        dueDate: billDueDate,
        description: 'Bill reminder'
      })
    });

    const data = await response.json();
    if (response.ok) {
      setBills([...bills, data]);
      setBillName('');
      setBillAmount('');
      setBillDueDate('');
    } else {
      alert(data.error || 'Failed to add bill');
    }
  } catch (error) {
    console.error('Error adding bill:', error);
    alert('Failed to add bill');
  }
};

const handleAddLoan = async () => {
  try {
    // Calculate loan details
    const principal = parseFloat(loanAmount);
    const rate = parseFloat(interestRate);
    const tenureMonths = parseInt(tenure);
    
    // Calculate interest and total amount
    const interest = (principal * rate * tenureMonths) / (12 * 100);
    const totalPayable = principal + interest;

    const response = await fetch('http://localhost:5000/api/loans', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({
        amount: principal,
        interestRate: rate,
        tenure: tenureMonths,
        interest: interest,
        totalPayable: totalPayable,
        startDate: new Date(),
        description: 'Loan entry'
      })
    });

    const data = await response.json();
    if (response.ok) {
      // Add calculated fields to the loan object
      const newLoan = {
        ...data,
        rate: rate,
        interest: interest.toFixed(2),
        total: totalPayable.toFixed(2)
      };
      setLoans([...loans, newLoan]);
      setLoanAmount('');
      setInterestRate('');
      setTenure('');
    } else {
      alert(data.error || 'Failed to add loan');
    }
  } catch (error) {
    console.error('Error adding loan:', error);
    alert('Failed to add loan');
  }
};

// Add these useEffect hooks to fetch existing bills and loans
useEffect(() => {
  const fetchBills = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/bills', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setBills(data);
      }
    } catch (error) {
      console.error('Error fetching bills:', error);
    }
  };

  const fetchLoans = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/loans', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      if (response.ok) {
        setLoans(data);
      }
    } catch (error) {
      console.error('Error fetching loans:', error);
    }
  };

  if (token) {
    fetchBills();
    fetchLoans();
  }
}, [token]);
  

  

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

 
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        console.log('Token being sent:', localStorage.getItem('token'));
        const response = await fetch('http://localhost:5000/api/transactions', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();
        if (response.ok) {
          setTransactions(data);
          // Calculate totals
          const totals = data.reduce((acc, t) => {
            if (t.type === 'income') {
              acc.income += t.amount;
              acc.balance += t.amount;
            } else {
              acc.expenses += t.amount;
              acc.balance -= t.amount;
            }
            return acc;
          }, { income: 0, expenses: 0, balance: 0 });
          
          setIncome(totals.income);
          setExpenses(totals.expenses);
          setBalance(totals.balance);
        }
      } catch (error) {
        console.error('Error fetching transactions:', error);
      }
    };

    if (token) {
      fetchTransactions();
    }
  }, [token]);
  const handleSaveTransaction = async () => {
    const amt = parseFloat(amount);
    if (isNaN(amt) || amt <= 0) {
      alert("Please enter a valid amount");
      return;
    }

    try {
      console.log('Token being sent:', localStorage.getItem('token')); 
      const response = await fetch('http://localhost:5000/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          type: transactionType,
          amount: amt,
          description,
          date: date
        })
      });

      const data = await response.json();
      
      if (response.ok) {
        // Update local state
        setTransactions([...transactions, data]);
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
      } else {
        alert(data.error || 'Failed to save transaction');
      }
    } catch (error) {
      console.error('Error saving transaction:', error);
      alert('Failed to save transaction');
    }
  };
  const markAsPaid = async (loanId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/loans/${loanId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'paid' })
      });
  
      const data = await response.json();
      if (response.ok) {
        // Update the loans list
        setLoans(loans.map(loan => 
          loan._id === loanId ? { ...loan, paid: true } : loan
        ));
      } else {
        alert(data.error || 'Failed to update loan status');
      }
    } catch (error) {
      console.error('Error updating loan status:', error);
      alert('Failed to update loan status');
    }
  };
  const handleBillStatusUpdate = async (billId) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bills/${billId}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'paid' })
      });
  
      const data = await response.json();
      if (response.ok) {
        setBills(bills.map(bill => 
          bill._id === billId ? { ...bill, status: 'paid' } : bill
        ));
      } else {
        alert(data.error || 'Failed to update bill status');
      }
    } catch (error) {
      console.error('Error updating bill status:', error);
      alert('Failed to update bill status');
    }
  };
  


  return (
    <div className="dashboard-container">
      {/* Navbar */}
      <div className="navbar">
      <button className="menu-toggle" onClick={() => setSidebarOpen(prevState => !prevState)}>
        <Menu size={26} />
      </button>

        <h2 className="dashboard-title">Personal Finance Manager</h2>
        <div className="user-section">
          <User size={24} className="user-icon" />
          <span className="username">{username}</span>
          <button className="signout-button"><Link to='/'>Sign Out</Link></button>
        </div>
      </div>

      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <ul className="menu-list">
          <li className={`menu-item ${activePanel === "dashboard" ? "active" : ""}`} onClick={() => setActivePanel("dashboard")}><Home/>   Dashboard</li>
          <li className={`menu-item ${activePanel === "transactions" ? "active" : ""}`} onClick={() => setActivePanel("transactions")}><CreditCard/>   Transactions</li>
          <li className={`menu-item ${activePanel === "reports" ? "active" : ""}`} onClick={() => setActivePanel("reports")}><BarChartIcon/>   Reports</li>
          <li className={`menu-item ${activePanel === "loans" ? "active" : ""}`} onClick={() => setActivePanel("loans")}><Banknote/>   Loans</li>
          <li className={`menu-item ${activePanel === "currency" ? "active" : ""}`} onClick={() => setActivePanel("currency")}><Globe /> Currency</li>
          <li className={`menu-item ${activePanel === "bills" ? "active" : ""}`} onClick={() => setActivePanel("bills")}><Bell /> Bills & Reminders</li>
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
        {activePanel === "loans" && (
          <div className="loans-panel">
            <h2>Loan Management</h2>
            <div className="loan-inputs">
              <input type="number" placeholder="Loan Amount" value={loanAmount} onChange={(e) => setLoanAmount(e.target.value)} className="input-field" />
              <input type="number" placeholder="Interest Rate (%)" value={interestRate} onChange={(e) => setInterestRate(e.target.value)} className="input-field" />
              <input type="number" placeholder="Tenure (Months)" value={tenure} onChange={(e) => setTenure(e.target.value)} className="input-field" />
              <button onClick={handleAddLoan} className="add-loan-button">Add Loan</button>
            </div>
            <table className="loans-table">
              <thead>
                <tr>
                  <th>Amount (₹)</th>
                  <th>Interest Rate (%)</th>
                  <th>Tenure (Months)</th>
                  <th>Interest (₹)</th>
                  <th>Total Payable (₹)</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loans.map((loan, index) => {
                  const interest = (loan.amount * loan.interestRate * loan.tenure) / (12 * 100);
                  const totalPayable = loan.amount + interest;
                  
                  return (
                    <tr key={index}>
                      <td>₹{loan.amount.toFixed(2)}</td>
                      <td>{loan.interestRate}%</td>
                      <td>{loan.tenure}</td>
                      <td>₹{interest.toFixed(2)}</td>
                      <td>₹{totalPayable.toFixed(2)}</td>
                      <td>
                        {loan.status === 'paid' ? (
                          <CheckCircle size={24} color="green" />
                        ) : (
                          <button onClick={() => markAsPaid(loan._id)} className="mark-paid-button">
                            Mark as Paid
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        
        {activePanel === "currency" && (
          <div className="currency-converter">
            <h2>Currency Converter</h2>
            <input type="number" placeholder="Amount" value={amount} onChange={(e) => setAmount(e.target.value)} className="input-field" />
            <select value={fromCurrency} onChange={(e) => setFromCurrency(e.target.value)}>
              {currencyOptions.map((currency, index) => (
                <option key={index} value={currency}>{currency}</option>
              ))}
            </select>
            <select value={toCurrency} onChange={(e) => setToCurrency(e.target.value)}>
              {currencyOptions.map((currency, index) => (
                <option key={index} value={currency}>{currency}</option>
              ))}
            </select>
            <button onClick={handleCurrencyConversion} className="convert-button">Convert</button>
            {convertedAmount !== null && <p>Converted Amount: {convertedAmount} {toCurrency}</p>}
          </div>
        )}

        {activePanel === "bills" && (
            <div className="bills-panel">
              <h2>Bill Reminders & Payment Tracking</h2>
              <div className="bill-inputs">
                <input 
                  type="text" 
                  placeholder="Bill Name" 
                  value={billName} 
                  onChange={(e) => setBillName(e.target.value)} 
                  className="input-field" 
                />
                <input 
                  type="number" 
                  placeholder="Amount" 
                  value={billAmount} 
                  onChange={(e) => setBillAmount(e.target.value)} 
                  className="input-field" 
                />
                <input 
                  type="date" 
                  value={billDueDate} 
                  onChange={(e) => setBillDueDate(e.target.value)} 
                  className="input-field" 
                />
                <button onClick={handleAddBill} className="add-bill-button">Add Bill</button>
              </div>
              <table className="bills-table">
                <thead>
                  <tr>
                    <th>Bill Name</th>
                    <th>Amount</th>
                    <th>Due Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {bills.map((bill, index) => (
                    <tr key={index}>
                      <td>{bill.name}</td>
                      <td>₹{bill.amount}</td>
                      <td>{new Date(bill.dueDate).toLocaleDateString()}</td>
                      <td>
                        {bill.status === 'paid' ? (
                          <CheckCircle size={24} color="green" />
                        ) : (
                          <button 
                            onClick={() => handleBillStatusUpdate(bill._id)} 
                            className="mark-paid-button"
                          >
                            Mark as Paid
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}





      </div>
    </div>
  );
}