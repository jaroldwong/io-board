import { useState } from 'react';

const Admin = ({ users, onAddUser }) => {
  const [name, setName] = useState('');

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleNameSubmit = async (event) => {
    event.preventDefault();
    const [first, last] = name.split(' ');
    const res = await fetch(`/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        first_name: first,
        last_name: last,
      }),
    });

    const [user] = await res.json();
    onAddUser(user);
    setName('');
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'space-around' }}>
      <div>
        Add Users
        <ul>
          {users.map((u) => (
            <li>{`${u.first_name} ${u.last_name}`}</li>
          ))}
        </ul>
        <form onSubmit={handleNameSubmit}>
          <input
            placeholder="First Last"
            value={name}
            onChange={handleNameChange}
          ></input>
          <input type="submit" value="Add User"></input>
        </form>
      </div>
    </div>
  );
};

export default Admin;
