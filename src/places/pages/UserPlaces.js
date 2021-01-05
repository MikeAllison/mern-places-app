import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import { useHttpClient } from '../../shared/hooks/http-hook';

import PlaceList from '../components/PlaceList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const UserPlaces = () => {
  const [loadedUserPlaces, setLoadedUserPlaces] = useState([]);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const userId = useParams().userId;

  useEffect(() => {
    const fetchUserPlaces = async () => {
      try {
        const responseData = await sendRequest(
          `http://localhost:5000/api/places/user/${userId}`
        );

        setLoadedUserPlaces(responseData.places);
      } catch (err) {
        // Error is handeled in the sendRequest useHttpClient hook
        // Could also use a .then() instead of try/catch
      }
    };

    fetchUserPlaces();
  }, [sendRequest, userId]); // Need to pass sendRequest into useEffect as a dependency

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUserPlaces && <PlaceList items={loadedUserPlaces} />}
    </React.Fragment>
  );
};

export default UserPlaces;
