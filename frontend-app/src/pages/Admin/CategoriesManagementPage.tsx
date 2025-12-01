import { Card, CardBody, CardFooter, CardHeader } from "reactstrap";
import { useEffect, useState } from "react";
import { Edit, Save, Trash, CornerDownRight, X } from "lucide-react";
import { formatDate, limitString } from "../../utils/helpers";
import  type { CategoryData, CategoryFormData } from "../../types/categories";
import apiCall from "../../utils/axios";
import { toast } from "react-toastify";
import ConfirmModal from "../../components/ConfirmModal";

const CategoriesManagementPage = () => {

    const defaultCategoryFormData = {
        name: "",
        parentId: undefined,
        description: "",
        id: undefined
    };

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isFormLoading, setIsFormLoading] = useState<boolean>(false);
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [categoryFormData, setCategoryFormData] = useState<CategoryFormData>(defaultCategoryFormData);
    const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);
    const [action, setAction] = useState<"add" | "edit">("add");

    
        const loadCategories = async () => {
            try {
                setIsLoading(true);
                const response = await apiCall.get("/categories");
                const { status, data } = response.data;

                 if(status === false) {
                    setCategories([]);
                    return;
                } setCategories (data as CategoryData[]);
           
            } catch (error) {
            console.error("Error adding category:", error);
            toast.error("Failed to add category. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    const handleCategoryFormSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const payload: CategoryFormData = {
                name: categoryFormData.name,
                parentId: categoryFormData.parentId ? categoryFormData.parentId : "0"
            };
            if (categoryFormData.description) payload.description = categoryFormData.description;

            setIsFormLoading(true);
            let response;
            if (action === "edit" && categoryFormData.id) {
                response = await apiCall.put(`/categories/${categoryFormData.id}`, payload);
            } else {
                response = await apiCall.post('/categories', payload);
            }

            const { status } = response.data;
            if (status === false) {
                toast.error(`Failed to ${action === "edit" ? "update" : "add"} category. Please try again.`);
                return;
            }

            toast.success(`Category ${action === "edit" ? "updated" : "added"} successfully!`);
            setAction("add");
            setCategoryFormData(defaultCategoryFormData);
            loadCategories();
        } catch (error) {
            console.error(`Error ${action === "edit" ? "updating" : "adding"} category:`, error);
            toast.error(`Failed to ${action === "edit" ? "update" : "add"} category. Please try again.`);
        } finally {
            setIsFormLoading(false);
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

    const editCategoryAction = (category: CategoryData) => {
        setAction("edit");
        setCategoryFormData({
            name: category.name,
            parentId: category.parentCategoryId !== 0 ? category.parentCategoryId.toString() : undefined,
            description: category.description || '',
            id: category.id
        });
    };

    useEffect(() => {
        loadCategories();
    }, []);

    return <>
        <div className="d-flex align-items-center justify-content-between mb-4">
            <h3 className="mb-0">Categories</h3>
        </div>

        <div className="row">
            <form onSubmit={handleCategoryFormSubmit} className="col-md-4 col-lg-3">
                <Card>
                    <CardHeader>{action === "add" ? "Add New Category" : "Edit Category"}</CardHeader>
                        <CardBody>
                        <div className="mb-3">
                            <label htmlFor="categoryName" className="form-label">Category Name*:</label>
                            <input type="text" id="categoryName" className="form-control" onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value})} value={categoryFormData?.name || ''} required disabled={isFormLoading} />
                        </div>
                        {!categories || categories.length === 0 ? null : (
                            <div className="mb-3">
                            <label htmlFor="parentCategory" className="form-label">Category Description:</label>
                            <select id="parentCategory" className="form-select" onChange={(e) => setCategoryFormData({ ...categoryFormData, parentId: e.target.value || undefined })} value={categoryFormData?.parentId || ''} disabled={isFormLoading}>
                                <option value="">-- None --</option>
                                {categories.map((category) => (
                                    <option key={`parent-category-option-${category.id}`} value={category.id}>
                                        {category.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        )}
                        <div>
                            <label htmlFor="categoryDescription" className="form-label">Category Description:</label>
                            <textarea id="categoryDescription" className="form-control" rows={3} onChange={(e) => setCategoryFormData({ ...categoryFormData, description: e.target.value})} value={categoryFormData?.description || ''} disabled={isFormLoading}></textarea>
                        </div>
                    </CardBody>
                    <CardFooter className="d-flex align-items-center gap-1">
                        <button className="btn btn-dark d-flex align-items-center gap-1" disabled={isFormLoading} type="submit">
                            <Save size={18} /> {isFormLoading ? "Saving..." : "Save"}
                        </button>
                        {action === 'edit' && (
                            <button className="btn btn-secondary ms-2" disabled={isFormLoading} onClick={() => {
                                setAction('add');
                                setCategoryFormData(defaultCategoryFormData)
                            }}>
                                <X size={18} />Cancel
                            </button>
                        )}
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
                                                <td>{category.parentCategoryName ? category.parentCategoryName.name : '--'}</td>
                                                <td>{limitString(category.description)}</td>
                                                <td>{formatDate(category.createdAt)}</td>
                                                <td className="text-center">
                                                    <button className="btn btn-sm btn-link text-dark me-2" onClick={() => editCategoryAction(category)}>
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
                                                    <td>{category.name}</td>
                                                    <td>{limitString(subCategory.description)}</td>
                                                    <td>{formatDate(subCategory.createdAt)}</td>
                                                    <td className="text-center">
                                                        <button className="btn btn-sm btn-link text-dark me-2" onClick={() => {editCategoryAction(subCategory)}}>
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