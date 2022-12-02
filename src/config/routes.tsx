import LoginPage from '@/features/Auth/Login/pages';
import HomePage from '@/features/App/home/page';
import CustomerPage from '@/features/App/customer/pages';
import NotFoundPage from '@/features/Notfound';
import RegisterPage from '@/features/Auth/Register';
import PostPage from '@/features/App/post/pages';
import TourPage from '@/features/App/tour/pages';
import AccountPage from '@/features/App/account/pages';
import AddEditPost from '@/features/App/post/pages/AddEditPost';
import AddEditTour from '@/features/App/tour/pages/AddEditTour';
import ManageCategory from '@/features/App/library/pages/ManageCategory';
import ManagePost from '@/features/App/library/pages/ManagePost';
import AddEditCategory from '@/features/App/library/pages/AddEditCategory';
import OrdersPage from '@/features/App/orders';
import FeedbackPage from '@/features/App/feedback';

// định nghĩa router
export const routerPage = {
    // public....

    // private....
    home: '/',
    customer: '/customers',
    post: '/posts',
    tour: '/tours',
    library: '/library',
    account: '/account',
    addEditPost: '/add-edit-post',
    addEditTour: '/add-edit-tour',
    manageCategory: '/manage-category',
    addEditCategory: '/add-edit-category',
    managePost: '/manage-post',

    // đơn hàng
    orders: '/orders',

    // phản hồi dịch vụ
    feedback: '/feedback',

    // auth....
    login: '/auth/login',
    register: '/auth/register',
};

// public chứa những router không cần đăng nhập hoặc web view
const PublicRoutes = [{ path: '*', element: <NotFoundPage /> }];

// private router khi đã đăng nhập
const PrivateRoutes = [
    {
        path: routerPage.home,
        element: <HomePage />,
    },
    {
        path: routerPage.account,
        element: <AccountPage />,
    },
    {
        path: routerPage.manageCategory,
        element: <ManageCategory />,
    },
    {
        path: routerPage.addEditCategory,
        element: <AddEditCategory />,
    },
    {
        path: routerPage.managePost,
        element: <ManagePost />,
    },
    {
        path: routerPage.customer,
        element: <CustomerPage />,
    },
    {
        path: routerPage.post,
        element: <PostPage />,
    },
    {
        path: routerPage.tour,
        element: <TourPage />,
    },
    {
        path: routerPage.account,
        element: <AccountPage />,
    },
    {
        path: routerPage.addEditTour,
        element: <AddEditTour />,
    },
    {
        path: routerPage.addEditPost,
        element: <AddEditPost />,
    },

    // order + feedback
    {
        path: routerPage.orders,
        element: <OrdersPage />,
    },
    {
        path: routerPage.feedback,
        element: <FeedbackPage />,
    },
    ...PublicRoutes,
];

// auth router khi chưa đăng nhập
const AuthRoutes = [
    {
        path: routerPage.login,
        element: <LoginPage />,
    },
    {
        path: routerPage.register,
        element: <RegisterPage />,
    },
    ...PublicRoutes,
];

export { PrivateRoutes, AuthRoutes };
