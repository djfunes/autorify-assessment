import React, { useState, useEffect } from 'react';
import { Item } from '../../models/Item';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import AutoDismissAlert from '../AutoDismissAlert';

interface Props {
  onSubmit: (item: Item) => void;
}

const ItemComponent = ({ onSubmit }: Props) => {
  const { id } = useParams();
  const [item, setItem] = useState<Item>();
  const [name, setName] = useState(item?.name || '');
  const [description, setDescription] = useState(item?.description || '');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    const loadItem = async () => {
      if (id) {
        try {
          const response = await axios.get(`${process.env.REACT_APP_API_SERVER_URL}/items/${id}`);
          if (response.status !== 200) {
            throw new Error('Failed to fetch item');
          }
          setItem(response.data);
          setName(response.data.name);
          setDescription(response.data.description);
        } catch (err: any) {
          if (err.response) {
            setError(`Error ${err.response.status}: ${err.response.data.message}`);
          }else{
              setError(`Error: ${err.message}`);
          }
        }
      }
    };
    loadItem();
  }, [id]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const newItem = {
      id: item?.id || 0,
      name,
      description,
    };

    const apiUrl = item?.id ? `${process.env.REACT_APP_API_SERVER_URL}/items/${item.id}` : `${process.env.REACT_APP_API_SERVER_URL}/items`;
    const method = item?.id ? 'put' : 'post';

    try {
      const response = await axios({
        method,
        url: apiUrl,
        data: newItem,
      });
      if (response.status !== 200) {
        throw new Error('Failed to create item');
      }else{
        onSubmit(newItem);
        setSuccess(true);
        if (!id) {
          setName('');
          setDescription('');
        }
      }
     
    } catch (err: any) {
      if (err.response) {
        setError(`Error ${err.response.status}: ${err.response.data.message}`);
      }else{
          setError(`Error: ${err.message}`);
      }
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h2 className="text-center">{item ? 'Edit Item' : 'Create Item'}</h2>
            </div>
            <div className="card-body">
            {success && (() => {
              const message = item ? 'Item updated successfully' : 'Item created successfully';
              return <AutoDismissAlert variant='success' message={message}  duration={5000}/>;
            })()}

              {error && (
                <AutoDismissAlert variant='danger' message={error} duration={5000} />
              )}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="description">Description:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="description"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                  />
                </div>
                <div className="form-group pt-3">
                  <button type="submit" className="btn btn-primary">
                    {item ? 'Update' : 'Create'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemComponent;