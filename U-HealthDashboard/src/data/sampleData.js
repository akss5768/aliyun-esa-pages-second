export const sampleHealthData = {
  profile: {
    name: "张三",
    age: 28,
    bloodType: "A型",
    height: 175,
    weight: 68,
    allergies: ["青霉素", "花生"],
    chronicDiseases: [],
    emergencyContact: { name: "李四", phone: "13800138000" }
  },
  vitals: {
    bloodPressure: { systolic: 120, diastolic: 80, date: "2025-01-19" },
    heartRate: { value: 72, date: "2025-01-19" },
    weight: { value: 68, date: "2025-01-19" },
    sleep: { value: 7.5, date: "2025-01-19" }
  },
  vitalHistory: [
    { date: "2025-01-13", bloodPressure: "118/78", heartRate: 70, weight: 68.2, sleep: 7.2 },
    { date: "2025-01-14", bloodPressure: "119/79", heartRate: 71, weight: 68.1, sleep: 7.5 },
    { date: "2025-01-15", bloodPressure: "121/80", heartRate: 73, weight: 68.0, sleep: 7.0 },
    { date: "2025-01-16", bloodPressure: "120/79", heartRate: 72, weight: 67.9, sleep: 7.8 },
    { date: "2025-01-17", bloodPressure: "119/80", heartRate: 74, weight: 68.0, sleep: 6.5 },
    { date: "2025-01-18", bloodPressure: "118/78", heartRate: 71, weight: 67.8, sleep: 7.5 },
    { date: "2025-01-19", bloodPressure: "120/80", heartRate: 72, weight: 68.0, sleep: 7.5 }
  ],
  medications: [
    { id: 1, name: "维生素C", dosage: "1片/次", frequency: "每日1次", time: "08:00", remind: true, takenDates: [] },
    { id: 2, name: "钙片", dosage: "1片/次", frequency: "每日1次", time: "09:00", remind: true, takenDates: [] },
    { id: 3, name: "鱼肝油", dosage: "2粒/次", frequency: "每日1次", time: "20:00", remind: false, takenDates: [] }
  ],
  symptoms: [
    { id: 1, date: "2025-01-15", symptoms: "轻微头痛", severity: "mild", notes: "可能是睡眠不足", image: null },
    { id: 2, date: "2025-01-17", symptoms: "疲劳", severity: "mild", notes: "工作压力大", image: null },
    { id: 3, date: "2025-01-18", symptoms: "喉咙痛", severity: "moderate", notes: "可能是感冒初期", image: null }
  ]
};

export const defaultHealthData = {
  profile: {
    name: "",
    age: "",
    bloodType: "",
    height: "",
    weight: "",
    allergies: [],
    chronicDiseases: [],
    emergencyContact: { name: "", phone: "" }
  },
  vitals: {
    bloodPressure: { systolic: 0, diastolic: 0, date: "" },
    heartRate: { value: 0, date: "" },
    weight: { value: 0, date: "" },
    sleep: { value: 0, date: "" }
  },
  vitalHistory: [],
  medications: [],
  symptoms: []
};
