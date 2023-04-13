import React, { useState, useEffect, useContext} from 'react';
import Select from 'react-select';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AppContext } from '../App'

const OrganizationForm = () => {
    const navigate = useNavigate()
    let { orgs, setOrgs } = useContext(AppContext)


    const options = orgs.map(element => {
        let newObj = {}
        newObj.value = element._id
        newObj.label = element.name
        return newObj
        
    });

    let { oid } = useParams()

    let orgToEdit = oid ? orgs.find(o => o._id === oid) : {
        name: '',
        parent: {}
    }

    let selectedOption;
    if(orgToEdit.parent._id == undefined){
        selectedOption = oid ? options.find(option => option.value === orgToEdit.parent) : options[0]
    }else{
        selectedOption = oid ? options.find(option => option.value === orgToEdit.parent._id) : options[0]
    }
    

    const [org, setOrg] = useState(orgToEdit);

    const fetchOrgs = async () => {
        const response = await axios.get('/api/orgs');
        setOrgs(response.data);
    };


    const handleChange = (e) => {
        console.log(e.target)
        setOrg({
            ...org,
            [e.target.name]: e.target.value
        });
    };

    const handleChange2 = (selectedOption) => {
        console.log(selectedOption)
        let cloneOrg = {org}
        // console.log("cloneOrg1",cloneOrg)
        cloneOrg.parent = selectedOption.value
        // console.log("cloneOrg2", cloneOrg)
        console.log("debug1",org)
        setOrg(cloneOrg)
        console.log("debug2",org)
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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
                    <div>{org.parent?._id | org.parent }</div>
                    <label>Parent:</label>
                    <div className="control">
                         <Select
                            options={options}
                            isSearchable={true}
                            isClearable={false}
                            onChange={handleChange2}
                            defaultValue={selectedOption}
                        />
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
