import React, { useState, useEffect } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { Alert } from 'react-bootstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Item } from '../../models/Item';
import { useNavigate } from 'react-router-dom';

const ItemListComponent = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    const getItems = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${process.env.REACT_APP_API_SERVER_URL}/items`)
            setItems(response.data);
        } catch (err: any) {
            if (err.response) {
                setError(`Error ${err.response.status}: ${err.response.data.message}`);
            }else{
                setError(`Error: ${err.message}`);
            }
            console.error(error);
        } finally {
        setLoading(false);
        }
    };

    getItems();
  }, [error,navigate]);

  const columns: TableColumn<Item>[] = [
    {
      name: 'Name',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Description',
      selector: (row) => row.description,
      sortable: true,
    },
    {
      name: 'Actions',
      selector: (row) => row.id,
      sortable: false,
      cell: (row) => (
        <Link to={`/items/${row.id}`}>
          <button type="button" className="btn btn-secondary btn-sm">
            View Details
          </button>
        </Link>
      ),
    },
  ];

  return (
    <div className="container mt-5">
      <h1>Item List</h1>
      {error && <Alert variant="danger">{error}</Alert>}
          {loading ? (
            <p>Loading...</p>
          ) : (
          <DataTable
            columns={columns}
            data={items}
            progressPending={loading}
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[10, 20, 50]}
            defaultSortAsc={true}
            className="table table-striped table-bordered table-hover"
          />
          )}
    </div>
  );
};

export default ItemListComponent;