import AxiosClient from '@/apis/AxiosClient';



export const libraryService = {
    getListCategories: (payload: any) => {
        return AxiosClient.get('/Library/GetListLibrary', { params: payload });
    },
    
    getListSubCategories: (type: number | undefined) => {
        return AxiosClient.get('/LibraryCategory/GetListLibraryCategory', { params: {type} });
    },
    deleteLibraryItem: (id: number) => {
        return AxiosClient.post(`/Library/Delete/${id}`)
    },
    changeStatusCate: (id: number) => {
        return AxiosClient.post(`/Library/ChangeStatusCategory/${id}`)
    },
    addLibraryItem: (payload: any) => {
        return AxiosClient.post(`/Library/CreateLibrary`, payload)
    },
    updateLibraryItem: (payload: any) => {
        return AxiosClient.post(`/Library/UpdateLibrary`, payload)
    },
    // Thêm danh mục
    addLibraryCategory: (payload: any) => {
        return AxiosClient.post(`/LibraryCategory/CreateLibraryCategory`, payload)
    },
    removeLibraryCategory: (id: number) => {
        return AxiosClient.post(`/LibraryCategory/DeleteLibraryCategory/${id}`)
    },
    updateLibraryCategory: (payload: any) => {
        return AxiosClient.post(`/LibraryCategory/UpdateLibraryCategory`, payload)
    },
    

    // Tài liệu
    getListDocuments: (payload: any) => {
        return AxiosClient.get('/Library/GetListLibraryDocument', { params: payload });
    },
    changeStatusDoc: (id: number) => {
        return AxiosClient.post(`/Library/ChangeStatus/${id}`);
    },
    addDoc: (payload: any) => {
        return AxiosClient.post(`/Library/CreateDocument`, payload);
    },
    updateDoc: (payload: any) => {
        return AxiosClient.post(`/Library/UpdateDocument`, payload);
    },
    deleteDoc: (id: number) => {
        return AxiosClient.post(`/Library/DeleteDocument/${id}`);
    },
    
};
