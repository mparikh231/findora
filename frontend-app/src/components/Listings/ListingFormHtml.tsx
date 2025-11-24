const ListingFormHtml = () => {
    return (
        <>
            <div className="mb-3">
                <label htmlFor="listingTitle" className="form-label">Title*</label>
                <input type="text" className="form-control" id="listingTitle" placeholder="Enter listing title" required />
            </div>

            <div className="mb-3">
                <label htmlFor="listingDescription" className="form-label">Description*</label>
                <textarea name="description" id="listingDescription" className="form-control" placeholder="Enter listing description" required rows={5}></textarea>
            </div>

            <div className="mb-3">
                <label htmlFor="listingPrice" className="form-label">Price*</label>
                <input type="text" className="form-control" id="listingPrice" placeholder="Enter listing price" required />
            </div>

            <div className="mb-3">
                <label htmlFor="listingLocation" className="form-label">Location</label>
                <input type="text" className="form-control" id="listingLocation" placeholder="Enter listing location" />
            </div>

            <div className="mb-3">
                <label htmlFor="listingState" className="form-label">State*</label>
                <select className="form-select" id="listingState" required>
                    <option value="">Select state</option>
                    <option value="new">New</option>
                    <option value="used">Used</option>
                </select>
            </div>

            <div className="mb-3">
                <label htmlFor="listingCity" className="form-label">City*</label>
                <select className="form-select" id="listingCity" required>
                    <option value="">Select city</option>
                    <option value="new">New</option>
                    <option value="used">Used</option>
                </select>
            </div>

            <div>
                <label htmlFor="listingCategory" className="form-label">Category*</label>
                <select className="form-select" id="listingCategory" required>
                    <option value="">Select category</option>
                    <option value="new">New</option>
                    <option value="used">Used</option>
                </select>
            </div>
        </>
    );
}

export default ListingFormHtml;