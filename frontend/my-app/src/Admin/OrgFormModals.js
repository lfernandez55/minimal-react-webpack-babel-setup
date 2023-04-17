import React, { useState, useContext } from "react";
import { AppContext } from '../App'
import Modal from "react-modal";


Modal.setAppElement("#root");

const OrgFormModals = () => {
    let { users, roles } = useContext(AppContext)

    const [isOpen, setIsOpen] = useState(false);

    const handleOpenModal = (e) => {
        e.preventDefault();
        console.log("In handleOpenModal")
        setIsOpen(true);
    };

    const handleCloseModal = () => {
        setIsOpen(false);
    };

    //Begin user field handlers
    const [searchTerm, setSearchTerm] = useState('');

    const handleInputChange = event => {
      setSearchTerm(event.target.value);
    };
  
    const filteredUsers = users.filter(user =>
      user.username.toLowerCase().includes(searchTerm.toLowerCase())
    ).slice(0, 10);



    return (
        <div>
            <div>Begin....</div>
            <button onClick={handleOpenModal}>Add Users</button>
            <Modal isOpen={isOpen} onRequestClose={handleCloseModal}>
                <h2>Example Modal</h2>
                <p>This is an example modal using react-modal!</p>
                <div className="field">
                    <label htmlFor="roles">Roles</label>
                    <div className="control">
                        {/* todo: add formik stuff below: value={formik.values.roles} onChange={formik.handleChange} */}
                        <select className="form-select form-select-sm" name="roles" multiple  >

                            {/* <select className="form-select form-select-sm" name="roles" multiple  onChange={formik.handleChange} > */}
                            {
                                roles.map((e, i) => {
                                    return (<option key={i} value={e._id} >{e.name}</option>)
                                })
                            }
                        </select>

                    </div>
                </div>

                <div className="field">
                    <label htmlFor="roles">User</label>
                    <div className="control">
                        <input type="text" onChange={handleInputChange} value={searchTerm} />
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
            <div>...End</div>
        </div>
    );
};

export default OrgFormModals;