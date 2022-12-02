import AxiosClient from "@/apis/AxiosClient"


interface IAccount {
    phone: string
    password: string
}

export const authenService = {
    login: (payload: IAccount) => {
        return AxiosClient.post('/Authentication/Login', payload)
    },
}
