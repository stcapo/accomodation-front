// 住宿模拟数据
const accommodations = [
  {
    id: 1,
    buildingName: 'A栋',
    floor: 1,
    roomNumber: 'A101',
    type: '单人间',
    facilities: '独立卫浴、空调、书桌',
    occupant: null,
    occupantId: null,
    status: '未分配'
  },
  {
    id: 2,
    buildingName: 'A栋',
    floor: 1,
    roomNumber: 'A102',
    type: '单人间',
    facilities: '独立卫浴、空调、书桌',
    occupant: {
      id: 1,
      name: '张三',
      department: '行政部'
    },
    occupantId: 1,
    status: '已分配'
  },
  {
    id: 3,
    buildingName: 'A栋',
    floor: 1,
    roomNumber: 'A103',
    type: '双人间',
    facilities: '独立卫浴、空调、书桌*2',
    occupant: {
      id: 3,
      name: '王五',
      department: '技术部'
    },
    occupantId: 3,
    status: '已分配'
  },
  {
    id: 4,
    buildingName: 'A栋',
    floor: 2,
    roomNumber: 'A201',
    type: '单人间',
    facilities: '独立卫浴、空调、书桌',
    occupant: {
      id: 5,
      name: '钱七',
      department: '财务部'
    },
    occupantId: 5,
    status: '已分配'
  },
  {
    id: 5,
    buildingName: 'A栋',
    floor: 2,
    roomNumber: 'A202',
    type: '双人间',
    facilities: '独立卫浴、空调、书桌*2',
    occupant: null,
    occupantId: null,
    status: '未分配'
  },
  {
    id: 6,
    buildingName: 'B栋',
    floor: 1,
    roomNumber: 'B101',
    type: '单人间',
    facilities: '独立卫浴、空调、书桌',
    occupant: {
      id: 2,
      name: '李四',
      department: '人力资源部'
    },
    occupantId: 2,
    status: '已分配'
  },
  {
    id: 7,
    buildingName: 'B栋',
    floor: 1,
    roomNumber: 'B102',
    type: '家庭间',
    facilities: '独立卫浴、空调、书桌、厨房',
    occupant: {
      id: 4,
      name: '赵六',
      department: '市场部'
    },
    occupantId: 4,
    status: '已分配'
  },
  {
    id: 8,
    buildingName: 'B栋',
    floor: 2,
    roomNumber: 'B201',
    type: '单人间',
    facilities: '独立卫浴、空调、书桌',
    occupant: {
      id: 6,
      name: '孙八',
      department: '技术部'
    },
    occupantId: 6,
    status: '已分配'
  },
  {
    id: 9,
    buildingName: 'B栋',
    floor: 2,
    roomNumber: 'B202',
    type: '双人间',
    facilities: '独立卫浴、空调、书桌*2',
    occupant: {
      id: 7,
      name: '周九',
      department: '行政部'
    },
    occupantId: 7,
    status: '已分配'
  },
  {
    id: 10,
    buildingName: 'C栋',
    floor: 1,
    roomNumber: 'C101',
    type: '豪华套间',
    facilities: '独立卫浴、空调、书桌、会客厅、厨房',
    occupant: {
      id: 9,
      name: '郑十一',
      department: '市场部'
    },
    occupantId: 9,
    status: '已分配'
  },
  {
    id: 11,
    buildingName: 'C栋',
    floor: 1,
    roomNumber: 'C102',
    type: '单人间',
    facilities: '独立卫浴、空调、书桌',
    occupant: null,
    occupantId: null,
    status: '未分配'
  },
  {
    id: 12,
    buildingName: 'C栋',
    floor: 2,
    roomNumber: 'C201',
    type: '家庭间',
    facilities: '独立卫浴、空调、书桌、厨房',
    occupant: {
      id: 8,
      name: '吴十',
      department: '人力资源部'
    },
    occupantId: 8,
    status: '已分配'
  },
  {
    id: 13,
    buildingName: 'C栋',
    floor: 2,
    roomNumber: 'C202',
    type: '单人间',
    facilities: '独立卫浴、空调、书桌',
    occupant: {
      id: 10,
      name: '王十二',
      department: '财务部'
    },
    occupantId: 10,
    status: '已分配'
  },
  {
    id: 14,
    buildingName: 'C栋',
    floor: 3,
    roomNumber: 'C301',
    type: '单人间',
    facilities: '独立卫浴、空调、书桌',
    occupant: null,
    occupantId: null,
    status: '未分配'
  },
  {
    id: 15,
    buildingName: 'C栋',
    floor: 3,
    roomNumber: 'C302',
    type: '单人间',
    facilities: '独立卫浴、空调、书桌',
    occupant: null,
    occupantId: null,
    status: '未分配'
  }
];

export default accommodations; 