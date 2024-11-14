import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import DataTable, { TableColumn } from 'react-data-table-component';
import { useNavigate, useParams } from 'react-router-dom';
import { Inventory } from '../../models/Inventory';
import { InventoryItem } from '../../models/InventoryItem';
import { Item } from '../../models/Item';
import { Survivor } from '../../models/Survivor';
import AutoDismissAlert from '../AutoDismissAlert';

const InventoryComponent = () => {
  const { id } = useParams<{ id: string }>();
  const [items, setItems] = useState<Item[]>([]);
  const [inventory, setInventory] = useState<Inventory[]>([]);
  const [newItem, setNewItem] = useState<{ itemId: string, quantity: number }>({ itemId: '', quantity: 0 });
  const [inventoryWithItems, setInventoryWithItems] = useState<InventoryItem[]>([]);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [survivor, setSurvivor] = useState<Survivor | null>(null);
  const navigate = useNavigate();

  //Fetch survivor
  const getSurvivor = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_SERVER_URL}/survivors/${id}`);
      setSurvivor(response.data);
    } catch (err: any) {
      setError(err.response ? `Error ${err.response.status}: ${err.response.data.message}` : `Error: ${err.message}`);
    }
  }, [id]);

  // Fetch all items
  const getItems = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_SERVER_URL}/items`);
      setItems(response.data);
    } catch (err: any) {
      setError(err.response ? `Error ${err.response.status}: ${err.response.data.message}` : `Error: ${err.message}`);
    }
  }, []);

  // Fetch inventory for a specific survivor
  const getInventory = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_SERVER_URL}/survivors/${id}/inventory`);
      setInventory(response.data);
      setLoading(false);
    } catch (err: any) {
      setError(err.response ? `Error ${err.response.status}: ${err.response.data.message}` : `Error: ${err.message}`);
    }
  }, [id]);

  const loadInventory = useCallback(() => {
    if (items.length ) {
      const inventoryData = items.map((item: Item) => {
        const itemInventory = inventory.find((inv: Inventory) => inv.itemId === item.id); 
        return {
          id: item.id,
          name: item.name,
          quantity: itemInventory ? itemInventory.quantity : 0,
        };
      });
      setInventoryWithItems(inventoryData);
    }
  }, [items, inventory]);
  

  useEffect(() => {
    getSurvivor();
    getItems();
    getInventory();
  }, [getItems, getInventory, getSurvivor]);

  useEffect(() => {
    loadInventory();
  }, [items, inventory, loadInventory]);

  const handleAddItem = async(event: React.FormEvent) => {
    event.preventDefault();
    try {
     await axios.post(`${process.env.REACT_APP_API_SERVER_URL}/survivors/${id}/inventory/add`, newItem)
      setNewItem({ itemId: '', quantity: 0 });
      getInventory();
      setSuccess(true);
    } catch (err: any) {
      setError(err.response ? `Error ${err.response.status}: ${err.response.data.message}` : `Error: ${err.message}`);
    }
     
  };

  const handleQuantityChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewItem({ ...newItem, quantity: parseInt(event.target.value) });
  };

  const handleItemChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setNewItem({ ...newItem, itemId: event.target.value });
  };

  const columns: TableColumn<InventoryItem>[] = [
    {
      name: 'Item',
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: 'Quantity',
      selector: (row) => row.quantity,
      sortable: true,
    },
  ];

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container fluid">
      <div className="row md-2 justify-content-center">
      {success && (
                <AutoDismissAlert
                  variant="success"
                  message={'Item added to inventory successfully'}
                  duration={5000}
                />
              )}
              {error && <AutoDismissAlert variant="danger" message={error} duration={5000} />}
          <h2>Inventory of {survivor?.name}</h2>
          <DataTable
            columns={columns}
            data={inventoryWithItems}
            pagination
            paginationPerPage={10}
            paginationRowsPerPageOptions={[10, 20, 30]}
          />
        </div>
        <div className="row md-2 justify-content-center">
          <div className="card">
            <div className="card-header">
              <h4>Add Item to Inventory</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleAddItem}>
                <div className="form-group">
                  <label>Item:</label>
                  <select className="form-control" value={newItem.itemId} onChange={handleItemChange}>
                    <option value="">Select an item</option>
                    {items.map(item => (
                      <option key={item.id} value={item.id}>{item.name}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Quantity:</label>
                  <input
                    type="number"
                    className="form-control"
                    value={newItem.quantity}
                    onChange={handleQuantityChange}
                  />
                </div>
                <div className='form-group pt-3'>
                  <button type="submit" className="btn btn-primary">Add Item</button>
                  <button type="button" className="btn btn-secondary" onClick={ () => navigate('/survivor-list')}>Go back</button>
                </div>
              </form>
            </div>
          </div>
      </div>
    </div>
  );
};

export default InventoryComponent;
