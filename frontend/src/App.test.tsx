import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';
import { Survivor } from './models/Survivor';
import { Item } from './models/Item';
import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';
import Reports from './components/Reports/Reports';

jest.mock('axios');  // Mock axios

// Mock survivor data
const mockSurvivor: Survivor = {
  id: 1,
  name: 'Survivor 1',
  age: 30,
  gender: 'Male',
  infected: false,
  lastLocationLat: 35.6895,
  lastLocationLong: 139.6917
};

// Mocking the component or the fetch call
jest.mock('./components/Survivor/Survivor', () => {
  return function MockSurvivorComponent() {
    return (
      <div>
        <h1>{mockSurvivor.name}</h1>
        <p>Age: {mockSurvivor.age}</p>
        <p>Gender: {mockSurvivor.gender}</p>
        <p>Infected: {mockSurvivor.infected ? 'Yes' : 'No'}</p>
      </div>
    );
  };
});

// Mock item data
const mockItem: Item = {
  id: 1,
  name: 'Item 1',
  description: 'Description for Item 1'
};

// Mocking the ItemComponent
jest.mock('./components/Item/Item', () => {
  return function MockItemComponent() {
    return (
      <div>
        <h1>{mockItem.name}</h1>
        <p>{mockItem.description}</p>
      </div>
    );
  };
});

const mock = new MockAdapter(axios);

// Mock the API responses for reports
mock.onGet(`${process.env.REACT_APP_API_SERVER_URL}/reports/infected-survivors`).reply(200, {
  infectedSurvivors: 40
});

mock.onGet(`${process.env.REACT_APP_API_SERVER_URL}/reports/non-infected-survivors`).reply(200, {
  nonInfectedSurvivors: 60
});

mock.onGet(`${process.env.REACT_APP_API_SERVER_URL}/reports/average-resources`).reply(200, {
  averageResources: 5
});
describe('App component', () => {
  it('renders SurvivalList component for / route', () => {
    render(
      <MemoryRouter initialEntries={['/']} >
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: 'Survival List' })).toBeInTheDocument();
  });

  it('renders SurvivorComponent for /survivor-list route', () => {
    render(
      <MemoryRouter initialEntries={['/survivor-list']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: 'Survival List' })).toBeInTheDocument();
  });

  it('renders SurvivorComponent for /survivor/:id route', () => {
    render(
      <MemoryRouter initialEntries={['/survivor/1']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Survivor 1' })).toBeInTheDocument();
    expect(screen.getByText('Age: 30')).toBeInTheDocument();
    expect(screen.getByText('Gender: Male')).toBeInTheDocument();
    expect(screen.getByText('Infected: No')).toBeInTheDocument();
  });

  it('renders ItemList component for /item-list route', () => {
    render(
      <MemoryRouter initialEntries={['/item-list']}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByRole('heading', { name: 'Item List' })).toBeInTheDocument();
  });

  it('renders ItemComponent for /items/:id route', () => {
    render(
      <MemoryRouter initialEntries={['/items/1']}>
        <App />
      </MemoryRouter>
    );

    expect(screen.getByRole('heading', { name: 'Item 1' })).toBeInTheDocument();
    expect(screen.getByText('Description for Item 1')).toBeInTheDocument();
  });
  
    it('renders Reports component and fetches data correctly', async () => {
      // Mock API responses for the three requests
      (axios.get as jest.Mock).mockResolvedValueOnce({ data: { infectedSurvivors: 60 } }) // Mock infected survivors
        .mockResolvedValueOnce({ data: { nonInfectedSurvivors: 40 } }) // Mock non-infected survivors
        .mockResolvedValueOnce({ data: { averageResources: 2.5 } }); // Mock average resources
  
        render(
          <MemoryRouter initialEntries={['/reports']}>
            <App />
          </MemoryRouter>
        );
    
  
      // Check for loading state first
      expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  
      // Wait for the data to be fetched and rendered
      await waitFor(() => {
        expect(screen.getByText(/Infected Survivors: 60%/i)).toBeInTheDocument();
        expect(screen.getByText(/Non-Infected Survivors: 40%/i)).toBeInTheDocument();
        expect(screen.getByText(/Average Resources per Survivor: 2.5/i)).toBeInTheDocument();
      });
  
    });
});
