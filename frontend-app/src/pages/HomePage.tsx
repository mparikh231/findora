import { Link } from "react-router-dom";
import ListingCard from "../components/ListingCard";

const HomePage = () => {
    const categories = [
        { id: 1, name: "Category 1" },
        { id: 2, name: "Category 2" },
        { id: 3, name: "Category 3" },
        { id: 4, name: "Category 4" },
        { id: 5, name: "Category 5" }
    ];
    
    const listings = [
        { id: 1, title: "Listing 1", description: "Description for Listing 1", price: 100, image: "https://dummyimage.com/300x200/000/fff" },
        { id: 2, title: "Listing 2", description: "Description for Listing 2", price: 200, image: "https://dummyimage.com/300x200/000/fff" },
        { id: 3, title: "Listing 3", description: "Description for Listing 3", price: 300, image: "https://dummyimage.com/300x200/000/fff" },
        { id: 4, title: "Listing 4", description: "Description for Listing 4", price: 400, image: "https://dummyimage.com/300x200/000/fff" },
        { id: 5, title: "Listing 5", description: "Description for Listing 5", price: 500, image: "https://dummyimage.com/300x200/000/fff" },
        { id: 6, title: "Listing 6", description: "Description for Listing 6", price: 600, image: "https://dummyimage.com/300x200/000/fff" }
    ];
    return (
       <section className="home-page">
        <section className="banner bg-secondary text-white text-center py-5 mb-4">
            <div className="container text-center py-5">
                <h1 className="display-4">Welcome to Findora</h1>
                <p className="lead mb-0">Your gateway to secure and private financial services.</p>
            </div>
        </section>
        <section className="features">
            <div className="container">
                <div className="row justify-content-center">
                    <div className="col-md-4">
                        {listings.length === 0 && (<p>No listings available.</p>)}
                        {listings.length > 0 && (
                            <div className="row">
                                {listings.map((listing) => (
                                    <div key={`home-listing-${listing.id}`} className="col-md-4">
                                        <ListingCard listing={listing} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <div className="col-md-3">
                        {categories.length > 0 && (
                            <div className="card">
                                <div className="card-header">
                                    <h6 className="mb-0">Categories</h6>
                                </div>
                                <ul className="list-group list-group-flush">
                                    {categories.map((category) => (
                                        <li key={category.id} className="list-group-item">
                                            <Link to={`/categories/${category.id}`} className="text-decoration-none">{category.name}</Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
       </section>
    );
};

export default HomePage;
