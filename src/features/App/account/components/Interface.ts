export interface IParams {
    searchKey?: string;
    page?: number;
    fromDate?: string;
    toDate?: string;
    limit?: number;
    status?: number;
}

export interface ICustomer {
    id: number;
    name: string;
    phone: string;
    address: string;
    date: string;
    status: number;
}

export interface IAccountDetail {
    name: string
    phone: string
    email: string
    password: string
    address: string
}