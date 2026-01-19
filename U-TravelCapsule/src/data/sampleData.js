export const sampleTripData = {
  id: 1,
  destination: "日本东京",
  startDate: "2025-03-15",
  endDate: "2025-03-22",
  schedule: [
    {
      day: 1,
      date: "2025-03-15",
      activities: [
        { time: "09:00", activity: "成田机场接机", location: "成田国际机场", type: "transport" },
        { time: "12:00", activity: "酒店入住", location: "东京站", type: "accommodation" },
        { time: "14:00", activity: "浅草寺参观", location: "浅草", type: "sightseeing" },
        { time: "18:00", activity: "寿司晚餐", location: "筑地市场", type: "dining" }
      ]
    },
    {
      day: 2,
      date: "2025-03-16",
      activities: [
        { time: "08:00", activity: "早餐", location: "酒店", type: "dining" },
        { time: "09:30", activity: "东京塔", location: "港区", type: "sightseeing" },
        { time: "13:00", activity: "拉面午餐", location: "新宿", type: "dining" },
        { time: "15:00", activity: "购物", location: "银座", type: "shopping" },
        { time: "19:00", activity: "和牛晚餐", location: "银座", type: "dining" }
      ]
    }
  ],
  packingList: {
    "衣物": [
      { id: 1, item: "T恤", quantity: 3, packed: false },
      { id: 2, item: "长裤", quantity: 2, packed: false },
      { id: 3, item: "外套", quantity: 1, packed: false },
      { id: 4, item: "内衣裤", quantity: 7, packed: false },
      { id: 5, item: "袜子", quantity: 7, packed: false }
    ],
    "电子产品": [
      { id: 6, item: "手机充电器", quantity: 1, packed: false },
      { id: 7, item: "相机", quantity: 1, packed: false },
      { id: 8, item: "移动电源", quantity: 1, packed: false }
    ],
    "证件": [
      { id: 9, item: "护照", quantity: 1, packed: false },
      { id: 10, item: "签证", quantity: 1, packed: false },
      { id: 11, item: "身份证", quantity: 1, packed: false },
      { id: 12, item: "机票", quantity: 1, packed: false }
    ],
    "日用品": [
      { id: 13, item: "牙刷套装", quantity: 1, packed: false },
      { id: 14, item: "洗发水", quantity: 1, packed: false },
      { id: 15, item: "护肤品", quantity: 1, packed: false }
    ]
  },
  expenses: [
    { id: 1, category: "交通", amount: 5000, description: "往返机票", splitWith: ["A", "B"] },
    { id: 2, category: "住宿", amount: 8000, description: "7天酒店", splitWith: ["A", "B"] },
    { id: 3, category: "餐饮", amount: 3000, description: "餐饮预算", splitWith: ["A", "B"] },
    { id: 4, category: "景点", amount: 1500, description: "景点门票", splitWith: ["A", "B"] }
  ],
  emergencyInfo: {
    hospitals: [
      { name: "圣路加国际医院", address: "东京都中央区明石町9-1", phone: "+81-3-3541-5151" },
      { name: "虎之门医院", address: "东京都港区虎之门2-2-2", phone: "+81-3-3588-1111" },
      { name: "庆应义塾大学医院", address: "东京都新宿区信浓町35", phone: "+81-3-3353-1211" }
    ],
    embassy: {
      name: "中国驻日本大使馆",
      address: "东京都港区元麻布3-4-33",
      phone: "+81-3-3403-3388",
      emergency: "+81-90-4402-2031"
    },
    localPolice: { name: "日本警察紧急电话", number: "110" },
    ambulance: { name: "救护车", number: "119" }
  }
};

export const defaultTripData = {
  id: Date.now(),
  destination: "",
  startDate: "",
  endDate: "",
  schedule: [],
  packingList: {
    "衣物": [],
    "电子产品": [],
    "证件": [],
    "日用品": []
  },
  expenses: [],
  emergencyInfo: {
    hospitals: [],
    embassy: {},
    localPolice: {},
    ambulance: {}
  }
};
