import { useRouter } from 'next/router';
import { useContext, useEffect } from 'react';
import { AuthContext } from '../pages/_app';

// 角色守卫高阶组件
const withRoleGuard = (Component, allowedRoles) => {
  const WithRoleGuard = (props) => {
    const router = useRouter();
    const { isAuthenticated, userRole } = useContext(AuthContext);

    useEffect(() => {
      // 如果用户未认证，重定向到登录页面
      if (!isAuthenticated) {
        router.push('/login');
        return;
      }

      // 如果用户角色不在允许的角色列表中，重定向到首页
      if (allowedRoles && !allowedRoles.includes(userRole)) {
        router.push('/');
      }
    }, [isAuthenticated, userRole, router]);

    if (!isAuthenticated || (allowedRoles && !allowedRoles.includes(userRole))) {
      return null; // 或者返回一个"权限不足"的提示组件
    }

    return <Component {...props} />;
  };

  return WithRoleGuard;
};

export default withRoleGuard;
