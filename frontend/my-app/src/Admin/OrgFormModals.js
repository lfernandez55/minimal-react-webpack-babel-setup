import React, { useState, useContext } from "react";
import { AppContext } from '../App'
import Modal from "react-modal";


Modal.setAppElement("#root");

const OrgFormModals = ({org, setOrg}) => {
    let { users, roles } = useContext(AppContext)
    //console.log("props in OrgFormModals", props)
    const [isOpen, setIsOpen] = useState(false);

    const handleOpenModal = (e) => {
        e.preventDefault();
        console.log("In handleOpenModal")
        setIsOpen(true);
    };

    const handleCloseModal = () => {
        let userRole = {}

        let userToEdit = users.find(u => u.username === document.getElementById("userName").value)
        userRole.user = userToEdit._id
        userRole.role = document.getElementById('roles').selectedOptions[0].value;
        let orgClone = {...org}
        orgClone.users.push(userRole)
        setOrg(orgClone)
        setIsOpen(false);
    };

    //Begin user field handlers
    const [searchTerm, setSearchTerm] = useState('');

    const handleInputChange = event => {
      setSearchTerm(event.target.value);
    };
  
    //shows only 10 users
    const filteredUsers = users.filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 10);



    return (
        <div>
            <button className="btn btn-secondary btn-sm" onClick={handleOpenModal}>Add Users</button>
            <Modal isOpen={isOpen} onRequestClose={handleCloseModal}>
                <h2>User</h2>
                <p>Add user and specify their role in the organization  </p>
                <div className="field">
                    <label htmlFor="roles">Roles</label>
                    <div className="control">
                    <div className="col-sm-2">
                        {/* todo: add formik stuff below: value={formik.values.roles} onChange={formik.handleChange} */}
                        <select className="form-select form-select-sm" name="roles" id="roles" multiple >

                            {/* <select className="form-select form-select-sm" name="roles" multiple  onChange={formik.handleChange} > */}
                            {
                                roles.map((e, i) => {
                                    return (<option key={i} value={e._id} >{e.name}</option>)
                                })
                            }
                        </select>
                        </div>
                    </div>
                </div>

                <div className="field">
                    <label htmlFor="roles">User</label>
                    <div className="control">
                        <input type="text" id="userName" onChange={handleInputChange} value={searchTerm} />
                        <ul>
                            {filteredUsers.map(user => (
                                <li key={user.id}>{user.username}</li>
                            ))}
                        </ul>

                    </div>
                </div>

                <div>

                </div>

                <button onClick={handleCloseModal}>Close Modal</button>
            </Modal>
        </div>
    );
};

export default OrgFormModals;