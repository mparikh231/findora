import { Save, X } from "lucide-react";
import React, { useEffect, useState } from "react";
import { Card, CardBody, CardFooter, CardHeader } from "reactstrap";
import type { NavigationMenuItem, NavigationMenuItemFormData } from "../../types/NavigationMenu";
import type { CategoryData } from "../../types/categories";
import apiCall from "../../utils/axios";
import { toast } from "react-toastify";

interface NavigationMenuItemFormProps {
    menuItems: NavigationMenuItem[];
    editingItem: NavigationMenuItem | null;
    onSave: (item: NavigationMenuItem, parentId?: string) => void;
    onCancel: () => void;
}

const NavigationMenuItemForm = ({ menuItems, editingItem, onSave, onCancel }: NavigationMenuItemFormProps) => {
    const defaultFormData: NavigationMenuItemFormData = {
        label: '',
        type: 'custom',
        url: '',
        openInNewTab: false,
        categoryId: undefined,
        parentId: undefined
    };

    const [formData, setFormData] = useState<NavigationMenuItemFormData>(defaultFormData);
    const [categories, setCategories] = useState<CategoryData[]>([]);
    const [isLoadingCategories, setIsLoadingCategories] = useState<boolean>(false);

    useEffect(() => {
        loadCategories();
        
        if (editingItem) {
            setFormData({
                id: editingItem.id,
                label: editingItem.label,
                type: editingItem.type,
                categoryId: editingItem.categoryId,
                url: editingItem.url,
                openInNewTab: editingItem.openInNewTab,
                parentId: undefined
            });
        }
    }, [editingItem]);

    const loadCategories = async () => {
        try {
            setIsLoadingCategories(true);
            const response = await apiCall.get('/categories');
            const { status, data } = response.data;
            if (status) {
                setCategories(data as CategoryData[]);
            }
        } catch (error) {
            console.error('Error loading categories:', error);
            toast.error('Failed to load categories');
        } finally {
            setIsLoadingCategories(false);
        }
    };

    const generateId = () => {
        return `nav-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.label.trim()) {
            toast.error('Label is required');
            return;
        }

        if (formData.type === 'category' && !formData.categoryId) {
            toast.error('Please select a category');
            return;
        }

        if (formData.type === 'custom' && !formData.url?.trim()) {
            toast.error('URL is required for custom links');
            return;
        }

        // Create menu item
        const menuItem: NavigationMenuItem = {
            id: formData.id || generateId(),
            label: formData.label.trim(),
            type: formData.type,
            categoryId: formData.type === 'category' ? Number(formData.categoryId) : undefined,
            url: formData.type === 'custom' ? formData.url?.trim() : undefined,
            openInNewTab: formData.openInNewTab,
            order: editingItem ? editingItem.order : menuItems.length + 1,
            children: editingItem ? editingItem.children : []
        };

        onSave(menuItem, formData.parentId);
        setFormData(defaultFormData);
    };

    const getAllMenuItemsFlat = (items: NavigationMenuItem[]): NavigationMenuItem[] => {
        let result: NavigationMenuItem[] = [];
        items.forEach(item => {
            result.push(item);
            if (item.children && item.children.length > 0) {
                result = result.concat(getAllMenuItemsFlat(item.children));
            }
        });
        return result;
    };

    const availableParents = getAllMenuItemsFlat(menuItems).filter(
        item => !editingItem || item.id !== editingItem.id
    );

    return (
        <Card className="mt-3">
            <CardHeader>
                {editingItem ? 'Edit Menu Item' : 'Add New Menu Item'}
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardBody>
                    <div className="row">
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Menu Item Type *</label>
                            <div className="d-flex gap-3">
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="type"
                                        id="typeCategory"
                                        value="category"
                                        checked={formData.type === 'category'}
                                        onChange={(e) => setFormData({ ...formData, type: 'category', url: '', categoryId: undefined })}
                                    />
                                    <label className="form-check-label" htmlFor="typeCategory">
                                        Category
                                    </label>
                                </div>
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="radio"
                                        name="type"
                                        id="typeCustom"
                                        value="custom"
                                        checked={formData.type === 'custom'}
                                        onChange={(e) => setFormData({ ...formData, type: 'custom', categoryId: undefined, url: '' })}
                                    />
                                    <label className="form-check-label" htmlFor="typeCustom">
                                        Custom Link
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="col-md-6 mb-3">
                            <label htmlFor="label" className="form-label">Label *</label>
                            <input
                                type="text"
                                className="form-control"
                                id="label"
                                value={formData.label}
                                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                                placeholder="e.g., Home, About Us"
                                required
                            />
                        </div>

                        {formData.type === 'category' && (
                            <div className="col-md-6 mb-3">
                                <label htmlFor="category" className="form-label">Select Category *</label>
                                <select
                                    className="form-select"
                                    id="category"
                                    value={formData.categoryId || ''}
                                    onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                    required
                                    disabled={isLoadingCategories}
                                >
                                    <option value="">-- Select Category --</option>
                                    {categories.map(category => (
                                        <React.Fragment key={category.id}>
                                            <option value={category.id}>
                                                {category.name}
                                            </option>
                                            {category.subCategories && category.subCategories.length > 0 && category.subCategories.map(subCat => (
                                                <option key={subCat.id} value={subCat.id}>
                                                    &nbsp;&nbsp;&nbsp;&nbsp;└─ {subCat.name}
                                                </option>
                                            ))
                                            }
                                        </React.Fragment>
                                    ))}
                                </select>
                                {isLoadingCategories && (
                                    <small className="text-muted">Loading categories...</small>
                                )}
                            </div>
                        )}

                        {formData.type === 'custom' && (
                            <div className="col-md-6 mb-3">
                                <label htmlFor="url" className="form-label">URL *</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="url"
                                    value={formData.url || ''}
                                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                    placeholder="e.g., /about, /contact"
                                    required
                                />
                                <small className="text-muted">
                                    Use relative paths (e.g., /about) or full URLs (e.g., https://example.com)
                                </small>
                            </div>
                        )}

                        <div className="col-md-6 mb-3">
                            <label htmlFor="parent" className="form-label">Parent Menu Item</label>
                            <select
                                className="form-select"
                                id="parent"
                                value={formData.parentId || ''}
                                onChange={(e) => setFormData({ ...formData, parentId: e.target.value || undefined })}
                                disabled={editingItem !== null}
                            >
                                <option value="">-- None (Top Level) --</option>
                                {availableParents.map(item => (
                                    <option key={item.id} value={item.id}>
                                        {item.label}
                                    </option>
                                ))}
                            </select>
                            {editingItem && (
                                <small className="text-muted">
                                    Cannot change parent while editing. Delete and recreate to move.
                                </small>
                            )}
                        </div>

                        <div className="col-md-6 mb-3">
                            <div className="form-check mt-4">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="openInNewTab"
                                    checked={formData.openInNewTab}
                                    onChange={(e) => setFormData({ ...formData, openInNewTab: e.target.checked })}
                                />
                                <label className="form-check-label" htmlFor="openInNewTab">
                                    Open in new tab
                                </label>
                            </div>
                        </div>
                    </div>
                </CardBody>
                <CardFooter className="d-flex gap-2">
                    <button type="submit" className="btn btn-dark d-flex align-items-center gap-1">
                        <Save size={16} />
                        {editingItem ? 'Update' : 'Add'} Menu Item
                    </button>
                    <button type="button" className="btn btn-secondary d-flex align-items-center gap-1" onClick={onCancel}>
                        <X size={16} />
                        Cancel
                    </button>
                </CardFooter>
            </form>
        </Card>
    );
};

export default NavigationMenuItemForm;