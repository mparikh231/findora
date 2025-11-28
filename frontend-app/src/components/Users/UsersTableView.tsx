import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import type { UsersTableViewProps } from "../../types/Users";
import { Edit, Trash } from "lucide-react";
import { useState, useContext } from "react";
import { UserContext } from "../../context/UserContext";

const UsersTableView = (props: UsersTableViewProps) => {

    const userContext = useContext(UserContext);
    const { user: currentUser } = userContext || {};
    const { users, isLoading = false, editUser, deleteUser } = props;
    const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
    const [selectedUser_id, setSelectedUser_id] = useState<number | null>(null);

    return (
        <>
            <div className="card overflow-hidden">
                <div className="table-responsive">
                    <table className="table mb-0">
                        <thead className="bg-light">
                            <tr>
                                <th className="text-center" style={{ width: '50px' }}>#</th>
                                <th>Full Name</th>
                                <th>Email Address</th>
                                <th>User Name</th>
                                <th>Role</th>
                                <th>Status</th>
                                <th style={{ width: '120px' }}>Create Date</th>
                                <th style={{ width: '120px' }} className="text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {isLoading === true && (    
                                <tr>
                                    <td colSpan={8} className="text-center">Loading users...</td>
                                </tr>
                            )}

                            {isLoading !== true && (!users || users.length === 0) && (
                                <tr>
                                    <td colSpan={8} className="text-center">No users found.</td>
                                </tr>
                            )}

                            {isLoading !== true && users && users.length > 0 && users.map((user, index) => (
                                <tr key={`userTableRow-${user.user_id}`}>
                                    <td className="text-center">{index + 1}</td>
                                    <td>{user.first_name} {user.last_name}</td>
                                    <td>{user.email}</td>
                                    <td>{user.user_name}</td>
                                    <td>{user.role}</td>
                                    <td>{user.status ? "Active" : "Inactive"}</td>
                                    <td>{new Date(user.created_at).toLocaleDateString()}</td>
                                    <td className="text-center">
                                        <button className="btn btn-sm btn-link text-dark" onClick={() => editUser && editUser(user.user_id)}><Edit size={16} /></button>

                                        <button className="btn btn-sm btn-link text-danger" onClick={() => {setSelectedUser_id(user.user_id); setIsModalOpen(true);}} disabled={currentUser?.user_id === user.user_id}><Trash size={16} /></button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
            <Modal isOpen={isModalOpen} size="sm">
                <ModalHeader toggle={() => setIsModalOpen(false)}>Are you sure?</ModalHeader>
                <ModalBody>
                    Do you really want to delete this user? This process cannot be undone.
                </ModalBody>
                <ModalFooter>
                    <button className="btn btn-secondary" onClick={() => { setIsModalOpen(false) }}>Cancel</button>
                    <button className="btn btn-danger" onClick={() => {

                        if(deleteUser) deleteUser(selectedUser_id as number);
                        setIsModalOpen(false);
                    }}>Delete</button>
                </ModalFooter>
            </Modal>
        </>
    );
};

export default UsersTableView;