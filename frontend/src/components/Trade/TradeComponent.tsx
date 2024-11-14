import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import DataTable, { TableColumn } from 'react-data-table-component';
import { useNavigate, useParams } from 'react-router-dom';
import { Item } from '../../models/Item';
import { Survivor } from '../../models/Survivor';
import AutoDismissAlert from '../AutoDismissAlert';
import { Trade } from '../../models/Trade';
import { format } from 'date-fns';

const TradeComponent = () => {
  const { id } = useParams<{ id: string }>();
  const [trades, setTrades] = useState<any[]>([]);
  const [survivor, setSurvivor] = useState<Survivor | null>(null);
  const [otherSurvivors, setOtherSurvivors] = useState<Survivor[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [tradeData, setTradeData] = useState({
    recipientId: '',
    giveItemId: '',
    giveQuantity: 0,
    receiveItemId: '',
    receiveQuantity: 0
  });
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);
  const [formattedTrades, setFormattedTrades] = useState<any[]>([]);
  const navigate = useNavigate();

  const getSurvivor = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_SERVER_URL}/survivors/${id}`);
      setSurvivor(response.data);
    } catch (err: any) {
      setError(`Error: ${err.response ? err.response.data.message : err.message}`);
    }
  }, [id]);

  const getTrades = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_SERVER_URL}/trades/survivor/${id}`);
      setTrades(response.data);
    } catch (err: any) {
      setError(`Error: ${err.response ? err.response.data.message : err.message}`);
    }
  }, [id]);

  const getItems = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_SERVER_URL}/items`);
      setItems(response.data);
    } catch (err: any) {
      setError(`Error: ${err.response ? err.response.data.message : err.message}`);
    }
  }, []);

  const getOtherSurvivors = useCallback(async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_SERVER_URL}/survivors`);
      setOtherSurvivors(response.data.filter((s: Survivor) => s.id !== Number(id)));
    } catch (err: any) {
      setError(`Error: ${err.response ? err.response.data.message : err.message}`);
    }
  }, [id]);

 const loadTrades = useCallback(() => {
    const formattedTrades = trades.map((trade: Trade) => {
      // Check if the trade is a "Give" or "Receive" action
      const isGiving = trade.action === 'Give';
  
      // Determine trade partner based on action type
      const tradePartner = isGiving
        ? otherSurvivors.find((s: Survivor) => s.id === trade.survivor2id)?.name
        : otherSurvivors.find((s: Survivor) => s.id === trade.survivor1id)?.name;
  
      // Use item names directly from the trade data
      const givenItemName = trade.itemgivenname || 'Unknown Item';
      const receivedItemName = trade.itemreceivedname || 'Unknown Item';
  
      // Format items with quantities
      const formattedGivenItem = isGiving ? `${givenItemName} (Qty: ${trade.quantitygiven})` : `${receivedItemName} (Qty: ${trade.quantityreceived})`
      const formattedReceivedItem = isGiving ? `${receivedItemName} (Qty: ${trade.quantityreceived})` : `${givenItemName} (Qty: ${trade.quantitygiven})`;
  
      return {
        id: trade.id,
        tradeDate: format(trade.createdat,'PPpp'),
        action: trade.action === 'Give' ? 'Give to' : 'Receive from',
        tradePartner,
        givenItem: formattedGivenItem,
        receivedItem: formattedReceivedItem,
      };
    });
  
    setFormattedTrades(formattedTrades);
  }, [trades, otherSurvivors]);
  
  

  useEffect(() => {
    getSurvivor();
    getTrades();
    getItems();
    getOtherSurvivors();
  }, [getSurvivor, getTrades, getItems, getOtherSurvivors]);

  useEffect(() => {
    if (trades.length && items.length && survivor && otherSurvivors.length) {
      loadTrades();
    }
  }, [trades, items, survivor, otherSurvivors, loadTrades]);

  const handleTradeSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      await axios.post(`${process.env.REACT_APP_API_SERVER_URL}/trades`, {
        survivor1Id: id,
        survivor2Id: tradeData.recipientId,
        itemGivenId: tradeData.giveItemId,
        quantityGiven: tradeData.giveQuantity,
        itemReceivedId: tradeData.receiveItemId,
        quantityReceived: tradeData.receiveQuantity
      });
      setTradeData({ recipientId: '', giveItemId: '', giveQuantity: 0, receiveItemId: '', receiveQuantity: 0 });
      setSuccess(true);
      getTrades();
    } catch (err: any) {
      setError(`Error: ${err.response ? err.response.data.message : err.message}`);
    }
  };

  const columns: TableColumn<any>[] = [
    {
      name: 'Trade Date',
      selector: (row) => row.tradeDate,
      sortable: true,
    },
    {
      name: 'Action',
      selector: (row) => row.action,
      sortable: true,
    },
    {
      name: 'Partner',
      selector: (row) => row.tradePartner,
      sortable: true,
    },
    {
      name: 'Given Item',
      selector: (row) => row.givenItem,
      sortable: true,
    },
    {
      name: 'Received Item',
      selector: (row) => row.receivedItem,
      sortable: true,
    },
  ];

  return (
    <div className="container mt-4">
      <div className="row md-2 justify-content-center">
        {success && <AutoDismissAlert variant="success" message="Trade created successfully" duration={5000} />}
        {error && <AutoDismissAlert variant="danger" message={error} duration={5000} />}
        <h2>Trades for {survivor?.name}</h2>
        <DataTable columns={columns} data={formattedTrades} pagination paginationPerPage={10} /> {/* Use formatted trades here */}
      </div>
      <div className="row md-2 justify-content-center">
        <div className="card">
          <div className="card-header">
            <h4>Create New Trade</h4>
          </div>
          <div className="card-body">
            <form onSubmit={handleTradeSubmit}>
              <div className="form-group">
                <label>Recipient Survivor:</label>
                <select className="form-control" value={tradeData.recipientId} onChange={(e) => setTradeData({ ...tradeData, recipientId: e.target.value })}>
                  <option value="">Select a survivor</option>
                  {otherSurvivors.map(survivor => (
                    <option key={survivor.id} value={survivor.id}>{survivor.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Item to Give:</label>
                <select className="form-control" value={tradeData.giveItemId} onChange={(e) => setTradeData({ ...tradeData, giveItemId: e.target.value })}>
                  <option value="">Select an item</option>
                  {items.map(item => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Quantity to Give:</label>
                <input type="number" className="form-control" value={tradeData.giveQuantity} onChange={(e) => setTradeData({ ...tradeData, giveQuantity: parseInt(e.target.value) })} />
              </div>
              <div className="form-group">
                <label>Item to Receive:</label>
                <select className="form-control" value={tradeData.receiveItemId} onChange={(e) => setTradeData({ ...tradeData, receiveItemId: e.target.value })}>
                  <option value="">Select an item</option>
                  {items.map(item => (
                    <option key={item.id} value={item.id}>{item.name}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
                <label>Quantity to Receive:</label>
                <input type="number" className="form-control" value={tradeData.receiveQuantity} onChange={(e) => setTradeData({ ...tradeData, receiveQuantity: parseInt(e.target.value) })} />
              </div>
              <div className="form-group pt-3">
                 <button type="submit" className="btn btn-primary">Create Trade</button>
                 <button type="button" className="btn btn-secondary ml-2" onClick={ () => navigate('/survivor-list')}>Go bck</button>
              </div> 
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TradeComponent;
