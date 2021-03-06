import React, { useState, useContext } from 'react';

import { AuthContext } from '../../shared/context/auth-context';

import Card from '../../shared/components/UIElements/Card';
import Button from '../../shared/components/FormElements/Button';
import Modal from '../../shared/components/UIElements/Modal';
import Map from '../../shared/components/UIElements/Map';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';

import './PlaceItem.css';

import { useHttpClient } from '../../shared/hooks/http-hook';

const PlaceItem = (props) => {
  const auth = useContext(AuthContext);

  const [showMap, setShowMap] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const openMapHandler = () => setShowMap(true);
  const closeMapHandler = () => setShowMap(false);

  const showDeleteWarningHandler = () => {
    setShowConfirmModal(true);
  };

  const cancelDeleteWarningHandler = () => {
    setShowConfirmModal(false);
  };

  const { islLoading, error, sendRequest, clearError } = useHttpClient();

  const confirmDeleteHandler = async () => {
    setShowConfirmModal(false);
    try {
      await sendRequest(
        `http://localhost:5000/api/places/${props.id}`,
        'DELETE',
        { Authorization: `Bearer ${auth.authToken}` }
      );

      props.onDelete(props.id);
    } catch (err) {
      // Error is handeled in the sendRequest useHttpClient hook
      // Could also use a .then() instead of try/catch
    }
  };

  const IMG_SERVER = 'http://localhost:5000';

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showMap}
        onCancel={closeMapHandler}
        onClick={props.onCancel}
        header={props.address}
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={<Button onClick={closeMapHandler}>CLOSE</Button>}
      >
        <div className="map-container">
          <Map center={props.coordinates} zoom={16} />
        </div>
      </Modal>
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteWarningHandler}
        onClick={props.onCancel}
        header="Delete Place?"
        contentClass="place-item__modal-content"
        footerClass="place-item__modal-actions"
        footer={
          <React.Fragment>
            <Button onClick={confirmDeleteHandler} danger>
              DELETE
            </Button>
            <Button onClick={cancelDeleteWarningHandler} inverse>
              CANCEL
            </Button>
          </React.Fragment>
        }
      >
        <p className="center">Are you sure?</p>
      </Modal>
      <li className="place-item">
        <Card className="place-item__content">
          {islLoading && <LoadingSpinner asOverlay />}
          <div className="place-item__image">
            <img src={`${IMG_SERVER}/${props.imagePath}`} alt={props.title} />
          </div>
          <div className="place-item__info">
            <h2>{props.title}</h2>
            <h3>{props.address}</h3>
            <p>{props.description}</p>
          </div>
          <div className="place-item__actions">
            <Button onClick={openMapHandler} inverse>
              VIEW ON MAP
            </Button>
            {auth.userId === props.creator && (
              <React.Fragment>
                <Button to={`/places/${props.id}`}>EDIT</Button>
                <Button onClick={showDeleteWarningHandler} danger>
                  DELETE
                </Button>
              </React.Fragment>
            )}
          </div>
        </Card>
      </li>
    </React.Fragment>
  );
};

export default PlaceItem;
