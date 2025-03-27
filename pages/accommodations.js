import React, { useState, useContext } from 'react';
import Layout from '../components/Layout';
import { GlobalContext, AuthContext } from './_app';
import withRoleGuard from '../components/withRoleGuard';
import Notification from '../components/Notification';

const Accommodations = () => {
  const { accommodations, setAccommodations, employees } = useContext(GlobalContext);
  const { userRole } = useContext(AuthContext);
  const isAdmin = userRole === 'admin';
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBuilding, setFilterBuilding] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showUnassignModal, setShowUnassignModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [selectedEmployeeId, setSelectedEmployeeId] = useState('');
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });

  // 显示通知
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
  };

  // 关闭通知
  const closeNotification = () => {
    setNotification({ ...notification, show: false });
  };

  // 处理搜索和过滤
  const filteredRooms = accommodations.filter(room => {
    const matchesSearch = searchTerm === '' || 
      room.roomNumber.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBuilding = filterBuilding === '' || room.buildingName === filterBuilding;
    const matchesStatus = filterStatus === '' || room.status === filterStatus;
    
    return matchesSearch && matchesBuilding && matchesStatus;
  });

  // 获取所有建筑物
  const buildings = [...new Set(accommodations.map(room => room.buildingName))];

  // 获取房间状态
  const statuses = [...new Set(accommodations.map(room => room.status))];

  // 获取可分配的职工（未分配房间的）
  const availableEmployees = employees.filter(emp => 
    !accommodations.some(room => room.occupantId === emp.id)
  );

  // 获取职工姓名
  const getEmployeeName = (employeeId) => {
    if (!employeeId) return '未分配';
    const employee = employees.find(emp => emp.id === employeeId);
    return employee ? employee.name : '未知';
  };

  // 处理分配房间
  const handleAssignRoom = (room) => {
    setSelectedRoom(room);
    setSelectedEmployeeId('');
    setShowAssignModal(true);
  };

  // 处理解除分配
  const handleUnassignRoom = (room) => {
    setSelectedRoom(room);
    setShowUnassignModal(true);
  };

  // 确认分配房间
  const confirmAssignRoom = () => {
    try {
      if (!selectedEmployeeId) {
        showNotification('请选择一个职工', 'error');
        return;
      }

      // 更新房间状态
      const updatedRooms = accommodations.map(room => {
        if (room.id === selectedRoom.id) {
          return {
            ...room,
            status: '已分配',
            occupantId: parseInt(selectedEmployeeId)
          };
        }
        return room;
      });

      setAccommodations(updatedRooms);
      setShowAssignModal(false);
      
      const employee = employees.find(emp => emp.id === parseInt(selectedEmployeeId));
      showNotification(`已成功将房间分配给 ${employee ? employee.name : '职工'}`);
    } catch (error) {
      showNotification('房间分配失败: ' + error.message, 'error');
    }
  };

  // 确认解除分配
  const confirmUnassignRoom = () => {
    try {
      const occupantName = getEmployeeName(selectedRoom.occupantId);
      
      // 更新房间状态
      const updatedRooms = accommodations.map(room => {
        if (room.id === selectedRoom.id) {
          return {
            ...room,
            status: '未分配',
            occupantId: null
          };
        }
        return room;
      });

      setAccommodations(updatedRooms);
      setShowUnassignModal(false);
      
      showNotification(`已成功解除 ${occupantName} 的房间分配`);
    } catch (error) {
      showNotification('解除房间分配失败: ' + error.message, 'error');
    }
  };

  return (
    <Layout>
      {notification.show && (
        <Notification 
          message={notification.message} 
          type={notification.type} 
          onClose={closeNotification} 
        />
      )}
      
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">住宿管理</h1>
      </div>

      {/* 过滤栏 */}
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 mb-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="col-span-1">
            <label htmlFor="room-search" className="block text-sm font-medium text-gray-700 mb-1">搜索房间</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                id="room-search"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
                placeholder="搜索房间号..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  <button 
                    onClick={() => setSearchTerm('')}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <span className="sr-only">清除搜索</span>
                    <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-6 md:mt-0">
            <label htmlFor="building-filter" className="block text-sm font-medium text-gray-700 mb-1">建筑物筛选</label>
            <select
              id="building-filter"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={filterBuilding}
              onChange={(e) => setFilterBuilding(e.target.value)}
            >
              <option value="">全部建筑物</option>
              {buildings.map(building => (
                <option key={building} value={building}>{building}</option>
              ))}
            </select>
          </div>
          
          <div className="mt-6 md:mt-0">
            <label htmlFor="status-filter" className="block text-sm font-medium text-gray-700 mb-1">状态筛选</label>
            <select
              id="status-filter"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">全部状态</option>
              {statuses.map(status => (
                <option key={status} value={status}>{status}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-4 border-t border-gray-200 pt-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1 bg-gray-50 rounded-md p-3 text-center">
              <div className="text-sm font-medium text-gray-500">总房间数</div>
              <div className="mt-1 text-lg font-semibold text-gray-900">{accommodations.length}</div>
            </div>
            <div className="col-span-1 bg-gray-50 rounded-md p-3 text-center">
              <div className="text-sm font-medium text-gray-500">已分配</div>
              <div className="mt-1 text-lg font-semibold text-green-600">
                {accommodations.filter(room => room.status === '已分配').length}
              </div>
            </div>
            <div className="col-span-1 bg-gray-50 rounded-md p-3 text-center">
              <div className="text-sm font-medium text-gray-500">未分配</div>
              <div className="mt-1 text-lg font-semibold text-blue-600">
                {accommodations.filter(room => room.status === '未分配').length}
              </div>
            </div>
            <div className="col-span-1 bg-gray-50 rounded-md p-3 text-center">
              <div className="text-sm font-medium text-gray-500">筛选结果</div>
              <div className="mt-1 text-lg font-semibold text-indigo-600">{filteredRooms.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* 房间列表 */}
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      建筑物
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      房间号
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      类型
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      使用者
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      设施
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRooms.length > 0 ? (
                    filteredRooms.map((room) => (
                      <tr key={room.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{room.buildingName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{room.roomNumber}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{room.type}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            room.status === '已分配' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {room.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{getEmployeeName(room.occupantId)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {room.facilities}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {isAdmin ? (
                            room.status === '未分配' ? (
                              <button
                                className="inline-flex items-center justify-center px-3 py-1 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                onClick={() => handleAssignRoom(room)}
                              >
                                <svg className="-ml-0.5 mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path d="M8 9a3 3 0 100-6 3 3 0 000 6zM8 11a6 6 0 016 6H2a6 6 0 016-6z" />
                                </svg>
                                分配
                              </button>
                            ) : (
                              <button 
                                className="inline-flex items-center justify-center px-3 py-1 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                                onClick={() => handleUnassignRoom(room)}
                              >
                                <svg className="-ml-0.5 mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367zM18 10a8 8 0 11-16 0 8 8 0 0116 0z" clipRule="evenodd" />
                                </svg>
                                解除分配
                              </button>
                            )
                          ) : (
                            <span className="text-gray-500 italic">仅可查看</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="px-6 py-4 text-center text-sm text-gray-500">
                        未找到匹配的房间记录
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* 分配房间模态框 */}
      {showAssignModal && selectedRoom && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={() => setShowAssignModal(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                      分配房间
                    </h3>
                    <div className="bg-gray-50 p-4 rounded-md mb-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm font-medium text-gray-500">建筑物</div>
                          <div className="mt-1 text-sm font-medium text-gray-900">{selectedRoom.buildingName}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-500">房间号</div>
                          <div className="mt-1 text-sm font-medium text-gray-900">{selectedRoom.roomNumber}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-500">类型</div>
                          <div className="mt-1 text-sm font-medium text-gray-900">{selectedRoom.type}</div>
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-500">设施</div>
                          <div className="mt-1 text-sm font-medium text-gray-900">{selectedRoom.facilities}</div>
                        </div>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label htmlFor="employee" className="block text-sm font-medium text-gray-700">选择职工</label>
                      <select
                        id="employee"
                        className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        value={selectedEmployeeId}
                        onChange={(e) => setSelectedEmployeeId(e.target.value)}
                      >
                        <option value="">选择职工</option>
                        {availableEmployees.map(emp => (
                          <option key={emp.id} value={emp.id}>{emp.name} ({emp.employeeId})</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={confirmAssignRoom}
                  disabled={!selectedEmployeeId}
                >
                  确认分配
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowAssignModal(false)}
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 解除分配确认模态框 */}
      {showUnassignModal && selectedRoom && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={() => setShowUnassignModal(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      解除房间分配
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        您确定要解除 <span className="font-medium">{selectedRoom.buildingName} {selectedRoom.roomNumber}</span> 的职工 <span className="font-medium">{getEmployeeName(selectedRoom.occupantId)}</span> 分配吗？
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={confirmUnassignRoom}
                >
                  确认解除
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowUnassignModal(false)}
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

// 使用角色守卫高阶组件包装住宿管理页面，允许管理员和职工访问
export default withRoleGuard(Accommodations, ['admin', 'staff']); 