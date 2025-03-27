// 维修记录模拟数据
const maintenanceRecords = [
  {
    id: 1,
    roomId: 2,
    roomInfo: 'A栋-A102',
    type: '水电维修',
    description: '洗手间水龙头漏水',
    reportDate: '2023-06-15',
    status: '已完成'
  },
  {
    id: 2,
    roomId: 3,
    roomInfo: 'A栋-A103',
    type: '家具维修',
    description: '书桌抽屉无法正常打开',
    reportDate: '2023-06-20',
    status: '已完成'
  },
  {
    id: 3,
    roomId: 7,
    roomInfo: 'B栋-B102',
    type: '电器维修',
    description: '空调不制冷',
    reportDate: '2023-07-05',
    status: '待处理'
  },
  {
    id: 4,
    roomId: 4,
    roomInfo: 'A栋-A201',
    type: '门窗维修',
    description: '窗户关不严',
    reportDate: '2023-07-10',
    status: '处理中'
  },
  {
    id: 5,
    roomId: 9,
    roomInfo: 'B栋-B202',
    type: '水电维修',
    description: '灯管坏了需要更换',
    reportDate: '2023-07-15',
    status: '待处理'
  },
  {
    id: 6,
    roomId: 10,
    roomInfo: 'C栋-C101',
    type: '其他',
    description: '墙面有裂缝需要修补',
    reportDate: '2023-07-20',
    status: '处理中'
  },
  {
    id: 7,
    roomId: 8,
    roomInfo: 'B栋-B201',
    type: '电器维修',
    description: '电视遥控器失灵',
    reportDate: '2023-07-25',
    status: '待处理'
  },
  {
    id: 8,
    roomId: 13,
    roomInfo: 'C栋-C202',
    type: '水电维修',
    description: '浴室下水道堵塞',
    reportDate: '2023-08-01',
    status: '已完成'
  },
  {
    id: 9,
    roomId: 6,
    roomInfo: 'B栋-B101',
    type: '家具维修',
    description: '衣柜门铰链松动',
    reportDate: '2023-08-05',
    status: '已完成'
  },
  {
    id: 10,
    roomId: 12,
    roomInfo: 'C栋-C201',
    type: '水电维修',
    description: '厨房水槽漏水',
    reportDate: '2023-08-10',
    status: '待处理'
  },
  {
    id: 11,
    roomId: 2,
    roomInfo: 'A栋-A102',
    type: '电器维修',
    description: '床头灯开关失灵',
    reportDate: '2023-08-15',
    status: '处理中'
  },
  {
    id: 12,
    roomId: 3,
    roomInfo: 'A栋-A103',
    type: '门窗维修',
    description: '门锁损坏',
    reportDate: '2023-08-20',
    status: '待处理'
  },
  {
    id: 13,
    roomId: 10,
    roomInfo: 'C栋-C101',
    type: '水电维修',
    description: '热水器不出热水',
    reportDate: '2023-09-01',
    status: '已完成'
  },
  {
    id: 14,
    roomId: 4,
    roomInfo: 'A栋-A201',
    type: '其他',
    description: '墙面霉变需要重新粉刷',
    reportDate: '2023-09-05',
    status: '待处理'
  },
  {
    id: 15,
    roomId: 9,
    roomInfo: 'B栋-B202',
    type: '家具维修',
    description: '床板断裂',
    reportDate: '2023-09-10',
    status: '处理中'
  }
];

export default maintenanceRecords; 