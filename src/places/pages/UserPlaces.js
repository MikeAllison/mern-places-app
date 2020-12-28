import React from 'react';
import { useParams } from 'react-router-dom';

import PlaceList from '../components/PlaceList';

const DUMMY_PLACES = [
  {
    id: 'p1',
    title: 'Empire State Building 1',
    description: 'Famous skyscraper',
    imageUrl:
      'https://marvel-b1-cdn.bc0a.com/f00000000179470/www.esbnyc.com/sites/default/files/styles/on_single_feature/public/2020-02/Green%20lights.jpg?itok=nRbtw3hG',
    address: '20 W 34th St, New York, NY 10001',
    coordinates: {
      lat: 40.7484405,
      lng: -73.9878531,
    },
    creatorId: 'u1'
  },
  {
    id: 'p2',
    title: 'Empire State Building 2',
    description: 'Famous skyscraper',
    imageUrl:
      'https://marvel-b1-cdn.bc0a.com/f00000000179470/www.esbnyc.com/sites/default/files/styles/on_single_feature/public/2020-02/Green%20lights.jpg?itok=nRbtw3hG',
    address: '20 W 34th St, New York, NY 10001',
    coordinates: {
      lat: 40.7484405,
      lng: -73.9878531,
    },
    creatorId: 'u2'
  },
];

const UserPlaces = () => {
  const userId = useParams().userId;
  const loadedPlaces = DUMMY_PLACES.filter(place => place.creatorId === userId);
  return <PlaceList items={loadedPlaces} />;
};

export default UserPlaces;
