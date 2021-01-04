import React from 'react';

import UsersList from '../components/UsersList';

const Users = () => {
  const USERS = [
    {
      id: 'u1',
      name: 'User 1',
      imageUrl: 'https://www.stevensegallery.com/350/350',
      places: 3
    },
    {
      id: 'u2',
      name: 'User 2',
      imageUrl: 'https://www.stevensegallery.com/350/350',
      places: 2
    }
  ];

  return <UsersList items={USERS} />;
};

export default Users;
