export interface CategoryFormData {
    name: string;
    parentId?: string;
    description?: string;
    id?: number;
}
export interface CategoryData {
    id: number;
    name: string;
    parentCategoryId: number;
    parentCategoryName?: {
        name: string;
    };
    description: string;
    createdAt: string;
    subCategories: CategoryData[];
}