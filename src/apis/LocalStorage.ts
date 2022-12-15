const LocalStorage = {
    getToken: () => localStorage.getItem('token'),
    setToken: (token: string) => localStorage.setItem('token', token),
    removeToken: () => localStorage.removeItem('token'),

    getLogged: () => localStorage.getItem('logged'),
    setLogged: (isLog: string) => localStorage.setItem('logged', isLog),
    removeLogged: () => localStorage.removeItem('logged'),
};

export default LocalStorage;
