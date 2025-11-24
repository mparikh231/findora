import { useContext } from "react";
import { Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";
import { UserContext } from "../context/UserContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import type { SignOutModalProps } from "../types/General";

const SignOutModel = (SignOutModalProps: SignOutModalProps) => {

    const { isOpen, onModalChange } = SignOutModalProps;
    const navigate = useNavigate();
    const userContext = useContext(UserContext);
    const { logOut } = userContext || {};
    const handleSignout = () => {
        logOut && logOut();
        toast.success("Signed out successfully.");
        navigate('/signin');
        onModalChange && onModalChange(false);
    }

    const closeModel = () => {
        onModalChange && onModalChange(false);
    }

    return (
        <Modal isOpen={isOpen} size="sm" toggle={closeModel}>
            <ModalHeader toggle={closeModel}>Sign Out</ModalHeader>
            <ModalBody>Are you sure you want to sign out?</ModalBody>
            <ModalFooter>
                <button className="btn btn-secondary" onClick={closeModel}>No</button>
                <button className="btn btn-dark" onClick={handleSignout}>Yes</button>
            </ModalFooter>
        </Modal>
    )
}

export default SignOutModel;