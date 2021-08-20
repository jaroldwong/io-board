import { useState, useEffect } from 'react';
import Admin from './Admin';

import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.REACT_APP_SUPABASE_URL,
  process.env.REACT_APP_SUPABASE_KEY
);

const Main = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [locations, setLocations] = useState([]);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    async function fetchData() {
      const [userData, locationData] = await Promise.all([
        fetch('/users'),
        fetch('/locations'),
      ]);
      const userJson = await userData.json();
      const locationJson = await locationData.json();

      setUsers(userJson);
      setLocations(locationJson);
      setIsLoading(false);
    }

    fetchData();

    const mySubscription = supabase
      .from('*')
      .on('*', (payload) => {
        console.log('Change received!', payload);
        handleSubscription(payload);
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(mySubscription);
    };
  }, []);

  function handleSubscription(payload) {
    setUsers((prevState) =>
      prevState.map((u) =>
        u.id === payload.new.id
          ? { ...u, location_id: payload.new.location_id }
          : u
      )
    );
  }

  function handleChange(event, id) {
    const user = users.find((u) => u.id === id);
    const nextLocation = locations.find(
      (l) => l.building === event.target.value
    );
    const updatedUser = { ...user, location_id: nextLocation.id };

    fetch(`/users/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedUser),
    });

    setUsers((prevState) => {
      return prevState.map((user) =>
        user.id === id ? { ...user, building: event.target.value } : user
      );
    });
  }

  function handleAddUser(user) {
    const nextUsers = [...users, user];
    setUsers(nextUsers);
  }

  function getUserBuilding(user) {
    const location = locations.find((l) => l.id === user.location_id);
    return location ? location.building : null;
  }

  if (isLoading) {
    return (
      <progress
        className="progress is-primary"
        style={{
          width: '150px',
          position: 'absolute',
          top: '50%',
          left: '50%',
        }}
        max="100"
      />
    );
  } else {
    return (
      <div className="container">
        <table className="table is-fullwidth">
          <thead>
            <tr>
              <th></th>
              {locations.map((l) => (
                <th key={`${l.id}-${l.building}`}>{l.building}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.first_name}</td>
                {locations.map((l) => (
                  <td key={`${u}-${l.building}`}>
                    <input
                      name={u.id}
                      type="radio"
                      value={l.building}
                      checked={l.building === getUserBuilding(u)}
                      onChange={(event) => handleChange(event, u.id)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <Admin users={users} onAddUser={handleAddUser} />
      </div>
    );
  }
};

export default Main;
