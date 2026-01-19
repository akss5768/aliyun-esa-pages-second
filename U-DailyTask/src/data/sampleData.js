export const sampleTaskTypes = {
  "工作": [
    { id: 1, name: "回复邮件", priority: 3, estimatedTime: 15 },
    { id: 2, name: "准备会议", priority: 2, estimatedTime: 30 },
    { id: 3, name: "完成报告", priority: 1, estimatedTime: 60 },
    { id: 4, name: "客户沟通", priority: 2, estimatedTime: 45 },
    { id: 5, name: "项目规划", priority: 1, estimatedTime: 90 }
  ],
  "学习": [
    { id: 6, name: "阅读技术文档", priority: 2, estimatedTime: 30 },
    { id: 7, name: "练习编程", priority: 2, estimatedTime: 60 },
    { id: 8, name: "学习新技能", priority: 3, estimatedTime: 45 },
    { id: 9, name: "整理笔记", priority: 3, estimatedTime: 20 }
  ],
  "健康": [
    { id: 10, name: "晨跑", priority: 1, estimatedTime: 30 },
    { id: 11, name: "拉伸运动", priority: 2, estimatedTime: 15 },
    { id: 12, name: "喝水提醒", priority: 1, estimatedTime: 5 },
    { id: 13, name: "冥想", priority: 2, estimatedTime: 20 },
    { id: 14, name: "做家务", priority: 3, estimatedTime: 45 }
  ],
  "生活": [
    { id: 15, name: "整理房间", priority: 3, estimatedTime: 30 },
    { id: 16, name: "购物", priority: 2, estimatedTime: 60 },
    { id: 17, name: "打扫卫生", priority: 2, estimatedTime: 45 },
    { id: 18, name: "做饭", priority: 2, estimatedTime: 60 },
    { id: 19, name: "休息", priority: 1, estimatedTime: 30 }
  ],
  "其他": [
    { id: 20, name: "阅读新闻", priority: 3, estimatedTime: 15 },
    { id: 21, name: "整理电脑", priority: 3, estimatedTime: 30 },
    { id: 22, name: "备份文件", priority: 3, estimatedTime: 10 }
  ],
  "玩": [
    { id: 23, name: "玩电脑游戏", priority: 3, estimatedTime: 60 },
    { id: 24, name: "玩纸牌游戏", priority: 3, estimatedTime: 30 },
    { id: 25, name: "玩GalGame", priority: 3, estimatedTime: 90 }
  ]
};

export const sampleHistory = [
  { date: "2025-01-15", tasks: ["回复邮件", "晨跑", "阅读技术文档", "整理房间"], completed: 4, total: 4 },
  { date: "2025-01-16", tasks: ["准备会议", "拉伸运动", "购物"], completed: 3, total: 3 },
  { date: "2025-01-17", tasks: ["完成报告", "练习编程", "做家务", "阅读新闻"], completed: 3, total: 4 },
  { date: "2025-01-18", tasks: ["客户沟通", "喝水提醒", "做饭"], completed: 3, total: 3 }
];

export const defaultTaskTypes = {
  "工作": [],
  "学习": [],
  "健康": [],
  "生活": [],
  "其他": [],
  "玩": []
};

export const defaultHistory = [];

export const priorityLabels = {
  1: "高",
  2: "中",
  3: "低"
};

export const priorityColors = {
  1: "red",
  2: "yellow",
  3: "green"
};
