import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'

const OrganizationForm = () => {
    const navigate = useNavigate()

    const [organizations, setOrganizations] = useState([]);

    let { oid } = useParams()
    let is_new = oid === undefined
    let orgToEdit = oid ? organizations.find(o => o._id === oid) : {
        name: '',
        parent: '',
        children: []
    }


    const [organization, setOrganization] = useState(orgToEdit);

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
        // if (organization._id) {
        //     // Edit organization
        //     await axios.put(`/api/orgs/${organization._id}`, organization);
        // } else {
        //     // Create organization
        //     await axios.post('/api/orgs', organization);
        // }
        // setOrganization({ name: '', parent: '', children: [] });
        // fetchOrganizations();

        if (organization._id) {
            // Edit organization
            fetch(`/api/orgs/${organization._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(organization)
            })
                .then(response => {
                    if (response.ok) {
                        toast.success('Organization updated successfully.');
                        setOrganization({ name: '', parent: '', children: [] });
                        fetchOrganizations();
                        navigate('/admin/orgs'); // navigate to admin/orgs
                    } else {
                        toast.error('Failed to update organization.');
                    }
                })
                .catch(error => {
                    toast.error('Failed to update organization.');
                });
        } else {
            // Create organization
            fetch('/api/orgs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(organization)
            })
                .then(response => {
                    if (response.ok) {
                        toast.success('Organization created successfully.');
                        setOrganization({ name: '', parent: '', children: [] });
                        fetchOrganizations();
                        navigate('/admin/orgs'); // navigate to admin/orgs
                    } else {
                        toast.error('Failed to create organization.');
                    }
                })
                .catch(error => {
                    toast.error('Failed to create organization.');
                });
        }

    };

    const renderParentOptions = () => {
        return organizations.map((org) => (
            <option key={org._id} value={org._id}>
                {org.name}
            </option>
        ));
    };

    return (
        <div className="react-stuff form">
            <form onSubmit={handleSubmit}>
                <div className="field">
                    <label>Name:</label>
                    <div className="control">
                        <input
                            type="text"
                            name="name"
                            value={organization.name}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="field">
                    <label>Parent:</label>
                    <div className="control">
                        <select
                            name="parent"
                            value={organization.parent}
                            onChange={handleChange}
                        >
                            <option value="">Select a parent organization</option>
                            {renderParentOptions()}
                        </select>
                    </div>
                </div>
                <div className="field">
                    <label ></label>
                    <div className="control">
                        <button type="submit">{organization._id ? 'Edit' : 'Create'}</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default OrganizationForm;
