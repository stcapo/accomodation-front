export const employees = [
  { id: 1, name: '张三', department: '技术部', position: '高级工程师', employeeId: 'EMP001' },
  { id: 2, name: '李四', department: '市场部', position: '市场经理', employeeId: 'EMP002' },
  { id: 3, name: '王五', department: '人事部', position: '人事专员', employeeId: 'EMP003' },
  { id: 4, name: '赵六', department: '财务部', position: '财务主管', employeeId: 'EMP004' },
  { id: 5, name: '钱七', department: '技术部', position: '初级工程师', employeeId: 'EMP005' },
  { id: 6, name: '孙八', department: '市场部', position: '市场助理', employeeId: 'EMP006' },
  { id: 7, name: '周九', department: '人事部', position: '招聘专员', employeeId: 'EMP007' },
  { id: 8, name: '吴十', department: '财务部', position: '出纳', employeeId: 'EMP008' },
  { id: 9, name: '郑十一', department: '技术部', position: '测试工程师', employeeId: 'EMP009' },
  { id: 10, name: '王十二', department: '市场部', position: '销售代表', employeeId: 'EMP010' },
];

export const accommodations = [
  { id: 1, buildingName: 'A栋', roomNumber: 'A101', type: '单人间', status: '已分配', occupantId: 1, facilities: ['空调', '热水器', '洗衣机'] },
  { id: 2, buildingName: 'A栋', roomNumber: 'A102', type: '单人间', status: '已分配', occupantId: 2, facilities: ['空调', '热水器'] },
  { id: 3, buildingName: 'A栋', roomNumber: 'A103', type: '双人间', status: '已分配', occupantId: 3, facilities: ['空调', '热水器', '电视'] },
  { id: 4, buildingName: 'A栋', roomNumber: 'A104', type: '双人间', status: '未分配', occupantId: null, facilities: ['空调', '热水器'] },
  { id: 5, buildingName: 'B栋', roomNumber: 'B101', type: '单人间', status: '已分配', occupantId: 4, facilities: ['空调', '热水器', '冰箱'] },
  { id: 6, buildingName: 'B栋', roomNumber: 'B102', type: '单人间', status: '已分配', occupantId: 5, facilities: ['空调', '热水器'] },
  { id: 7, buildingName: 'B栋', roomNumber: 'B103', type: '双人间', status: '已分配', occupantId: 6, facilities: ['空调', '热水器', '洗衣机'] },
  { id: 8, buildingName: 'B栋', roomNumber: 'B104', type: '双人间', status: '未分配', occupantId: null, facilities: ['空调', '热水器'] },
  { id: 9, buildingName: 'C栋', roomNumber: 'C101', type: '单人间', status: '已分配', occupantId: 7, facilities: ['空调', '热水器', '电视'] },
  { id: 10, buildingName: 'C栋', roomNumber: 'C102', type: '单人间', status: '已分配', occupantId: 8, facilities: ['空调', '热水器'] },
  { id: 11, buildingName: 'C栋', roomNumber: 'C103', type: '双人间', status: '已分配', occupantId: 9, facilities: ['空调', '热水器', '冰箱'] },
  { id: 12, buildingName: 'C栋', roomNumber: 'C104', type: '双人间', status: '未分配', occupantId: null, facilities: ['空调', '热水器'] },
  { id: 13, buildingName: 'D栋', roomNumber: 'D101', type: '单人间', status: '已分配', occupantId: 10, facilities: ['空调', '热水器', '洗衣机'] },
  { id: 14, buildingName: 'D栋', roomNumber: 'D102', type: '单人间', status: '未分配', occupantId: null, facilities: ['空调', '热水器'] },
  { id: 15, buildingName: 'D栋', roomNumber: 'D103', type: '双人间', status: '未分配', occupantId: null, facilities: ['空调', '热水器', '电视'] },
  { id: 16, buildingName: 'D栋', roomNumber: 'D104', type: '双人间', status: '未分配', occupantId: null, facilities: ['空调', '热水器'] },
];

export const maintenanceRecords = [
  { id: 1, roomId: 1, type: '设备维修', description: '空调故障', status: '已完成', reportDate: '2023-01-15', completionDate: '2023-01-17' },
  { id: 2, roomId: 3, type: '设备维修', description: '热水器漏水', status: '进行中', reportDate: '2023-02-10', completionDate: null },
  { id: 3, roomId: 5, type: '设备维修', description: '冰箱不制冷', status: '已完成', reportDate: '2023-02-20', completionDate: '2023-02-22' },
  { id: 4, roomId: 7, type: '设备维修', description: '洗衣机不排水', status: '已完成', reportDate: '2023-03-05', completionDate: '2023-03-08' },
  { id: 5, roomId: 9, type: '设备维修', description: '电视无信号', status: '进行中', reportDate: '2023-03-15', completionDate: null },
  { id: 6, roomId: 2, type: '房间维修', description: '墙面漏水', status: '已完成', reportDate: '2023-01-25', completionDate: '2023-01-28' },
  { id: 7, roomId: 4, type: '房间维修', description: '门锁损坏', status: '进行中', reportDate: '2023-02-15', completionDate: null },
  { id: 8, roomId: 6, type: '房间维修', description: '窗户无法关闭', status: '已完成', reportDate: '2023-02-25', completionDate: '2023-02-27' },
  { id: 9, roomId: 8, type: '房间维修', description: '天花板漏水', status: '进行中', reportDate: '2023-03-10', completionDate: null },
  { id: 10, roomId: 10, type: '房间维修', description: '地板损坏', status: '已完成', reportDate: '2023-03-20', completionDate: '2023-03-23' },
]; 