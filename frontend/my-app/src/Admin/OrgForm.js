import React, { useState, useEffect, useContext} from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom'
import { toast } from 'react-toastify'
import { AppContext } from '../App'
import Select from 'react-select';
import OrgFormModals from './OrgFormModals'

const OrganizationForm = () => {
    const navigate = useNavigate()
    let { users, roles, orgs, setOrgs } = useContext(AppContext)
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

    let orgToEdit;
    let initialSelectedOption;
    if (oid){
        orgToEdit = orgs.find(o => o._id === oid)
        if(orgToEdit.parent !== null){
            // some org in the orgs have parent = {parrentObj}, others have parent = objectReferenceId
            // set them all to parent = objectReferenceId
            if( orgToEdit.parent._id !== undefined){
                orgToEdit.parent = orgToEdit.parent._id
            }
            let orgtoeditParent = orgs.find(o => o._id === orgToEdit.parent)
            initialSelectedOption    = { value: orgToEdit.parent, label: orgtoeditParent.name }
        }else{
            //editing the root element so set initialSelectedOption to null (TODO: Validation)
            initialSelectedOption = { value: null, label: 'Null (Root element)' }
        }

    }else{
        //creating a new element so set initialSelectedOption to root element
        orgToEdit = { name: '', parent: orgs[0] }
        initialSelectedOption = { value: orgs[0]._id, label: orgs[0].name }
    }



    // setSelectedOption(initialSelectedOption);
    const [selectedOption, setSelectedOption] = useState(initialSelectedOption);


    const [org, setOrg] = useState(orgToEdit);
    console.log("org:", org)
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
        console.log("in handleSubmit. . .", e)

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
                        toast.success('Org updated successfully.', {
                            autoClose: 1000});
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
        // let parentItem = orgs.find(o => o._id === selectedOption.value) 
        // let cloneOrg = {...org}
        // cloneOrg.parent = parentItem
        setOrg({...org, parent: selectedOption.value})
        setSelectedOption(selectedOption);

    }

    const renderUserRoles = () =>{

        return org.users.map(userRole => (
            <div key={userRole.user}>{renderUsername(userRole.user)} | {renderUserrole(userRole.role)}</div>
        ))
    }
    const renderUsername = (uid) =>{
        const user = users.find(u => u._id === uid )
        return user.username
    }
    const renderUserrole = (rid) =>{
        const role = roles.find(r => r._id === rid )
        return role.name
    }

    return (
        <div className="react-stuff form">
            <form onSubmit={handleSubmit}>
                <div className="field">
                    <label>Name: {org.name}</label>
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
                    <label>Parentx:</label>
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
                    <div>Users:</div>
                    {renderUserRoles()}
                </div>
                <div className="field">
                    <div>&nbsp;</div>
                    <div className="control">
                        <OrgFormModals org={org} setOrg={setOrg} />
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
