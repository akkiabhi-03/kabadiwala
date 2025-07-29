import React, { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useLazyGetCurrentUserQuery } from '../RTK Query/UserApi.jsx';
import { useLazyGetAdminUserQuery } from '../RTK Query/AdminApi.jsx';
import { selectGetAdminProfileResult, selectGetCurUserResult } from '../RTK Query/Selectors.jsx';

const ProtectedAdminRoute = () => {
  const localCachedUser = useSelector((state) => selectGetCurUserResult(state)?.data);
  const adminCachedUser = useSelector((state) => selectGetAdminProfileResult(state)?.data);

  const [getLocalUser, { data: lazyLocalUser }] = useLazyGetCurrentUserQuery();
  const [getAdminUser, { data: lazyAdminUser, error: lazyAdminError }] = useLazyGetAdminUserQuery();

  const [checked, setChecked] = useState(false); // wait for async effect

  const localUser = localCachedUser || lazyLocalUser;
  const adminUser = adminCachedUser || lazyAdminUser;

  useEffect(() => {
    (async () => {
      // if (!localCachedUser) await getLocalUser();
      if (!adminCachedUser) await getAdminUser();
      setChecked(true); // mark checks as done
    })();
  }, []);

  if (!checked) return null; // avoid flicker during fetch

  if (localUser && localUser.kirdar === 'local') {
    return <Navigate to="/" replace />;
  }

  if (!adminUser || adminUser.kirdar !== 'admin' || lazyAdminError?.status === 401) {
    return <Navigate to="/admin/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedAdminRoute;
