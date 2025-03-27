import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import { AuthContext } from './_app';
import Notification from '../components/Notification';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin'); // 默认角色为admin
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  
  const router = useRouter();
  const { isAuthenticated, login } = useContext(AuthContext);
  
  // 如果已经认证，重定向到主页
  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);
  
  const showNotification = (message, type) => {
    setNotification({
      show: true,
      message,
      type
    });
  };
  
  const closeNotification = () => {
    setNotification(prev => ({ ...prev, show: false }));
  };
  
  const handleLogin = async () => {
    try {
      setLoading(true);
      
      // 替换为对后端的请求
      const response = await fetch('http://localhost:8080/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          login(role); // 调用AuthContext中的login函数设置认证状态和角色
          showNotification('登录成功', 'success');
          router.push('/');
        } else {
          showNotification(data.message || '用户名或密码错误', 'error');
        }
      } else {
        showNotification('登录失败，请稍后再试', 'error');
      }
    } catch (error) {
      console.error('登录请求出错:', error);
      // 模拟本地登录逻辑 (临时处理方式)
      if (username === 'admin' && password === 'admin') {
        login('admin');
        showNotification('管理员登录成功', 'success');
        router.push('/');
        return;
      }
      
      // 从员工数据中查找匹配的用户名和密码
      const { employees } = window;
      if (!employees) {
        // 加载员工数据
        import('../data/employees').then(module => {
          window.employees = module.default;
          checkEmployeeCredentials();
        });
      } else {
        checkEmployeeCredentials();
      }
      
      function checkEmployeeCredentials() {
        const employee = employees.find(emp => emp.name === username);
        if (employee && employee.password === password) {
          login('staff');
          showNotification('职工登录成功', 'success');
          router.push('/');
        } else {
          showNotification('用户名或密码错误', 'error');
        }
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            职工住宿管理系统
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            请登录以继续
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleLogin}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="username" className="sr-only">用户名</label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="用户名"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">密码</label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          
          <div className="mt-4">
            <div className="flex items-center justify-around">
              <div className="flex items-center">
                <input
                  id="admin-role"
                  name="role"
                  type="radio"
                  value="admin"
                  checked={role === 'admin'}
                  onChange={() => setRole('admin')}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label htmlFor="admin-role" className="ml-2 block text-sm text-gray-900">
                  管理员
                </label>
              </div>
              <div className="flex items-center">
                <input
                  id="staff-role"
                  name="role"
                  type="radio"
                  value="staff"
                  checked={role === 'staff'}
                  onChange={() => setRole('staff')}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                />
                <label htmlFor="staff-role" className="ml-2 block text-sm text-gray-900">
                  职工
                </label>
              </div>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="animate-spin h-5 w-5 text-indigo-300" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                </span>
              ) : (
                <span className="absolute left-0 inset-y-0 flex items-center pl-3">
                  <svg className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                  </svg>
                </span>
              )}
              {loading ? '登录中...' : '登录'}
            </button>
          </div>
          
          <div className="text-center text-sm text-gray-500">
            <p>管理员账号：admin / 密码：admin</p>
            <p>职工账号：输入职工姓名 / 密码：staff</p>
            <p>示例员工：张三、李四、王五等</p>
          </div>
        </form>
      </div>
      
      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
    </div>
  );
};

export default Login; 