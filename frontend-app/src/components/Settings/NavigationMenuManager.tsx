import { ChevronDown, ChevronUp, CornerDownRight, Edit, Plus, Save, Trash } from "lucide-react";
import { useEffect, useState } from "react";
import { Card, CardBody, CardFooter, CardHeader } from "reactstrap";
import type { NavigationMenuItem, NavigationMenuData } from "../../types/NavigationMenu";
import { toast } from "react-toastify";
import apiCall from "../../utils/axios";
import ConfirmModal from "../ConfirmModal";
import NavigationMenuItemForm from "./NavigationMenuItemForm";

const NavigationMenuManager = () => {
    const [menuItems, setMenuItems] = useState<NavigationMenuItem[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);
    const [showAddForm, setShowAddForm] = useState<boolean>(false);
    const [editingItem, setEditingItem] = useState<NavigationMenuItem | null>(null);
    const [deleteItemId, setDeleteItemId] = useState<string | null>(null);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState<boolean>(false);

    useEffect(() => {
        loadNavigationMenu();
    }, []);

    const loadNavigationMenu = async () => {
        try {
            setIsLoading(true);
            const response = await apiCall.get('/options/navigation_menu');
            const { status, data } = response.data;
            
            if (status && data && data.optionValue) {
                try {
                    const menuData: NavigationMenuData = JSON.parse(data.optionValue);
                    setMenuItems(menuData.items || []);
                } catch (parseError) {
                    console.error('Error parsing menu data:', parseError);
                    setMenuItems([]);
                }
            } else {
                setMenuItems([]);
            }
        } catch (error) {
            console.error('Error loading navigation menu:', error);
            // Initialize with empty menu if not found
            setMenuItems([]);
        } finally {
            setIsLoading(false);
        }
    };

    const saveNavigationMenu = async () => {
        try {
            setIsSaving(true);
            const menuData: NavigationMenuData = { items: menuItems };
            const payload = {
                optionKey: 'navigation_menu',
                optionValue: JSON.stringify(menuData)
            };

            await apiCall.put('/options/navigation_menu', payload);
            toast.success('Navigation menu saved successfully!');
        } catch (error: any) {
            console.error('Error saving navigation menu:', error);
            toast.error(error.response?.data?.message || 'Failed to save navigation menu. Please try again.');
        } finally {
            setIsSaving(false);
        }
    };

    const addMenuItem = (item: NavigationMenuItem, parentId?: string) => {
        if (parentId) {
            // Add as child to parent
            const addToParent = (items: NavigationMenuItem[]): NavigationMenuItem[] => {
                return items.map(menuItem => {
                    if (menuItem.id === parentId) {
                        const children = menuItem.children || [];
                        return {
                            ...menuItem,
                            children: [...children, { ...item, order: children.length + 1 }]
                        };
                    }
                    if (menuItem.children && menuItem.children.length > 0) {
                        return { ...menuItem, children: addToParent(menuItem.children) };
                    }
                    return menuItem;
                });
            };
            setMenuItems(addToParent(menuItems));
        } else {
            // Add at top level
            setMenuItems([...menuItems, item]);
        }
        setShowAddForm(false);
        toast.info('Menu item added. Don\'t forget to save!');
    };

    const updateMenuItem = (updatedItem: NavigationMenuItem) => {
        const updateItemInTree = (items: NavigationMenuItem[]): NavigationMenuItem[] => {
            return items.map(item => {
                if (item.id === updatedItem.id) {
                    return { ...updatedItem, children: item.children };
                }
                if (item.children && item.children.length > 0) {
                    return { ...item, children: updateItemInTree(item.children) };
                }
                return item;
            });
        };

        setMenuItems(updateItemInTree(menuItems));
        setEditingItem(null);
        toast.info('Menu item updated. Don\'t forget to save!');
    };

    const deleteMenuItem = (itemId: string) => {
        const removeItemFromTree = (items: NavigationMenuItem[]): NavigationMenuItem[] => {
            return items.filter(item => {
                if (item.id === itemId) {
                    return false;
                }
                if (item.children && item.children.length > 0) {
                    item.children = removeItemFromTree(item.children);
                }
                return true;
            });
        };

        setMenuItems(removeItemFromTree(menuItems));
        setDeleteItemId(null);
        setIsConfirmModalOpen(false);
        toast.info('Menu item deleted. Don\'t forget to save!');
    };

    const moveItem = (itemId: string, direction: 'up' | 'down') => {
        const moveInArray = (items: NavigationMenuItem[], parentLevel = true): NavigationMenuItem[] => {
            const index = items.findIndex(item => item.id === itemId);
            
            if (index !== -1) {
                const newItems = [...items];
                if (direction === 'up' && index > 0) {
                    [newItems[index], newItems[index - 1]] = [newItems[index - 1], newItems[index]];
                } else if (direction === 'down' && index < newItems.length - 1) {
                    [newItems[index], newItems[index + 1]] = [newItems[index + 1], newItems[index]];
                }
                return newItems.map((item, idx) => ({ ...item, order: idx + 1 }));
            }
            
            return items.map(item => {
                if (item.children && item.children.length > 0) {
                    return { ...item, children: moveInArray(item.children, false) };
                }
                return item;
            });
        };

        setMenuItems(moveInArray(menuItems));
        toast.info('Menu item reordered. Don\'t forget to save!');
    };

    const renderMenuItem = (item: NavigationMenuItem, level: number = 0, index: number, totalItems: number) => {
        const hasChildren = item.children && item.children.length > 0;
        const indent = level > 0 ? `${level * 30}px` : '0';

        return (
            <div key={item.id}>
                <div 
                    className="d-flex align-items-center justify-content-between p-3 border-bottom"
                    style={{ marginLeft: indent, backgroundColor: level > 0 ? '#f9f9f9' : 'transparent' }}
                >
                    <div className="d-flex align-items-center gap-2">
                        {level > 0 && <CornerDownRight size={16} className="text-muted" />}
                        <div>
                            <div className="fw-semibold">{item.label}</div>
                            <small className="text-muted">
                                {item.type === 'category' ? (
                                    <>Category ID: {item.categoryId}</>
                                ) : (
                                    <>Custom URL: {item.url}</>
                                )}
                                {item.openInNewTab && ' • Opens in new tab'}
                            </small>
                        </div>
                    </div>
                    
                    <div className="d-flex align-items-center gap-1">
                        <button
                            className="btn btn-sm btn-link text-secondary"
                            onClick={() => moveItem(item.id, 'up')}
                            disabled={index === 0}
                            title="Move up"
                            type="button"
                        >
                            <ChevronUp size={16} />
                        </button>
                        <button
                            className="btn btn-sm btn-link text-secondary"
                            onClick={() => moveItem(item.id, 'down')}
                            disabled={index === totalItems - 1}
                            title="Move down"
                            type="button"
                        >
                            <ChevronDown size={16} />
                        </button>
                        <button
                            className="btn btn-sm btn-link text-dark"
                            onClick={() => setEditingItem(item)}
                            title="Edit"
                            type="button"
                        >
                            <Edit size={16} />
                        </button>
                        <button
                            className="btn btn-sm btn-link text-danger"
                            onClick={() => {
                                setDeleteItemId(item.id);
                                setIsConfirmModalOpen(true);
                            }}
                            title="Delete"
                            type="button"
                        >
                            <Trash size={16} />
                        </button>
                    </div>
                </div>
                
                {hasChildren && item.children!.map((child, childIndex) => 
                    renderMenuItem(child, level + 1, childIndex, item.children!.length)
                )}
            </div>
        );
    };

    return (
        <>
            <Card>
                <CardHeader className="d-flex align-items-center justify-content-between">
                    <span>Navigation Menu Items</span>
                    <button
                        className="btn btn-sm btn-dark d-flex align-items-center gap-1"
                        onClick={() => setShowAddForm(true)}
                        disabled={showAddForm || editingItem !== null}
                        type="button"
                        style={{
                            opacity: showAddForm || editingItem !== null ? 0.5 : 1,
                            cursor: showAddForm || editingItem !== null ? 'not-allowed' : 'pointer'
                        }}
                    >
                        <Plus size={16} /> Add Menu Item
                    </button>
                </CardHeader>
                <CardBody className="p-0">
                    {isLoading ? (
                        <div className="text-center p-4">
                            <div className="spinner-border text-primary" role="status">
                                <span className="visually-hidden">Loading...</span>
                            </div>
                        </div>
                    ) : menuItems.length === 0 ? (
                        <div className="text-center p-4 text-muted">
                            <p>No menu items found. Click "Add Menu Item" to get started.</p>
                            <button
                                className="btn btn-sm btn-outline-primary"
                                onClick={() => setShowAddForm(true)}
                                disabled={editingItem !== null}
                                type="button"
                            >
                                <Plus size={14} className="me-1" /> Add First Menu Item
                            </button>
                        </div>
                    ) : (
                        <div>
                            {menuItems.map((item, index) => 
                                renderMenuItem(item, 0, index, menuItems.length)
                            )}
                        </div>
                    )}
                </CardBody>
                {menuItems.length > 0 && (
                    <CardFooter>
                        <button
                            className="btn btn-primary d-flex align-items-center gap-1"
                            onClick={saveNavigationMenu}
                            disabled={isSaving}
                            type="button"
                        >
                            <Save size={16} />
                            {isSaving ? 'Saving...' : 'Save Navigation Menu'}
                        </button>
                    </CardFooter>
                )}
            </Card>

            {/* Show form conditionally */}
            {showAddForm && (
                <NavigationMenuItemForm
                    menuItems={menuItems}
                    editingItem={null}
                    onSave={addMenuItem}
                    onCancel={() => setShowAddForm(false)}
                />
            )}

            {/* Show form for editing */}
            {editingItem && (
                <NavigationMenuItemForm
                    menuItems={menuItems}
                    editingItem={editingItem}
                    onSave={updateMenuItem}
                    onCancel={() => setEditingItem(null)}
                />
            )}

            <ConfirmModal
                isOpen={isConfirmModalOpen}
                onConfirm={() => deleteMenuItem(deleteItemId!)}
                onCancel={() => {
                    setIsConfirmModalOpen(false);
                    setDeleteItemId(null);
                }}
            />
        </>
    );
};

export default NavigationMenuManager;