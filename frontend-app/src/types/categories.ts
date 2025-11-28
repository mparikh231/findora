export interface CategoryFormData {
    name: string;
    parentId?: string;
    description?: string;
}
export interface CategoryData {
    id: number;
    name: string;
    parentCategoryId: number;
    description: string;
    createdAt: string;
    subCategories: CategoryData[];
}