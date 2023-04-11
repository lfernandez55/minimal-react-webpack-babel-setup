import React, { useState, useEffect, useContext} from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AppContext } from '../App'

const OrganizationForm = () => {
    const navigate = useNavigate()
    let { orgs, setOrgs } = useContext(AppContext)

    let { oid } = useParams()
    // let is_new = oid === undefined
    let orgToEdit = oid ? orgs.find(o => o._id === oid) : {
        name: '',
        parent: '',
        children: []
    }
    

    const [org, setOrg] = useState(orgToEdit);
    console.log("org", org);
    const fetchOrgs = async () => {
        const response = await axios.get('/api/orgs');
        setOrgs(response.data);
    };

    // useEffect(() => {
    //     fetchOrganizations();
    // }, []);

    const handleChange = (e) => {
        setOrg({
            ...org,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // if (org._id) {
        //     // Edit org
        //     await axios.put(`/api/orgs/${org._id}`, org);
        // } else {
        //     // Create org
        //     await axios.post('/api/orgs', org);
        // }
        // setOrganization({ name: '', parent: '', children: [] });
        // fetchOrganizations();

        if (org._id) {
            // Edit org
            fetch(`/api/orgs/${org._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(org)
            })
                .then(response => {
                    if (response.ok) {
                        toast.success('Org updated successfully.');
                        // setOrgs({ name: '', parent: '', children: [] });
                        fetchOrgs();
                        navigate('/admin/orgs', { state: { oid: org._id } }); // navigate to admin/orgs
                    } else {
                        toast.error('Failed to update org.');
                    }
                })
                .catch(error => {
                    toast.error('Failed to update org.');
                });
        } else {
            // Create org
            fetch('/api/orgs', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(org)
            })
                .then(response => {
                    if (response.ok) {
                        toast.success('Org created successfully.');
                        // setOrg({ name: '', parent: '', children: [] });
                        fetchOrgs();
                        navigate('/admin/orgs'); // navigate to admin/orgs
                    } else {
                        toast.error('Failed to create org.');
                    }
                })
                .catch(error => {
                    toast.error('Failed to create org.');
                });
        }

    };

    const renderParentOptions = () => {
        return orgs.map((o) => (

                <option key={o._id} value={o._id}>
                    {o.name}
                </option>

        ))
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
                            value={org.name}
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <div className="field">
                    <label>Parent:</label>
                    <div className="control">
                        <select
                            name="parent"
                            value={org.parent._id}
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
                        <button type="submit">{org._id ? 'Update' : 'Create'}</button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default OrganizationForm;
