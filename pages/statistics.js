import { useContext, useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { GlobalContext } from './_app';
import withRoleGuard from '../components/withRoleGuard';
import Notification from '../components/Notification';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, Title } from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';

ChartJS.register(ArcElement, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const Statistics = () => {
  const { employees, accommodations, maintenanceRecords } = useContext(GlobalContext);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });
  const [stats, setStats] = useState({
    totalEmployees: 0,
    totalRooms: 0,
    occupiedRooms: 0,
    pendingMaintenance: 0,
  });

  // 图表数据
  const [departmentData, setDepartmentData] = useState({ labels: [], datasets: [] });
  const [roomTypeData, setRoomTypeData] = useState({ labels: [], datasets: [] });
  const [buildingOccupancyData, setBuildingOccupancyData] = useState({ labels: [], datasets: [] });
  const [monthlyMaintenanceData, setMonthlyMaintenanceData] = useState({ labels: [], datasets: [] });
  const [maintenanceTypeData, setMaintenanceTypeData] = useState({ labels: [], datasets: [] });

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

      // 部门统计
      const departmentCounts = {};
      employees.forEach(employee => {
        departmentCounts[employee.department] = (departmentCounts[employee.department] || 0) + 1;
      });

      const deptLabels = Object.keys(departmentCounts);
      const deptValues = Object.values(departmentCounts);
      const deptColors = generateColors(deptLabels.length);
      
      setDepartmentData({
        labels: deptLabels,
        datasets: [{
          label: '职工数量',
          data: deptValues,
          backgroundColor: deptColors,
          borderColor: deptColors.map(color => color.replace('0.8', '1')),
          borderWidth: 1,
        }]
      });

      // 房间类型统计
      const roomTypeCounts = {};
      accommodations.forEach(room => {
        roomTypeCounts[room.type] = (roomTypeCounts[room.type] || 0) + 1;
      });

      const roomTypeLabels = Object.keys(roomTypeCounts);
      const roomTypeValues = Object.values(roomTypeCounts);
      const roomTypeColors = generateColors(roomTypeLabels.length);
      
      setRoomTypeData({
        labels: roomTypeLabels,
        datasets: [{
          label: '房间数量',
          data: roomTypeValues,
          backgroundColor: roomTypeColors,
          borderColor: roomTypeColors.map(color => color.replace('0.8', '1')),
          borderWidth: 1,
        }]
      });

      // 建筑楼宇占用率
      const buildingOccupancy = {};
      accommodations.forEach(room => {
        if (!buildingOccupancy[room.buildingName]) {
          buildingOccupancy[room.buildingName] = { total: 0, occupied: 0 };
        }
        buildingOccupancy[room.buildingName].total += 1;
        if (room.occupant) {
          buildingOccupancy[room.buildingName].occupied += 1;
        }
      });

      const buildingNames = Object.keys(buildingOccupancy);
      const occupancyRates = buildingNames.map(name => 
        (buildingOccupancy[name].occupied / buildingOccupancy[name].total) * 100
      );
      const occupancyColors = generateColors(buildingNames.length);
      
      setBuildingOccupancyData({
        labels: buildingNames,
        datasets: [{
          label: '占用率 (%)',
          data: occupancyRates,
          backgroundColor: occupancyColors,
          borderColor: occupancyColors.map(color => color.replace('0.8', '1')),
          borderWidth: 1,
        }]
      });

      // 月度维修记录
      const monthlyMaintenance = {};
      maintenanceRecords.forEach(record => {
        const date = new Date(record.reportDate);
        const month = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        monthlyMaintenance[month] = (monthlyMaintenance[month] || 0) + 1;
      });

      const months = Object.keys(monthlyMaintenance).sort();
      const maintenanceCounts = months.map(month => monthlyMaintenance[month]);
      const monthlyColors = generateColors(months.length);
      
      setMonthlyMaintenanceData({
        labels: months,
        datasets: [{
          label: '维修数量',
          data: maintenanceCounts,
          backgroundColor: monthlyColors,
          borderColor: monthlyColors.map(color => color.replace('0.8', '1')),
          borderWidth: 1,
        }]
      });

      // 维修类型统计
      const maintenanceTypes = {};
      maintenanceRecords.forEach(record => {
        maintenanceTypes[record.type] = (maintenanceTypes[record.type] || 0) + 1;
      });

      const typeLabels = Object.keys(maintenanceTypes);
      const typeValues = Object.values(maintenanceTypes);
      const typeColors = generateColors(typeLabels.length);
      
      setMaintenanceTypeData({
        labels: typeLabels,
        datasets: [{
          label: '维修类型',
          data: typeValues,
          backgroundColor: typeColors,
          borderColor: typeColors.map(color => color.replace('0.8', '1')),
          borderWidth: 1,
        }]
      });

      showNotification('统计数据加载成功', 'success');
    } catch (error) {
      console.error('加载统计数据出错:', error);
      showNotification('统计数据加载失败', 'error');
    }
  }, [employees, accommodations, maintenanceRecords]);

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

  const occupancyBarOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
        ticks: {
          callback: function(value) {
            return value + '%';
          }
        }
      }
    },
    plugins: {
      title: {
        display: true,
        text: '楼宇房间占用率'
      }
    }
  };

  return (
    <Layout>
      <div className="py-6">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">统计分析</h1>
        
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
            <div style={{ height: '300px', position: 'relative' }}>
              {departmentData.labels.length > 0 && (
                <Pie data={departmentData} options={pieOptions} />
              )}
            </div>
          </div>
          
          <div className="bg-white p-4 shadow rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-3">住宿类型分布</h3>
            <div style={{ height: '300px', position: 'relative' }}>
              {roomTypeData.labels.length > 0 && (
                <Pie data={roomTypeData} options={pieOptions} />
              )}
            </div>
          </div>
        </div>
        
        <div className="bg-white p-4 shadow rounded-lg mb-8">
          <h3 className="text-lg font-medium text-gray-900 mb-3">楼宇房间占用率</h3>
          <div style={{ height: '300px', position: 'relative' }}>
            {buildingOccupancyData.labels.length > 0 && (
              <Bar data={buildingOccupancyData} options={occupancyBarOptions} />
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-4 shadow rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-3">月度维修记录</h3>
            <div style={{ height: '300px', position: 'relative' }}>
              {monthlyMaintenanceData.labels.length > 0 && (
                <Bar data={monthlyMaintenanceData} options={barOptions} />
              )}
            </div>
          </div>
          
          <div className="bg-white p-4 shadow rounded-lg">
            <h3 className="text-lg font-medium text-gray-900 mb-3">维修类型分布</h3>
            <div style={{ height: '300px', position: 'relative' }}>
              {maintenanceTypeData.labels.length > 0 && (
                <Pie data={maintenanceTypeData} options={pieOptions} />
              )}
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
      </div>
    </Layout>
  );
};

// 使用角色守卫高阶组件包装统计页面，只允许管理员访问
export default withRoleGuard(Statistics, ['admin']); 