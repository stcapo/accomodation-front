import React, { useState, useContext } from 'react';
import Layout from '../components/Layout';
import { GlobalContext, AuthContext } from './_app';
import withRoleGuard from '../components/withRoleGuard';
import Notification from '../components/Notification';

const Maintenance = () => {
  const { maintenanceRecords, setMaintenanceRecords, accommodations } = useContext(GlobalContext);
  const { userRole } = useContext(AuthContext);
  const isAdmin = userRole === 'admin';
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editRecord, setEditRecord] = useState(null);
  const [deleteRecord, setDeleteRecord] = useState(null);
  const [newRecord, setNewRecord] = useState({
    roomId: '',
    type: '水电维修',
    description: '',
    reportDate: new Date().toISOString().split('T')[0],
    status: '待处理'
  });
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
  const filteredRecords = maintenanceRecords.filter(record => {
    const roomInfo = accommodations.find(room => room.id === record.roomId);
    const roomDesc = roomInfo ? `${roomInfo.buildingName} ${roomInfo.roomNumber}` : '';
    
    const matchesSearch = searchTerm === '' || 
      roomDesc.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === '' || record.status === filterStatus;
    const matchesType = filterType === '' || record.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // 获取所有可能的状态
  const statuses = [...new Set(maintenanceRecords.map(record => record.status))];

  // 获取所有可能的维修类型
  const types = [...new Set(maintenanceRecords.map(record => record.type))];

  // 根据房间ID获取房间信息
  const getRoomInfo = (roomId) => {
    const room = accommodations.find(room => room.id === roomId);
    return room ? `${room.buildingName} ${room.roomNumber}` : '未知';
  };

  // 处理输入变化
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewRecord({ ...newRecord, [name]: value });
  };

  // 添加新维修记录
  const handleAddRecord = () => {
    try {
      if (!newRecord.roomId) {
        showNotification('请选择房间', 'error');
        return;
      }

      if (!newRecord.description) {
        showNotification('请填写故障描述', 'error');
        return;
      }

      const newId = maintenanceRecords.length > 0 
        ? Math.max(...maintenanceRecords.map(record => record.id)) + 1 
        : 1;
        
      const record = {
        ...newRecord,
        id: newId,
        roomId: parseInt(newRecord.roomId),
        reportDate: newRecord.reportDate || new Date().toISOString().split('T')[0]
      };
      
      setMaintenanceRecords([...maintenanceRecords, record]);
      setShowAddModal(false);
      
      // 重置表单
      setNewRecord({
        roomId: '',
        type: '水电维修',
        description: '',
        reportDate: new Date().toISOString().split('T')[0],
        status: '待处理'
      });
      
      showNotification('维修记录添加成功');
    } catch (error) {
      showNotification('添加维修记录失败: ' + error.message, 'error');
    }
  };

  // 编辑维修记录表单处理
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditRecord({
      ...editRecord,
      [name]: value,
    });
  };

  // 打开编辑维修记录模态框
  const handleEditClick = (record) => {
    setEditRecord({...record});
    setShowEditModal(true);
  };

  // 保存编辑的维修记录
  const handleSaveEdit = (e) => {
    e.preventDefault();
    
    // 更新维修记录列表
    const updatedRecords = maintenanceRecords.map(record => 
      record.id === editRecord.id ? {
        ...editRecord,
        roomId: parseInt(editRecord.roomId)
      } : record
    );
    
    setMaintenanceRecords(updatedRecords);
    setShowEditModal(false);
  };

  // 打开删除确认模态框
  const handleDeleteClick = (record) => {
    setDeleteRecord(record);
    setShowDeleteModal(true);
  };

  // 确认删除维修记录
  const handleConfirmDelete = () => {
    // 从维修记录列表中删除
    const updatedRecords = maintenanceRecords.filter(record => record.id !== deleteRecord.id);
    setMaintenanceRecords(updatedRecords);
    
    setShowDeleteModal(false);
  };

  // 更新维修记录状态
  const updateRecordStatus = (id, newStatus) => {
    try {
      const updatedRecords = maintenanceRecords.map(record => {
        if (record.id === id) {
          return { ...record, status: newStatus };
        }
        return record;
      });
      
      setMaintenanceRecords(updatedRecords);
      showNotification(`维修记录状态已更新为: ${newStatus}`);
    } catch (error) {
      showNotification('更新维修记录状态失败: ' + error.message, 'error');
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
      
      <div className="mb-6 flex justify-between">
        <h1 className="text-2xl font-semibold text-gray-900">维修记录管理</h1>
        {isAdmin && (
          <button
            type="button"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            onClick={() => setShowAddModal(true)}
          >
            <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            添加维修记录
          </button>
        )}
      </div>

      {/* 过滤栏 */}
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 mb-6">
        <div className="md:grid md:grid-cols-3 md:gap-6">
          <div className="col-span-1">
            <label htmlFor="maintenance-search" className="block text-sm font-medium text-gray-700 mb-1">搜索维修记录</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                id="maintenance-search"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
                placeholder="搜索房间或描述..."
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
          
          <div className="mt-6 md:mt-0">
            <label htmlFor="type-filter" className="block text-sm font-medium text-gray-700 mb-1">类型筛选</label>
            <select
              id="type-filter"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">全部类型</option>
              {types.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mt-4 border-t border-gray-200 pt-4">
          <div className="grid grid-cols-4 gap-4">
            <div className="col-span-1 bg-gray-50 rounded-md p-3 text-center">
              <div className="text-sm font-medium text-gray-500">总记录数</div>
              <div className="mt-1 text-lg font-semibold text-gray-900">{maintenanceRecords.length}</div>
            </div>
            <div className="col-span-1 bg-gray-50 rounded-md p-3 text-center">
              <div className="text-sm font-medium text-gray-500">待处理</div>
              <div className="mt-1 text-lg font-semibold text-yellow-600">
                {maintenanceRecords.filter(record => record.status === '待处理').length}
              </div>
            </div>
            <div className="col-span-1 bg-gray-50 rounded-md p-3 text-center">
              <div className="text-sm font-medium text-gray-500">处理中</div>
              <div className="mt-1 text-lg font-semibold text-blue-600">
                {maintenanceRecords.filter(record => record.status === '处理中').length}
              </div>
            </div>
            <div className="col-span-1 bg-gray-50 rounded-md p-3 text-center">
              <div className="text-sm font-medium text-gray-500">已完成</div>
              <div className="mt-1 text-lg font-semibold text-green-600">
                {maintenanceRecords.filter(record => record.status === '已完成').length}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 维修记录列表 */}
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      房间
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      类型
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      故障描述
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      报修日期
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      状态
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredRecords.length > 0 ? (
                    filteredRecords.map((record) => (
                      <tr key={record.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{getRoomInfo(record.roomId)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{record.type}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{record.description}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{record.reportDate}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            record.status === '待处理' ? 'bg-yellow-100 text-yellow-800' : 
                            record.status === '处理中' ? 'bg-blue-100 text-blue-800' : 
                            'bg-green-100 text-green-800'
                          }`}>
                            {record.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          {record.status === '待处理' && (
                            <button
                              className="inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 mr-2"
                              onClick={() => updateRecordStatus(record.id, '处理中')}
                            >
                              <svg className="-ml-0.5 mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                              </svg>
                              开始处理
                            </button>
                          )}
                          
                          {record.status === '处理中' && (
                            <button
                              className="inline-flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-xs font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 mr-2"
                              onClick={() => updateRecordStatus(record.id, '已完成')}
                            >
                              <svg className="-ml-0.5 mr-1 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                              </svg>
                              完成
                            </button>
                          )}
                          
                          {record.status === '已完成' && (
                            <span className="text-sm text-gray-500">已处理完毕</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                        未找到匹配的维修记录
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* 添加维修记录模态框 */}
      {showAddModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={() => setShowAddModal(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 sm:mx-0 sm:h-10 sm:w-10">
                    <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      添加维修记录
                    </h3>
                    <div className="mt-4 space-y-4">
                      <div>
                        <label htmlFor="roomId" className="block text-sm font-medium text-gray-700">房间</label>
                        <select
                          id="roomId"
                          name="roomId"
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={newRecord.roomId}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">选择房间</option>
                          {accommodations.map(room => (
                            <option key={room.id} value={room.id}>
                              {room.buildingName} {room.roomNumber}
                            </option>
                          ))}
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="type" className="block text-sm font-medium text-gray-700">维修类型</label>
                        <select
                          id="type"
                          name="type"
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={newRecord.type}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="水电维修">水电维修</option>
                          <option value="家具维修">家具维修</option>
                          <option value="暖气维修">暖气维修</option>
                          <option value="门窗维修">门窗维修</option>
                          <option value="其他">其他</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">故障描述</label>
                        <textarea
                          id="description"
                          name="description"
                          rows="3"
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          placeholder="请描述故障情况..."
                          value={newRecord.description}
                          onChange={handleInputChange}
                          required
                        ></textarea>
                      </div>
                      
                      <div>
                        <label htmlFor="reportDate" className="block text-sm font-medium text-gray-700">报修日期</label>
                        <input
                          type="date"
                          id="reportDate"
                          name="reportDate"
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={newRecord.reportDate}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleAddRecord}
                >
                  添加
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowAddModal(false)}
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 编辑维修记录模态框 */}
      {showEditModal && editRecord && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={() => setShowEditModal(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSaveEdit}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        编辑维修记录
                      </h3>
                      <div className="mb-4">
                        <label htmlFor="edit-roomId" className="block text-sm font-medium text-gray-700">房间</label>
                        <select
                          id="edit-roomId"
                          name="roomId"
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={editRecord.roomId}
                          onChange={handleEditChange}
                          required
                        >
                          <option value="">选择房间</option>
                          {accommodations.map(room => (
                            <option key={room.id} value={room.id}>
                              {room.buildingName} {room.roomNumber}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-4">
                        <label htmlFor="edit-type" className="block text-sm font-medium text-gray-700">维修类型</label>
                        <select
                          id="edit-type"
                          name="type"
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={editRecord.type}
                          onChange={handleEditChange}
                          required
                        >
                          <option value="">选择类型</option>
                          {types.map(type => (
                            <option key={type} value={type}>{type}</option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-4">
                        <label htmlFor="edit-description" className="block text-sm font-medium text-gray-700">问题描述</label>
                        <textarea
                          id="edit-description"
                          name="description"
                          rows="3"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          value={editRecord.description}
                          onChange={handleEditChange}
                          required
                        ></textarea>
                      </div>
                      <div className="mb-4">
                        <label htmlFor="edit-reportDate" className="block text-sm font-medium text-gray-700">报告日期</label>
                        <input
                          type="date"
                          id="edit-reportDate"
                          name="reportDate"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          value={editRecord.reportDate}
                          onChange={handleEditChange}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="edit-status" className="block text-sm font-medium text-gray-700">状态</label>
                        <select
                          id="edit-status"
                          name="status"
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={editRecord.status}
                          onChange={handleEditChange}
                          required
                        >
                          <option value="进行中">进行中</option>
                          <option value="已完成">已完成</option>
                        </select>
                      </div>
                      {editRecord.status === '已完成' && (
                        <div className="mb-4">
                          <label htmlFor="edit-completionDate" className="block text-sm font-medium text-gray-700">完成日期</label>
                          <input
                            type="date"
                            id="edit-completionDate"
                            name="completionDate"
                            className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            value={editRecord.completionDate || new Date().toISOString().split('T')[0]}
                            onChange={handleEditChange}
                            required={editRecord.status === '已完成'}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    保存
                  </button>
                  <button
                    type="button"
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    onClick={() => setShowEditModal(false)}
                  >
                    取消
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 删除确认模态框 */}
      {showDeleteModal && deleteRecord && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={() => setShowDeleteModal(false)}>
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
                      删除维修记录
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        您确定要删除该维修记录吗？此操作无法撤销。
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={handleConfirmDelete}
                >
                  删除
                </button>
                <button
                  type="button"
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  onClick={() => setShowDeleteModal(false)}
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

// 使用角色守卫高阶组件包装维修记录页面，允许管理员和职工访问
export default withRoleGuard(Maintenance, ['admin', 'staff']); 