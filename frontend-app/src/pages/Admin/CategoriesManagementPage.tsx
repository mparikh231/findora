import { Card, CardBody, CardFooter, CardHeader } from "reactstrap";
import { useEffect, useState } from "react";
import { Edit, Save, Trash, CornerDownRight } from "lucide-react";
import { formatDate, limitString } from "../../utils/helpers";
import  type { CategoryData, CategoryFormData } from "../../types/categories";
import apiCall from "../../utils/axios";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/ConfirmModal";

const CategoriesManagementPage = () => {

    const defaultCategoryFormData = {
        name: "",
        parentId: undefined,
        description: ""
    };

    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [categoryFormData, setCategoryFormData] = useState<CategoryFormData>(defaultCategoryFormData);
    const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);

    const handleAddNewCategoryFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload: CategoryFormData = {
                name: categoryFormData.name,
            };
            if(categoryFormData.parentId) payload.parentId = categoryFormData.parentId;
            if(categoryFormData.description) payload.description = categoryFormData.description;

            setIsLoading(true);
            const response = await apiCall.post("/categories", payload);
            const { status } = response.data;
            if(status === false) {
                toast.error("Failed to add category. Please try again.");
                return;
            }
            toast.success("Category added successfully.");
            setCategoryFormData(defaultCategoryFormData);
        } catch (error) {
            console.error("Error adding category:", error);
            toast.error("Failed to add category. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    const loadCategories = async () => {
        try {
            setIsLoading(true);
            const response = await apiCall.get("/categories");
            const { status, data } = response.data;
            if( status === false ) {
                toast.error("Failed to load categories. Please try again.");
                return;
            }
            setCategories(data as CategoryData[]);
        } catch (error) {
            console.error("Error loading categories:", error);
            toast.error("Failed to load categories. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    const deleteCategory = async (categoryId: number) => {
        try {
            setIsLoading(true);
            const response = await apiCall.delete(`/categories/${categoryId}`);
            const { status } = response.data;
            if (status === false) {
                toast.error("Failed to delete category. Please try again.");
                return;
            }
            toast.success("Category deleted successfully.");
            loadCategories();
        } catch (error) {
            console.error("Error deleting category",error);
            toast.error("Failed to delete category. Please try again.");
        } finally {
            setIsLoading(false);
            setDeleteCategoryId(null);
            setIsConfirmModalOpen(false);
        };
    }

    useEffect(() => {
        loadCategories();
    }, []);

    return <>
        <div className="d-flex align-items-center justify-content-between mb-4">
            <h3 className="mb-0">Categories</h3>
        </div>

        <div className="row">
            <form onSubmit={handleAddNewCategoryFormSubmit} className="col-md-4 col-lg-3">
                <Card>
                    <CardHeader>Add New Category</CardHeader>
                        <CardBody>
                        <div className="mb-3">
                            <label htmlFor="categoryName" className="form-label">Category Name*:</label>
                            <input type="text" id="categoryName" className="form-control" onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value})} value={categoryFormData?.name || ''} required={isLoading} />
                        </div>
                        <div className="mb-3">
                            <label htmlFor="parentCategory" className="form-label">Category Description:</label>
                            <select id="parentCategory" className="form-select" onChange={(e) => setCategoryFormData({ ...categoryFormData, parentId: e.target.value || undefined })} value={categoryFormData?.parentId || ''} disabled={isLoading}>
                                <option value="">-- None --</option>
                            </select>
                        </div>
                        <div>
                            <label htmlFor="categoryDescription" className="form-label">Category Description:</label>
                            <textarea id="categoryDescription" className="form-control" rows={3} onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value})} value={categoryFormData?.description || ''} disabled={isLoading}></textarea>
                        </div>
                    </CardBody>
                    <CardFooter>
                        <button className="btn btn-dark d-flex align-items-center gap-1" disabled={isLoading} type="submit">
                            <Save size={16} /> {isLoading ? "Saving..." : "Save"}
                        </button>
                    </CardFooter>
                </Card>
            </form>

            <div className="col-nd-8 col-lg-9">
                <div className="card overflow-hidden">
                    <div className="table-responsive">
                        <table className="table mb-0">
                            <thead className="bg-light">
                                <tr>
                                    <th className="text-center" style={{ width: "50px" }}>#</th>
                                    <th>Name</th>
                                    <th>Parent</th>
                                    <th>Description</th>
                                    <th style={{ width: "120px" }}>Create Date</th>
                                    <th style={{ width: "120px" }} className="text-center">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isLoading && (
                                    <tr>
                                        <td colSpan={6} className="text-center">Loading Categories...</td>
                                    </tr>
                                )}
                                {isLoading && (
                                    <tr>
                                        <td colSpan={5} className="text-center">No Categories Found.</td>
                                    </tr>
                                )}
                                {!isLoading && categories.length > 0 && categories.map((category, index) => {
                                    const subCategories = category.subCategories || [];
                                    return (
                                        <>
                                            <tr key={`category-tr-${category.id}-${index}`}>
                                                <td className="text-center">{category.id}</td>
                                                <td>{category.name}</td>
                                                <td>{limitString(category.description)}</td>
                                                <td>{formatDate(category.createdAt)}</td>
                                                <td className="text-center">
                                                    <button className="btn btn-sm btn-link text-dark">
                                                        <Edit size={16} />
                                                    </button>

                                                    <button
                                                        className="btn btn-sm btn-link text-danger"
                                                        onClick={() => {
                                                            setIsConfirmModalOpen(true);
                                                            setDeleteCategoryId(category.id);
                                                        }}
                                                    >
                                                        <Trash size={16} />
                                                    </button>
                                                </td>
                                            </tr>
                                            {subCategories.length > 0 && subCategories.map((subCategory, subIndex) => (
                                                <tr key={`subcategory-tr-${subCategory.id}-${subIndex}`} >
                                                    <td className="text-center">
                                                        <div className="d-flex align-items-center justify-content-center gap-1">
                                                            <CornerDownRight size={16} />{subCategory.id}
                                                        </div>
                                                    </td>
                                                    <td>{subCategory.name}</td>
                                                    <td>{limitString(subCategory.description)}</td>
                                                    <td>{formatDate(subCategory.createdAt)}</td>
                                                    <td className="text-center">
                                                        <button className="btn btn-sm btn-link text-dark">
                                                            <Edit size={16} />
                                                        </button>

                                                        <button
                                                            className="btn btn-sm btn-link text-danger"
                                                            onClick={() => {
                                                                setIsConfirmModalOpen(true);
                                                                setDeleteCategoryId(subCategory.id);
                                                            }}
                                                        >
                                                            <Trash size={16} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </>
                                    )
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
        <ConfirmModal 
            isOpen={isConfirmModalOpen}
            onConfirm={() => {
                deleteCategory(deleteCategoryId as number);
            }}
            onCancel={() => {
                setIsConfirmModalOpen(false);
                setDeleteCategoryId(null);
            }}
        />
    </>;
}

export default CategoriesManagementPage;