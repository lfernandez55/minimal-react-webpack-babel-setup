import React, { useState, useEffect, useContext} from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AppContext } from '../App'
import Select from 'react-select';

const OrganizationForm = () => {
    const navigate = useNavigate()
    let { orgs, setOrgs } = useContext(AppContext)
    // const [selectedOption, setSelectedOption] = useState(null);

    useEffect(() => {
        let url = 'api/orgs'
        fetch(url, {
            method: "GET",
        })
            .then((response) => {
                return response.json();
            })
            .then((resp) => {
                if (resp.success === false) {
                    navigate("/errorapi")
                } else {
                    setOrgs(resp)
                    // setUpdateDB(false)
                }
            })
            .catch((err) => {
                console.log(err.message);
                navigate("/errorapi")
            });
    },[])

    let { oid } = useParams()

    let orgToEdit = oid ? orgs.find(o => o._id === oid) : {
        name: '',
        parent: {}
    }
    if(orgToEdit.parent._id !== undefined){
        orgToEdit.parent = orgToEdit.parent._id
    }

    //set initial select value
    //first find the parent so u can get the name
    let parent = orgs.find(o => o._id === orgToEdit.parent)
    let selectedOptionCopy = { value: orgToEdit.parent, label: parent.name }

    // setSelectedOption(selectedOptionCopy);
    const [selectedOption, setSelectedOption] = useState(selectedOptionCopy);

    const [org, setOrg] = useState(orgToEdit);
    const fetchOrgs = async () => {
        const response = await axios.get('/api/orgs');
        setOrgs(response.data);
    };

    const handleChange = (e) => {
        setOrg({
            ...org,
            [e.target.name]: e.target.value
        });
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

    const renderParentOptions = () => {
        return orgs.map((o) => (
            
            // don't display the org that is being edited
            // otherwise you'd get a parent of itself
            o._id !== orgToEdit._id  ? (
                { value: o._id, label: o.name }
            ) : { value: null, label: null }
        ))
    };
    const handleChange2 = (selectedOption) => {
        console.log("selectedOption:", selectedOption)
        let orgFound = orgs.find(o => o._id === selectedOption.value) 
        setOrg(orgFound)
        setSelectedOption(selectedOption);

    }

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
                        <Select
                            name="parent"
                            value={selectedOption}
                            onChange={handleChange2}
                            options={renderParentOptions()}
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
