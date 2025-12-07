import React from 'react';

const DonorList = ({ donors }) => {
  if (!donors || donors.length === 0) {
    return null;
  }

  return (
    <div>
      <h3>Search Results ({donors.length} donors found)</h3>
      <div style={{ display: 'grid', gap: '15px' }}>
        {donors.map((donor, index) => (
          <div
            key={index}
            style={{
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '15px',
              backgroundColor: '#f9f9f9'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h4 style={{ margin: '0', color: '#333' }}>{donor.name}</h4>
              <span 
                style={{
                  backgroundColor: '#dc3545',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              >
                {donor.bloodGroup}
              </span>
            </div>
            <div style={{ marginTop: '10px', color: '#666' }}>
              <p style={{ margin: '5px 0' }}>
                <strong>City:</strong> {donor.city}
              </p>
              <p style={{ margin: '5px 0' }}>
                <strong>Phone:</strong> {donor.phoneNumber}
              </p>
              <p style={{ margin: '5px 0' }}>
                <strong>Last Donation:</strong> {donor.lastDonationDate || 'Not specified'}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DonorList;