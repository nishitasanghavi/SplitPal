import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AddPayment.css';

const AddPayment = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState('');
  const [payer, setPayer] = useState('');
  const [amountPaid, setAmountPaid] = useState('');
  const [paymentName, setPaymentName] = useState('');
  const [groupMembers, setGroupMembers] = useState([]);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userGroups = JSON.parse(localStorage.getItem('userGroups')) || {};
    const userSpecificGroups = userGroups[currentUser.username] || [];
    setGroups(userSpecificGroups);
  }, []);

  useEffect(() => {
    // Fetch group members based on selected group
    if (groupName) {
      const selectedGroup = groups.find(group => group.name === groupName);
      if (selectedGroup) {
        setGroupMembers(selectedGroup.members);
      }
    }
  }, [groupName, groups]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    const userPayments = JSON.parse(localStorage.getItem('userPayments')) || {};
    userPayments[currentUser.username] = userPayments[currentUser.username] || [];

    const newPayment = {
      groupName,
      payer,
      amountPaid: parseFloat(amountPaid),
      paymentName,
    };

    userPayments[currentUser.username].push(newPayment);
    localStorage.setItem('userPayments', JSON.stringify(userPayments));
    navigate('/dashboard');
  };

  return (
    <div className="add-payment-container">
      <h1>Add Payment</h1>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Group:</label>
          <select
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            required
          >
            <option value="">Select Group</option>
            {groups.map((group) => (
              <option key={group.id} value={group.name}>
                {group.name}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Payer:</label>
          <select
            value={payer}
            onChange={(e) => setPayer(e.target.value)}
            required
          >
            <option value="">Select Payer</option>
            {groupMembers.map((member, index) => (
              <option key={index} value={member}>
                {member}
              </option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label>Payment Name:</label>
          <input
            type="text"
            value={paymentName}
            onChange={(e) => setPaymentName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>Amount Paid:</label>
          <input
            type="number"
            value={amountPaid}
            onChange={(e) => setAmountPaid(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="btn btn-submit">Add Payment</button>
      </form>
    </div>
  );
};

export default AddPayment;
