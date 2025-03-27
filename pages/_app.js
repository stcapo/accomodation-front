import '../styles/globals.css';
import React, { useState, useEffect, createContext } from 'react';
import { useRouter } from 'next/router';
import mockEmployees from '../data/employees';
import mockAccommodations from '../data/accommodations';
import mockMaintenanceRecords from '../data/maintenanceRecords';

// 创建全局上下文
export const GlobalContext = createContext();
export const AuthContext = createContext();

function MyApp({ Component, pageProps }) {
  const router = useRouter();
  
  // 认证状态
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null); // 'admin' or 'staff'
  const [loading, setLoading] = useState(true);
  
  // 全局状态
  const [employees, setEmployees] = useState(mockEmployees);
  const [accommodations, setAccommodations] = useState(mockAccommodations);
  const [maintenanceRecords, setMaintenanceRecords] = useState(mockMaintenanceRecords);
  
  // 初始化时从本地存储检查认证状态
  useEffect(() => {
    const checkAuth = () => {
      const auth = localStorage.getItem('isAuthenticated');
      setIsAuthenticated(auth === 'true');
      const role = localStorage.getItem('userRole');
      setUserRole(role);
      setLoading(false);
    };
    
    checkAuth();
  }, []);
  
  // 监听认证状态变化，重定向到适当的页面
  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated && router.pathname !== '/login') {
        router.push('/login');
      } else if (isAuthenticated && router.pathname === '/login') {
        router.push('/');
      }
    }
  }, [isAuthenticated, loading, router]);
  
  // 登录函数
  const login = (role) => {
    localStorage.setItem('isAuthenticated', 'true');
    localStorage.setItem('userRole', role);
    setIsAuthenticated(true);
    setUserRole(role);
  };
  
  // 登出函数
  const logout = () => {
    localStorage.setItem('isAuthenticated', 'false');
    localStorage.removeItem('userRole');
    setIsAuthenticated(false);
    setUserRole(null);
    router.push('/login');
  };
  
  // 重置所有数据到初始状态
  const resetData = () => {
    setEmployees(mockEmployees);
    setAccommodations(mockAccommodations);
    setMaintenanceRecords(mockMaintenanceRecords);
    localStorage.setItem('employees', JSON.stringify(mockEmployees));
    localStorage.setItem('accommodations', JSON.stringify(mockAccommodations));
    localStorage.setItem('maintenanceRecords', JSON.stringify(mockMaintenanceRecords));
  };
  
  // 认证上下文值
  const authContextValue = {
    isAuthenticated,
    userRole,
    login,
    logout
  };
  
  // 全局上下文值
  const globalContextValue = {
    employees,
    setEmployees,
    accommodations,
    setAccommodations,
    maintenanceRecords,
    setMaintenanceRecords,
    resetData
  };
  
  // 如果正在加载，显示加载指示器
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }
  
  return (
    <AuthContext.Provider value={authContextValue}>
      <GlobalContext.Provider value={globalContextValue}>
        <Component {...pageProps} />
      </GlobalContext.Provider>
    </AuthContext.Provider>
  );
}

export default MyApp; 