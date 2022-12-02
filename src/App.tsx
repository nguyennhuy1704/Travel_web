import { Spin } from 'antd';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import styled from 'styled-components';
import GlobalStyle from './config/style';
import MainPage from './features/MainPage';
import { getMe, setAppLoading } from './redux/slice/root.slice';

function App() {
    const { appLoading } = useSelector((state: { root: { appLoading: boolean } }) => state.root);
    const [role, setRole] = React.useState('admin');

    const dispatch = useDispatch();

    // loading when going to app
    React.useEffect(() => {
        setTimeout(() => {
            dispatch(setAppLoading());
        }, 2000);
    }, []);

    React.useLayoutEffect(() => {
        (async () => {
            await dispatch(getMe());
        })();
        // if (LocalStorage.getToken()) {
        //     authService.info().then((res) => {
        //         setRole(Object.keys(res.data)[0]);
        //         dispatch({
        //             type: SET_INFO,
        //             payload: { ...res.data[Object.keys(res.data)[0]], role: Object.keys(res.data)[0] },
        //         });
        //     });
        // }
        // chỗ này xử lý info user khi đăng nhập để phân quyền
    }, []);

    return (
        <>
            <MainPage role={role} />
            <GlobalStyle />
        </>
    );
}

const SpinLoadingStyled = styled(Spin)`
    &&& {
        top: 20%;
    }
`;

export default App;
