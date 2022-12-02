import AxiosClient from "@/apis/AxiosClient"


export const tourService = {
    getTours: (payload: any) => {
        return AxiosClient.get('/Tour/GetListTour', {params: payload})
    },
    addTour: (payload: any) => {
        return AxiosClient.post(`/Tour/CreateTour`, payload)
    },
    updateTour: (payload: any) => {
        return AxiosClient.post(`/Tour/UpdateTour`, payload)
    },
    deleteTour: (id: number) => {
        return AxiosClient.post(`/Tour/DeleteTour/${id}`)
    },
    changeTourStatus: (id: number) => {
        return AxiosClient.post(`/Tour/ChangeStatus/${id}`)
    },
    getDestinations: (payload: any) => {
        return AxiosClient.get('/Destination/GetListDestination', {params: payload})
    },
    deleteDestination: (id: number) => {
        return AxiosClient.post(`/Destination/DeleteDestination/${id}`)
    },
    addDestination: (payload: any) => {
        return AxiosClient.post(`/Destination/CreateDestination`, payload)
    },
    updateDestination: (payload: any) => {
        return AxiosClient.post(`/Destination/UpdateDestination`, payload)
    },
    changeDesStatus: (id: number) => {
        // return AxiosClient.post(`/Destination/ChangeStatus`, {params: {ID: id}})
        return AxiosClient.post(`/Destination/ChangeStatus?ID=${id}`)
    },
}

