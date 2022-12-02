import AxiosClient from '@/apis/AxiosClient';


export const homeService = {
    getData: () => {
        return AxiosClient.get('/Overview/GetOverview', { params: {} });
    },
};
