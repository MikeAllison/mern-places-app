import React from 'react';

import UsersList from '../components/UsersList';

const Users = () => {
  const USERS = [
    {
      id: 'u1',
      image: 'https://www.stevensegallery.com/350/350',
      name: 'User 1',
      places: 3
    }
  ];

  return <UsersList items={USERS} />;
};

export default Users;
