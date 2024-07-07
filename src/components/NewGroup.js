import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import './NewGroup.css';

const NewGroup = () => {
  const [groupName, setGroupName] = useState('');
  const [members, setMembers] = useState(['']);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e, index) => {
    const { value } = e.target;
    const updatedMembers = [...members];
    updatedMembers[index] = value;
    setMembers(updatedMembers);
  };

  const handleAddMember = () => {
    if (members[members.length - 1].trim() === '') {
      setError("Please enter the previous member's name.");
      return;
    }
    setMembers([...members, '']);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const isValid = members.every((member) => member.trim() !== '');
    if (!isValid) {
      setError('Please enter all member names.');
      return;
    }

    const groupId = uuidv4();
    const groupData = {
      id: groupId,
      name: groupName,
      members: members.filter((member) => member.trim() !== ''),
    };

    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    let userGroups = JSON.parse(localStorage.getItem('userGroups')) || {};
    userGroups[currentUser.username] = userGroups[currentUser.username] || [];
    userGroups[currentUser.username].push(groupData);
    localStorage.setItem('userGroups', JSON.stringify(userGroups));

    setGroupName('');
    setMembers(['']);
    navigate('/dashboard');
  };

  return (
    <div className="container">
      <h2>Add New Group</h2>
      {error && <p className="error">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Group Name:</label>
          <input
            type="text"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="form-control"
            required
          />
        </div>
        {members.map((member, index) => (
          <div key={index} className="form-group">
            <label>Member {index + 1}:</label>
            <input
              type="text"
              value={member}
              onChange={(e) => handleInputChange(e, index)}
              className="form-control"
              required
            />
          </div>
        ))}
        <button type="button" onClick={handleAddMember} className="btn btn-secondary">
          Add Another Member
        </button>
        <button type="submit" className="btn btn-primary">Create Group</button>
      </form>
    </div>
  );
};

export default NewGroup;
