import React, { useEffect, useState } from 'react';

import { useHttpClient } from '../../shared/hooks/http-hook';

import UsersList from '../components/UsersList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

const Users = () => {
  const [loadedUsers, setLoadedUsers] = useState([]);

  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  // useEffect - Run once, when this page renders the first time
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const responseData = await sendRequest(
          'http://localhost:5000/api/users'
        );

        setLoadedUsers(responseData.users);
      } catch (err) {
        // Error is handeled in the sendRequest useHttpClient hook
        // Could also use a .then() instead of try/catch
      }
    };

    fetchUsers();
  }, [sendRequest]); // Need to pass sendRequest into useEffect as a dependency

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedUsers && <UsersList items={loadedUsers} />}
    </React.Fragment>
  );
};

export default Users;
