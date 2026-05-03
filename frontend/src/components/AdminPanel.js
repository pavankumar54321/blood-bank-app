import React, { useState, useEffect } from 'react';
import { donorService } from '../services/api';

const AdminPanel = () => {
  const [donors, setDonors] = useState([]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    setIsLoading(true);
    try {
      const data = await donorService.getAllDonors();
      setDonors(data);
    } catch (error) {
      setMessage('Failed to fetch donors: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id, name) => {
    if (window.confirm(`Are you sure you want to completely remove ${name} from the system? This action cannot be undone.`)) {
      try {
        await donorService.deleteDonor(id);
        setMessage(`${name} has been successfully removed.`);
        fetchDonors(); // Refresh the list
      } catch (error) {
        setMessage('Failed to delete user: ' + error.message);
      }
    }
  };

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '20px' }}>
      <div style={{ background: '#343a40', color: 'white', padding: '30px', borderRadius: '15px', marginBottom: '30px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
        <h2 style={{ margin: 0, fontSize: '2rem' }}>Admin Dashboard</h2>
        <p style={{ margin: '10px 0 0', opacity: 0.8 }}>Manage all registered users and remove fraudulent accounts.</p>
      </div>

      {message && (
        <div style={{ padding: '15px', background: message.includes('Failed') ? '#f8d7da' : '#d4edda', color: message.includes('Failed') ? '#721c24' : '#155724', borderRadius: '8px', marginBottom: '20px' }}>
          {message}
        </div>
      )}

      <div style={{ background: 'white', borderRadius: '15px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', overflow: 'hidden' }}>
        {isLoading ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>Loading users...</div>
        ) : donors.length === 0 ? (
          <div style={{ padding: '40px', textAlign: 'center' }}>No users found in the system.</div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ background: '#f8f9fa', textAlign: 'left' }}>
                  <th style={{ padding: '15px 20px', borderBottom: '2px solid #dee2e6' }}>Photo</th>
                  <th style={{ padding: '15px 20px', borderBottom: '2px solid #dee2e6' }}>Name</th>
                  <th style={{ padding: '15px 20px', borderBottom: '2px solid #dee2e6' }}>Blood Group</th>
                  <th style={{ padding: '15px 20px', borderBottom: '2px solid #dee2e6' }}>City</th>
                  <th style={{ padding: '15px 20px', borderBottom: '2px solid #dee2e6' }}>Phone</th>
                  <th style={{ padding: '15px 20px', borderBottom: '2px solid #dee2e6' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {donors.map(donor => (
                  <tr key={donor.id} style={{ borderBottom: '1px solid #e9ecef' }}>
                    <td style={{ padding: '15px 20px' }}>
                      {donor.profilePhotoBase64 ? (
                        <img src={donor.profilePhotoBase64} alt={donor.name} style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: '#ccc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>👤</div>
                      )}
                    </td>
                    <td style={{ padding: '15px 20px', fontWeight: '500' }}>{donor.name}</td>
                    <td style={{ padding: '15px 20px' }}>
                      <span style={{ background: '#dc3545', color: 'white', padding: '4px 8px', borderRadius: '4px', fontSize: '0.85rem' }}>{donor.bloodGroup}</span>
                    </td>
                    <td style={{ padding: '15px 20px' }}>{donor.city}</td>
                    <td style={{ padding: '15px 20px' }}>{donor.phoneNumber}</td>
                    <td style={{ padding: '15px 20px' }}>
                      <button 
                        onClick={() => handleDelete(donor.id, donor.name)}
                        style={{ background: '#dc3545', color: 'white', border: 'none', padding: '8px 12px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}
                      >
                        Remove User
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;
