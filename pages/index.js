import React, { useState, useEffect, useContext } from 'react';
import Layout from '../components/Layout';
import { GlobalContext, AuthContext } from './_app';
import withRoleGuard from '../components/withRoleGuard';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import Notification from '../components/Notification';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Dashboard = () => {
  const { employees, accommodations, maintenanceRecords, resetData } = useContext(GlobalContext);
  const { userRole } = useContext(AuthContext);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalRooms: 0,
    occupiedRooms: 0,
    pendingMaintenance: 0,
  });

  // 显示通知
  const showNotification = (message, type) => {
    setNotification({
      show: true,
      message,
      type
    });
  };
  
  // 关闭通知
  const closeNotification = () => {
    setNotification(prev => ({ ...prev, show: false }));
  };

  useEffect(() => {
    try {
      // 计算统计数据
      const totalEmployees = employees.length;
      const totalRooms = accommodations.length;
      const occupiedRooms = accommodations.filter(room => room.occupant).length;
      const pendingMaintenance = maintenanceRecords.filter(record => record.status === '待处理').length;

      setStats({
        totalEmployees,
        totalRooms,
        occupiedRooms,
        pendingMaintenance,
      });
      
      showNotification('系统数据加载成功', 'success');
    } catch (error) {
      console.error('计算统计数据时出错:', error);
      showNotification('数据加载失败', 'error');
    }
  }, [employees, accommodations, maintenanceRecords]);

  // 生成随机颜色
  const generateColors = (count) => {
    const colors = [];
    for (let i = 0; i < count; i++) {
      const r = Math.floor(Math.random() * 200 + 55);
      const g = Math.floor(Math.random() * 200 + 55);
      const b = Math.floor(Math.random() * 200 + 55);
      colors.push(`rgba(${r}, ${g}, ${b}, 0.8)`);
    }
    return colors;
  };

  // 住宿类型统计
  const roomTypes = {};
  accommodations.forEach(room => {
    roomTypes[room.type] = (roomTypes[room.type] || 0) + 1;
  });

  const roomTypeData = {
    labels: Object.keys(roomTypes),
    datasets: [
      {
        label: '房间数量',
        data: Object.values(roomTypes),
        backgroundColor: generateColors(Object.keys(roomTypes).length),
        borderWidth: 1,
      },
    ],
  };

  // 建筑物房间分布
  const buildings = {};
  accommodations.forEach(room => {
    buildings[room.buildingName] = (buildings[room.buildingName] || 0) + 1;
  });

  const buildingDistributionData = {
    labels: Object.keys(buildings),
    datasets: [
      {
        label: '房间数量',
        data: Object.values(buildings),
        backgroundColor: generateColors(Object.keys(buildings).length),
        borderWidth: 1,
      },
    ],
  };

  // 部门职工分布
  const departments = {};
  employees.forEach(emp => {
    departments[emp.department] = (departments[emp.department] || 0) + 1;
  });

  const departmentData = {
    labels: Object.keys(departments),
    datasets: [
      {
        label: '职工数量',
        data: Object.values(departments),
        backgroundColor: generateColors(Object.keys(departments).length),
        borderWidth: 1,
      },
    ],
  };

  // 图表配置
  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'right',
      }
    }
  };

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          precision: 0
        }
      }
    }
  };

  // 最近的员工变动
  const recentEmployeeChanges = employees.slice(0, 5);
  
  // 最近的维修记录
  const recentMaintenanceRecords = maintenanceRecords
    .sort((a, b) => new Date(b.reportDate) - new Date(a.reportDate))
    .slice(0, 5);

  return (
    <Layout>
      <div className="py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">系统概览</h1>
          <div className="bg-gray-100 px-4 py-2 rounded-lg">
            <span className="text-gray-600">当前角色：</span>
            <span className="font-semibold text-indigo-600 ml-1">{userRole === 'admin' ? '管理员' : '职工'}</span>
          </div>
        </div>
        
        {/* 统计卡片 */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">职工总数</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalEmployees}</dd>
              </dl>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">房间总数</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalRooms}</dd>
              </dl>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">已分配房间</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.occupiedRooms}</dd>
              </dl>
            </div>
          </div>
          
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">待处理维修</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.pendingMaintenance}</dd>
              </dl>
            </div>
          </div>
        </div>
        
        {/* 图表区域 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="bg-white p-4 shadow rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-3">部门职工分布</h3>
            <div style={{ height: '220px', position: 'relative' }}>
              {departmentData.labels.length > 0 && (
                <Pie data={departmentData} options={pieOptions} />
              )}
            </div>
          </div>
          
          <div className="bg-white p-4 shadow rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-3">住宿类型分布</h3>
            <div style={{ height: '220px', position: 'relative' }}>
              {roomTypeData.labels.length > 0 && (
                <Pie data={roomTypeData} options={pieOptions} />
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 shadow rounded-lg mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-3">楼宇房间分布</h3>
          <div style={{ height: '220px', position: 'relative' }}>
            {buildingDistributionData.labels.length > 0 && (
              <Bar data={buildingDistributionData} options={barOptions} />
            )}
          </div>
        </div>
        
        {/* 最近员工变动和维修记录 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 最近的员工 */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">最近添加的职工</h3>
            </div>
            <div className="px-4 py-3 sm:p-6">
              <div className="flow-root">
                <ul className="-my-5 divide-y divide-gray-200">
                  {recentEmployeeChanges.map((employee) => (
                    <li key={employee.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <svg className="h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">{employee.name}</p>
                          <p className="text-sm text-gray-500 truncate">{employee.department}</p>
                        </div>
                        <div>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            {employee.position}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
          
          {/* 最近维修记录 */}
          <div className="bg-white shadow rounded-lg overflow-hidden">
            <div className="px-4 py-5 border-b border-gray-200 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">最近的维修记录</h3>
            </div>
            <div className="px-4 py-3 sm:p-6">
              <div className="flow-root">
                <ul className="-my-5 divide-y divide-gray-200">
                  {recentMaintenanceRecords.map((record) => (
                    <li key={record.id} className="py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0">
                          <svg className="h-8 w-8 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {record.roomInfo} - {record.type}
                          </p>
                          <p className="text-sm text-gray-500 truncate">{record.description}</p>
                        </div>
                        <div>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            record.status === '待处理' 
                            ? 'bg-yellow-100 text-yellow-800' 
                            : record.status === '处理中' 
                              ? 'bg-blue-100 text-blue-800' 
                              : 'bg-green-100 text-green-800'
                          }`}>
                            {record.status}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {notification.show && (
        <Notification
          message={notification.message}
          type={notification.type}
          onClose={closeNotification}
        />
      )}
    </Layout>
  );
};

// 使用角色守卫高阶组件包装首页，允许管理员和职工访问
export default withRoleGuard(Dashboard, ['admin', 'staff']); 