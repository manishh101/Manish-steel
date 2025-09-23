import React from 'react';
import HomepageSettings from '../../components/admin/HomepageSettings';

const AdminHomepage = () => {
  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Homepage Management</h1>
        <p className="text-gray-600 mt-2">
          Customize your homepage hero section and featured content
        </p>
      </div>
      
      <HomepageSettings />
    </div>
  );
};

export default AdminHomepage;
