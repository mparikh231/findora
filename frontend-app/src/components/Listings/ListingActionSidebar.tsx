import { Offcanvas } from "reactstrap";
import type { ListingActionSidebarProps } from "../../types/Listing";
import { Save, X } from "lucide-react";
import ListingFormHtml from "./ListingFormHtml";

const ListingActionSidebar = (props: ListingActionSidebarProps) => {
    const { isOpen, onModalChange, action, listingId } = props;

    return (
        <Offcanvas isOpen={isOpen} toggle={() => onModalChange && onModalChange(!isOpen)} direction="end">
            <div className="offcanvas-header border-bottom">
                <h5 className="offcanvas-title mb-0">{action === 'add' ? 'Add New Listing' : 'Edit Listing'}</h5>
                <button type="button" className="btn-close text-reset" aria-label="Close" onClick={() => onModalChange && onModalChange(false)}></button>
            </div>
            <div className="offcanvas-body">
                <ListingFormHtml />
            </div>
            <div className="offcanvas-footer border-top d-flex align-items-center justify-content-between">
                <button type="submit" className="btn btn-dark d-flex align-items-center gap-1"><Save size={18} /> Save</button>
                <button type="button" className="btn btn-secondary d-flex align-items-center gap-1" onClick={() => onModalChange && onModalChange(false)}><X size={18} /> Cancel</button>
            </div>
        </Offcanvas>
    );
};

export default ListingActionSidebar;