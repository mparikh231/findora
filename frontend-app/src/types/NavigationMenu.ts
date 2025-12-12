export interface NavigationMenuItem {
    id: string;
    label: string;
    type: 'custom' | 'category';
    categoryId?: number;
    url?: string;
    openInNewTab?: boolean;
    children?: NavigationMenuItem[];
    order: number;
}
export interface NavigationMenuData {
    items: NavigationMenuItem[];
}

export interface NavigationMenuFormData {
    items: NavigationMenuItem[];
}

export interface OptionData {
    id: number;
    optionKey: string;
    optionValue: string; // JSON stringified
}

export interface NavigationMenuItemFormData {
    id?: string;
    label: string;
    type: 'category' | 'custom';
    categoryId?: string | number;
    url?: string;
    openInNewTab: boolean | undefined;
    parentId?: string;
}