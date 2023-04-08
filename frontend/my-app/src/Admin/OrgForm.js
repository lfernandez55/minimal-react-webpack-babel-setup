import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrganizationForm = () => {
  const [organizations, setOrganizations] = useState([]);
  const [organization, setOrganization] = useState({
    name: '',
    parent: '',
    children: []
  });

  const fetchOrganizations = async () => {
    const response = await axios.get('/api/orgs');
    setOrganizations(response.data);
  };

  useEffect(() => {
    fetchOrganizations();
  }, []);

  const handleChange = (e) => {
    setOrganization({
      ...organization,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (organization._id) {
      // Edit organization
      await axios.put(`/api/orgs/${organization._id}`, organization);
    } else {
      // Create organization
      await axios.post('/api/orgs', organization);
    }
    setOrganization({ name: '', parent: '', children: [] });
    fetchOrganizations();
  };

  const renderParentOptions = () => {
    return organizations.map((org) => (
      <option key={org._id} value={org._id}>
        {org.name}
      </option>
    ));
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Name:</label>
      <input
        type="text"
        name="name"
        value={organization.name}
        onChange={handleChange}
      />
      <label>Parent:</label>
      <select
        name="parent"
        value={organization.parent}
        onChange={handleChange}
      >
        <option value="">Select a parent organization</option>
        {renderParentOptions()}
      </select>
      <button type="submit">{organization._id ? 'Edit' : 'Create'}</button>
    </form>
  );
};

export default OrganizationForm;
