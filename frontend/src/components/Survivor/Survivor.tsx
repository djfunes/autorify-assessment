import React, { useEffect, useState } from 'react';
import { Survivor } from '../../models/Survivor';
import axios from 'axios';
import AutoDismissAlert from '../AutoDismissAlert';
import { useNavigate, useParams } from 'react-router-dom';

interface Props {
  onSubmit: (survivor: Survivor) => void;
}

const SurvivorComponent = ({ onSubmit }: Props) => {
  const { id } = useParams<{ id: string }>();
  const [survivor, setSurvivor] = useState<Survivor | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();


  useEffect(() => {
    const loadSurvivor = async () => {
      try {
        if (id) {
          const response = await axios.get(`${process.env.REACT_APP_API_SERVER_URL}/survivors/${id}`);
          if (response.status !== 200) {
            throw new Error('Failed to fetch survivor');
          }
          setSurvivor(response.data);
        } else {
          setSurvivor({
            id: 0,
            name: '',
            age: 0,
            gender: '',
            infected: false,
            lastLocationLat: 0,
            lastLocationLong: 0,
          });
        }
      } catch (err: any) {
        setError(err.response ? `Error ${err.response.status}: ${err.response.data.message}` : `Error: ${err.message}`);
      } finally {
        setLoading(false);
      }
    };
    loadSurvivor();
  }, [id]);


  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = event.target;
    const checked = type === 'checkbox' ? (event.target as HTMLInputElement).checked : undefined;

    setSurvivor((prev) => {
      if (!prev) return null; // Prevent updates if survivor is null
      return {
        ...prev,
        [name]: type === 'checkbox' ? checked : name === 'age' || name === 'lastLocationLat' || name === 'lastLocationLong' ? parseFloat(value) || 0 : value,
      };
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const apiUrl = survivor?.id ? `${process.env.REACT_APP_API_SERVER_URL}/survivors/${survivor.id}` : `${process.env.REACT_APP_API_SERVER_URL}/survivors`;
    const method = survivor?.id ? 'put' : 'post';

    try {
      const response = await axios({ method, url: apiUrl, data: survivor });
      if (response.status !== 200 && response.status !== 201) throw new Error('Failed to save survivor');
      onSubmit(survivor as Survivor);
      setSuccess(true);
      setSurvivor(null);
    } catch (err: any) {
      setError(err.response ? `Error ${err.response.status}: ${err.response.data.message}` : `Error: ${err.message}`);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!survivor) {
    return <div>Survivor not found</div>;
  }


  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h2 className="text-center">{survivor?.id ? 'Update Survivor' : 'New Survivor'}</h2>
            </div>
            <div className="card-body">
              {success && (
                <AutoDismissAlert
                  variant="success"
                  message={survivor?.id ? 'Survivor updated successfully' : 'Survivor created successfully'}
                  duration={5000}
                />
              )}
              {error && <AutoDismissAlert variant="danger" message={error} duration={5000} />}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="name">Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={survivor?.name || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="age">Age:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="age"
                    name="age"
                    value={survivor?.age || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="gender">Gender:</label>
                  <select
                    className="form-control"
                    id="gender"
                    value={survivor?.gender || ''}
                    onChange={handleChange}
                    name="gender"
                    required
                  >
                    <option value="">Select Gender</option>
                    <option value="M">Male</option>
                    <option value="F">Female</option>
                  </select>
                </div>
                <div className="form-group pt-3">
                  <label htmlFor="infected">C-Virus status:</label>
                </div>
                <div className="form-group form-check">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="infected"
                    name="infected"
                    checked={survivor?.infected || false}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="infected">
                    Infected
                  </label>
                </div>
                <div className="form-group">
                  <label htmlFor="lastLocationLat">Last Location Latitude:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastLocationLat"
                    name="lastLocationLat"
                    value={survivor?.lastLocationLat || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="lastLocationLong">Last Location Longitude:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="lastLocationLong"
                    name="lastLocationLong"
                    value={survivor?.lastLocationLong || ''}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group pt-3">
                  <button type="submit" className="btn btn-primary">
                    {survivor?.id ? 'Update' : 'Save'}
                  </button>
                  <button type="button" className="btn btn-secondary ml-2" onClick={ () => navigate('/survivor-list')}>Go back</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SurvivorComponent;
