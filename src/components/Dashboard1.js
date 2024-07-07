import React, { useState } from 'react';
import GroupList from './GroupList';
import AddGroupModal from './AddGroupModal';

const Dashboard1 = () => {
  const [groups, setGroups] = useState([]);

  const addGroup = (newGroup) => {
    setGroups([...groups, newGroup]);
  };

  return (
    <div className="container">
      <h1>Dashboard</h1>
      <GroupList groups={groups} />
      <AddGroupModal addGroup={addGroup} />
    </div>
  );
};

export default Dashboard1;
