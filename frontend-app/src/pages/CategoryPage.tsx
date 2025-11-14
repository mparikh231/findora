import { useParams } from 'react-router-dom';
import ListingCard from '../components/ListingCard';

const CategoryPage = () => {
    const { id: categoryId } = useParams();

    const listings = [
        { id: 1, title: "Listing 1", description: "Description for Listing 1", price: 100, image: "https://dummyimage.com/300x200/000/fff" },
        { id: 2, title: "Listing 2", description: "Description for Listing 2", price: 200, image: "https://dummyimage.com/300x200/000/fff" },
        { id: 3, title: "Listing 3", description: "Description for Listing 3", price: 300, image: "https://dummyimage.com/300x200/000/fff" },
        { id: 4, title: "Listing 4", description: "Description for Listing 4", price: 400, image: "https://dummyimage.com/300x200/000/fff" },
        { id: 5, title: "Listing 5", description: "Description for Listing 5", price: 500, image: "https://dummyimage.com/300x200/000/fff" },
        { id: 6, title: "Listing 6", description: "Description for Listing 6", price: 600, image: "https://dummyimage.com/300x200/000/fff" },
        { id: 7, title: "Listing 7", description: "Description for Listing 7", price: 700, image: "https://dummyimage.com/300x200/000/fff" },
        { id: 8, title: "Listing 8", description: "Description for Listing 8", price: 800, image: "https://dummyimage.com/300x200/000/fff" }
    ];

    return (
        <section className="">
            <div className='banner banner-sm bg-secondary text-white mb-4 py-4'>
                <div className='container'>
                    <h1 className='display-6 text-white h3 mb-0'>Category {categoryId}</h1>
                </div>
            </div>
            <div className='container mt-5'>
                <div className="row">
                    {listings.length === 0 && (<p>No listings available.</p>)}
                    {listings.length > 0 && (
                        <div className="row">
                            {listings.map(listing => (
                                <div key={listing.id} className="col-md-3">
                                    <ListingCard listing={listing} />
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default CategoryPage;
