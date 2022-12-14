import AxiosClient from '@/apis/AxiosClient';

export const categoryService = {
    getListCategory: (payload?: any) => {
        return AxiosClient.get('/categories', { params: payload });
    },
};
