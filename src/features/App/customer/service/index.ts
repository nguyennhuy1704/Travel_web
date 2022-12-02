import AxiosClient from '@/apis/AxiosClient';


export const customerService = {
    getListCustomers: (payload: any) => {
        return AxiosClient.get('/Customer/GetListCustomer', { params: payload });
    },
    changeStatus: (id: number) => {
        return AxiosClient.post(`/Customer/ChangeStatus/${id}`,);
    },
    

};
