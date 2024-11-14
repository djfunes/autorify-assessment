import React, { useState, useEffect } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { Survivor } from '../../models/Survivor';
import AutoDismissAlert from '../AutoDismissAlert';

const SurvivalList = () => {
  const [survivors, setSurvivors] = useState<Survivor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
  const getSurvivors = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_SERVER_URL}/survivors`);
      if (response.status !== 200) {
        throw new Error('Failed to fetch survivors');
      }
      setSurvivors(response.data);
    } catch (err: any) {
      if (err.response) {
        setError(`Error ${err.response.status}: ${err.response.data.message}`);
      } else {
        setError(`Error: ${err.message}`);
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
    getSurvivors();
  }, [error, navigate]);

  const columns: TableColumn<Survivor>[] = [
    {
      name: 'Name',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Age',
      selector: (row) => row.age,
      sortable: true,
    },
    {
      name: 'Gender',
      selector: (row) => row.gender,
      sortable: true,
    },
    {
      name: 'Infected',
      selector: (row) => (row.infected ? 'Yes' : 'No'),
      sortable: true,
    },
    {
      name: 'Last Lat',
      selector: (row) => row.lastLocationLat,
      sortable: true,
    },
    {
      name: 'Last Long',
      selector: (row) => row.lastLocationLong,
      sortable: true,
    },
    {
      name: 'Actions',
      selector: (row) => row.id,
      sortable: false,
      width: '40%',
      cell: (row) => (
        <div className="d-flex justify-content-start align-items-center">
          <Link to={`/survivor/${row.id}`}>
            <button type="button" className="btn btn-secondary p-3 py-2">
              View Details
            </button>
          </Link>
          <span className="mx-3">|</span>
          <Link to={`/survivor/inventory/${row.id}`}>
            <button type="button" className="btn btn-secondary p-3 py-2">
              View Inventory
            </button>
          </Link>
          <span className="mx-3">|</span>
          <Link to={`/survivor/trades/${row.id}`}>
            <button type="button" className="btn btn-secondary p-3 py-2">
              View Trades
            </button>
          </Link>
        </div>
      )
    },
  ];

  return (
    <div className="container fluid">
      <h1>Survival List</h1>
      {error && <AutoDismissAlert message={error} variant="danger" />}
              {loading ? (
            <p>Loading...</p>
          ) : (
        <DataTable
          columns={columns}
          data={survivors}
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

export default SurvivalList;