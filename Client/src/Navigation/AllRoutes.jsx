import { BrowserRouter as Router, Routes, Route, Outlet, Navigate } from 'react-router-dom';
import ChangePasswordForm from '../Forms/ChangePassword.jsx';
import ForgotPasswordForm from '../Forms/ForgotPassword.jsx';
import LoginForm from '../Forms/Login.jsx';
import SignUp from '../Forms/SignUp.jsx';
import UpdateDetails from '../Forms/UpdateUser.jsx';
import UpdateContact from '../Forms/UpdateContact.jsx';

import ResponsiveNavBar from '../Navigation/NavBar.jsx';
import { useGetCurrentUserQuery } from '../RTK Query/UserApi.jsx';

import EachOrderDetails from '../Order/SingleOrder.jsx';
import AllOrders from '../Order/AllOrder.jsx';
import ContactActions from '../Components/ContactCenter.jsx';
import AdminOrderPanel from '../Admin/UserOrder.jsx';
import AdminYouSection from '../Admin/adminUser.jsx';
import AdminPriceTable from '../Admin/PriceUpdate.jsx';
import WeightTable from '../Admin/TotalPurchase.jsx';
import YouProfile from '../Components/You.jsx';
import DynamicTable from '../Home/InputTable.jsx';
import PriceTable from '../Home/PriceTable.jsx';
import ScrapMaterialList from '../Components/Material.jsx';

import VerticalNavBar from '../Admin/Nav.jsx';
import AddOrder from '../Admin/AddOrder.jsx';
import AdminSignUp from '../Admin/AdminSignUp.jsx';
import ProtectedAdminRoute from './RouteProtection.jsx';
import AdminLoginForm from '../Admin/AdminLogin.jsx';

const AllRoute = () => {
  const { data: userData, isLoading } = useGetCurrentUserQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });

  return (
    <Router>
      <div className="min-h-screen">
        <Routes>

          {/* ✅ Public Routes */}
          <Route path="/login" element={<LoginForm />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/forgot_password" element={<ForgotPasswordForm />} />

          {/* ✅ Protected Local User Routes */}
          <Route path="/" element={
            <ProtectedUserRoute userData={userData} isLoading={isLoading}>
              <UserLayout />
            </ProtectedUserRoute>
          }>
            <Route index element={<div className='bg-gradient-to-b from-indigo-100 to-neutral-50'><DynamicTable /><PriceTable /></div>} />
            <Route path="ordered" element={<AllOrders />} />
            <Route path="order-details" element={<EachOrderDetails />} />
            <Route path="order-status" element={
              <div className="min-h-screen bg-gradient-to-t inset-0 from-emerald-100 via-gray-100 to-indigo-100">
                <ScrapMaterialList />
              </div>
            } />
            <Route path="profile" element={<YouProfile />} />
            <Route path="help-center" element={
              <div className="min-h-screen bg-gradient-to-t inset-0 pt-10 from-emerald-100 via-gray-100 to-indigo-100">
                <ContactActions />
              </div>
            } />
            <Route path="change_password" element={<ChangePasswordForm />} />
            <Route path="change_contact" element={<UpdateContact />} />
            <Route path="update-profile" element={<UpdateDetails />} />
          </Route>

          {/* ✅ Admin Routes */}
          <Route path="/admin" element={<ProtectedAdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route index element={<Navigate to="orders" replace />} />
              <Route path="add-order" element={<AddOrder />} />
              <Route path="orders" element={<AdminOrderPanel />} />
              <Route path="admin-user" element={<AdminYouSection />} />
              <Route path="change_password" element={<ChangePasswordForm />} />
              <Route path="change_contact" element={<UpdateContact />} />
              <Route path="forgot_password" element={<ForgotPasswordForm />} />
              <Route path="app-data" element={<><WeightTable /><AdminPriceTable /></>} />
            </Route>
          </Route>

          <Route path="/admin/login" element={<AdminLoginForm />} />
          <Route path="/admin/signup" element={<AdminSignUp />} />

          <Route path="*" element={<h1 className="text-center mt-20 text-red-500">404 - Page Not Found</h1>} />
        </Routes>
      </div>
    </Router>
  );
};

function AdminLayout() {
  return (
    <div className="flex">
      <VerticalNavBar />
      <div className="flex-1 md:ml-20 p-1">
        <Outlet />
      </div>
    </div>
  );
}

const UserLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <ResponsiveNavBar />
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
};

const ProtectedUserRoute = ({ userData, isLoading, children }) => {
  if (isLoading) return <div className="text-center mt-20 text-blue-500">Loading user...</div>;
  if (!userData) return <Navigate to="/signup" replace />;
  if (userData?.role === 'admin') return <Navigate to="/admin/login" replace />;
  return children;
};

export default AllRoute;
