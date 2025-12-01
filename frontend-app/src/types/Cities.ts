export interface StateFormData {
    name: string;
    stateId: number;
    id?: number;
}

export interface CityData {
    id: number;
    name: string;
    createdAt: string;
    stateId: number;
}

export interface CityProps {
    stateId: number;
    stateName?: string;
}