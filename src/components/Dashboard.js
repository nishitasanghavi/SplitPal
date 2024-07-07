import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './Dashboard.css';

const Dashboard = () => {
  const [groups, setGroups] = useState([]);
  const [payments, setPayments] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
      navigate('/');
      return;
    }

    const userGroups = JSON.parse(localStorage.getItem('userGroups')) || {};
    setGroups(userGroups[currentUser.username] || []);

    const userPayments = JSON.parse(localStorage.getItem('userPayments')) || {};
    setPayments(userPayments[currentUser.username] || []);
  }, [navigate]);

  const calculateBalances = (group) => {
    const balances = {};
    const groupPayments = payments.filter(payment => payment.groupName === group.name);

    group.members.forEach(member => {
      balances[member] = 0;
    });

    groupPayments.forEach(payment => {
      balances[payment.payer] -= payment.amountPaid / group.members.length;
      const splitAmount = payment.amountPaid / group.members.length;

      group.members.forEach(member => {
        if (member !== payment.payer) {
          balances[member] += splitAmount;
        }
      });
    });

    // Remove members with zero balance
    Object.keys(balances).forEach(member => {
      if (balances[member] === 0) {
        delete balances[member];
      }
    });

    return balances;
  };

  const handleDeleteGroup = (groupId) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let userGroups = JSON.parse(localStorage.getItem('userGroups')) || {};
    userGroups[currentUser.username] = userGroups[currentUser.username].filter(group => group.id !== groupId);
    localStorage.setItem('userGroups', JSON.stringify(userGroups));
    setGroups(userGroups[currentUser.username]);
  };

  const handleDeletePayment = (paymentIndex) => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let userPayments = JSON.parse(localStorage.getItem('userPayments')) || {};
    userPayments[currentUser.username].splice(paymentIndex, 1);
    localStorage.setItem('userPayments', JSON.stringify(userPayments));
    setPayments(userPayments[currentUser.username]);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/');
  };

  return (
    <div className="dashboard-container">
      <div className="header">
        <h1>Dashboard</h1>
        <button className="btn btn-logout" onClick={handleLogout}>Logout</button>
      </div>
      <div className="dashboard-buttons">
        <Link to="/new-group" className="btn btn-primary">Add New Group</Link>
        <Link to="/add-payment" className="btn btn-primary">Add Payment</Link>
      </div>
      <div className="groups-list">
        {groups.map(group => (
          <div key={group.id} className="group">
            <div className="group-header">
              <h2 className="group-name">{group.name}</h2>
              <button className="delete-group-btn" onClick={() => handleDeleteGroup(group.id)}>
                <FontAwesomeIcon icon={faTrash} />
              </button>
            </div>
            <div className="group-members">
              <h3>Members:</h3>
              <ul>
                {group.members.map(member => (
                  <li key={member}>{member}</li>
                ))}
              </ul>
            </div>
            <div className="group-payments">
              <h3>Payments:</h3>
              {payments.filter(payment => payment.groupName === group.name).length > 0 ? (
                <ul>
                  {payments.filter(payment => payment.groupName === group.name).map((payment, index) => (
                    <li key={index} className="payment">
                      <div className="payment-info">
                        <span>{payment.payer} paid ${payment.amountPaid} for {payment.paymentName} </span>
                        <button className="delete-payment-btn" onClick={() => handleDeletePayment(index)}>
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="nopayment">No payments recorded for this group.</p>
              )}
            </div>
            <div className="group-balances">
              <h3>Balances:</h3>
              <ul>
                {Object.entries(calculateBalances(group)).map(([member, balance]) => (
                  <p key={member} className="balance-info">
                    {balance > 0 && `${member} owes $${balance.toFixed(2)}`}
                  </p>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
