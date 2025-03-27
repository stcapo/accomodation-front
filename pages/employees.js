import React, { useState, useContext } from 'react';
import Layout from '../components/Layout';
import { GlobalContext } from './_app';
import withRoleGuard from '../components/withRoleGuard';
import Notification from '../components/Notification';

const Employees = () => {
  const { employees, setEmployees, accommodations } = useContext(GlobalContext);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editEmployee, setEditEmployee] = useState(null);
  const [deleteEmployee, setDeleteEmployee] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: '', type: 'success' });
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    department: '',
    position: '',
    employeeId: '',
  });

  // 显示通知
  const showNotification = (message, type = 'success') => {
    setNotification({ show: true, message, type });
  };

  // 关闭通知
  const closeNotification = () => {
    setNotification({ ...notification, show: false });
  };

  // 处理搜索和过滤
  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = searchTerm === '' || 
      employee.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDepartment = filterDepartment === '' || employee.department === filterDepartment;
    
    return matchesSearch && matchesDepartment;
  });

  // 获取可用部门列表
  const departments = [...new Set(employees.map(emp => emp.department))];

  // 获取房间信息
  const getAccommodationInfo = (employeeId) => {
    const room = accommodations.find(acc => acc.occupantId === employeeId);
    if (room) {
      return `${room.buildingName} ${room.roomNumber}`;
    }
    return '未分配';
  };

  // 添加新职工表单处理
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewEmployee({
      ...newEmployee,
      [name]: value,
    });
  };

  // 编辑职工表单处理
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditEmployee({
      ...editEmployee,
      [name]: value,
    });
  };

  // 添加新职工
  const handleAddEmployee = (e) => {
    e.preventDefault();
    
    try {
      // 创建新职工对象，分配新ID
      const newId = Math.max(0, ...employees.map(emp => emp.id)) + 1;
      const employeeToAdd = {
        ...newEmployee,
        id: newId,
      };
      
      // 更新职工列表
      setEmployees([...employees, employeeToAdd]);
      
      // 重置表单并关闭模态框
      setNewEmployee({
        name: '',
        department: '',
        position: '',
        employeeId: '',
      });
      setShowAddModal(false);
      
      showNotification('职工添加成功');
    } catch (error) {
      showNotification('职工添加失败: ' + error.message, 'error');
    }
  };

  // 打开编辑职工模态框
  const handleEditClick = (employee) => {
    setEditEmployee({...employee});
    setShowEditModal(true);
  };

  // 保存编辑的职工信息
  const handleSaveEdit = (e) => {
    e.preventDefault();
    
    try {
      // 更新职工列表
      const updatedEmployees = employees.map(emp => 
        emp.id === editEmployee.id ? editEmployee : emp
      );
      
      setEmployees(updatedEmployees);
      setShowEditModal(false);
      
      showNotification('职工信息更新成功');
    } catch (error) {
      showNotification('职工信息更新失败: ' + error.message, 'error');
    }
  };

  // 打开删除确认模态框
  const handleDeleteClick = (employee) => {
    setDeleteEmployee(employee);
    setShowDeleteModal(true);
  };

  // 确认删除职工
  const handleConfirmDelete = () => {
    try {
      // 检查该职工是否分配了房间
      const assignedRoom = accommodations.find(acc => acc.occupantId === deleteEmployee.id);
      
      if (assignedRoom) {
        showNotification(`无法删除：该职工已分配房间 ${assignedRoom.buildingName} ${assignedRoom.roomNumber}，请先解除房间分配。`, 'error');
        setShowDeleteModal(false);
        return;
      }
      
      // 从职工列表中删除
      const updatedEmployees = employees.filter(emp => emp.id !== deleteEmployee.id);
      setEmployees(updatedEmployees);
      
      setShowDeleteModal(false);
      showNotification('职工删除成功');
    } catch (error) {
      showNotification('职工删除失败: ' + error.message, 'error');
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
        <h1 className="text-2xl font-semibold text-gray-900">职工管理</h1>
      </div>

      {/* 过滤栏 */}
      <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6 mb-6">
        <div className="md:grid md:grid-cols-4 md:gap-6">
          <div className="col-span-2">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">搜索职工</label>
            <div className="mt-1 relative rounded-md shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                  <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                type="text"
                id="search"
                className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-md"
                placeholder="搜索姓名或工号..."
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
            <label htmlFor="department-filter" className="block text-sm font-medium text-gray-700 mb-1">部门筛选</label>
            <select
              id="department-filter"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              value={filterDepartment}
              onChange={(e) => setFilterDepartment(e.target.value)}
            >
              <option value="">全部部门</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
          
          <div className="mt-6 md:mt-0 flex items-end">
            <button
              type="button"
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => setShowAddModal(true)}
            >
              <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              添加职工
            </button>
          </div>
        </div>
      </div>

      {/* 职工列表 */}
      <div className="flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      姓名
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      工号
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      部门
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      职位
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      住宿信息
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      操作
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEmployees.length > 0 ? (
                    filteredEmployees.map((employee) => (
                      <tr key={employee.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{employee.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{employee.employeeId}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{employee.department}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{employee.position}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">{getAccommodationInfo(employee.id)}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button 
                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                            onClick={() => handleEditClick(employee)}
                          >
                            编辑
                          </button>
                          <button 
                            className="text-red-600 hover:text-red-900"
                            onClick={() => handleDeleteClick(employee)}
                          >
                            删除
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-4 text-center text-sm text-gray-500">
                        未找到匹配的职工记录
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* 添加职工模态框 */}
      {showAddModal && (
        <div className="fixed z-10 inset-0 overflow-y-auto">
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true" onClick={() => setShowAddModal(false)}>
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleAddEmployee}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        添加新职工
                      </h3>
                      <div className="mb-4">
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">姓名</label>
                        <input
                          type="text"
                          name="name"
                          id="name"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          value={newEmployee.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="employeeId" className="block text-sm font-medium text-gray-700">工号</label>
                        <input
                          type="text"
                          name="employeeId"
                          id="employeeId"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          value={newEmployee.employeeId}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="department" className="block text-sm font-medium text-gray-700">部门</label>
                        <select
                          name="department"
                          id="department"
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={newEmployee.department}
                          onChange={handleInputChange}
                          required
                        >
                          <option value="">选择部门</option>
                          {departments.length > 0 ? (
                            departments.map(dept => (
                              <option key={dept} value={dept}>{dept}</option>
                            ))
                          ) : (
                            <>
                              <option value="技术部">技术部</option>
                              <option value="市场部">市场部</option>
                              <option value="人事部">人事部</option>
                              <option value="财务部">财务部</option>
                            </>
                          )}
                        </select>
                      </div>
                      <div className="mb-4">
                        <label htmlFor="position" className="block text-sm font-medium text-gray-700">职位</label>
                        <input
                          type="text"
                          name="position"
                          id="position"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          value={newEmployee.position}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
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
                    onClick={() => setShowAddModal(false)}
                  >
                    取消
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* 编辑职工模态框 */}
      {showEditModal && editEmployee && (
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
                        编辑职工信息
                      </h3>
                      <div className="mb-4">
                        <label htmlFor="edit-name" className="block text-sm font-medium text-gray-700">姓名</label>
                        <input
                          type="text"
                          name="name"
                          id="edit-name"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          value={editEmployee.name}
                          onChange={handleEditChange}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="edit-employeeId" className="block text-sm font-medium text-gray-700">工号</label>
                        <input
                          type="text"
                          name="employeeId"
                          id="edit-employeeId"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          value={editEmployee.employeeId}
                          onChange={handleEditChange}
                          required
                        />
                      </div>
                      <div className="mb-4">
                        <label htmlFor="edit-department" className="block text-sm font-medium text-gray-700">部门</label>
                        <select
                          name="department"
                          id="edit-department"
                          className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                          value={editEmployee.department}
                          onChange={handleEditChange}
                          required
                        >
                          <option value="">选择部门</option>
                          {departments.map(dept => (
                            <option key={dept} value={dept}>{dept}</option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-4">
                        <label htmlFor="edit-position" className="block text-sm font-medium text-gray-700">职位</label>
                        <input
                          type="text"
                          name="position"
                          id="edit-position"
                          className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                          value={editEmployee.position}
                          onChange={handleEditChange}
                          required
                        />
                      </div>
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
      {showDeleteModal && deleteEmployee && (
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
                      删除职工
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        您确定要删除职工 "{deleteEmployee.name}" 吗？此操作无法撤销。
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

// 使用角色守卫高阶组件包装职工管理页面，只允许管理员访问
export default withRoleGuard(Employees, ['admin']); 