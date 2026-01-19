import { FileText, Download, Printer } from 'lucide-react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

// 症状严重程度映射
const severityMap = {
  'mild': '轻微',
  'moderate': '中等',
  'severe': '严重'
};

export default function HealthReport({ healthData }) {
  const generateReport = async () => {
    // 创建一个隐藏的 HTML 元素来渲染报告
    const reportElement = document.createElement('div');
    reportElement.style.position = 'fixed';
    reportElement.style.left = '-9999px';
    reportElement.style.top = '0';
    reportElement.style.width = '800px';
    reportElement.style.backgroundColor = 'white';
    reportElement.style.padding = '40px';
    reportElement.style.fontFamily = 'Arial, sans-serif';

    // 构建报告 HTML
    reportElement.innerHTML = `
      <div style="text-align: center; margin-bottom: 30px; border-bottom: 2px solid #3b82f6; padding-bottom: 20px;">
        <h1 style="color: #1e40af; margin: 0; font-size: 28px;">U-HealthDashboard 健康报告</h1>
        <p style="color: #6b7280; margin: 10px 0 0 0; font-size: 14px;">生成时间: ${new Date().toLocaleString('zh-CN')}</p>
      </div>

      <div style="margin-bottom: 30px;">
        <h2 style="color: #1e40af; margin: 0 0 15px 0; font-size: 20px; border-left: 4px solid #3b82f6; padding-left: 10px;">用户信息</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: bold; width: 30%;">姓名</td>
            <td style="padding: 10px; border: 1px solid #e5e7eb;">${healthData.profile.name || '未设置'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: bold;">年龄</td>
            <td style="padding: 10px; border: 1px solid #e5e7eb;">${healthData.profile.age || '未设置'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: bold;">血型</td>
            <td style="padding: 10px; border: 1px solid #e5e7eb;">${healthData.profile.bloodType || '未设置'}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: bold;">身高</td>
            <td style="padding: 10px; border: 1px solid #e5e7eb;">${healthData.profile.height || '未设置'} cm</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: bold;">体重</td>
            <td style="padding: 10px; border: 1px solid #e5e7eb;">${healthData.profile.weight || '未设置'} kg</td>
          </tr>
        </table>
      </div>

      ${healthData.profile.allergies && healthData.profile.allergies.length > 0 ? `
      <div style="margin-bottom: 30px;">
        <h2 style="color: #dc2626; margin: 0 0 15px 0; font-size: 20px; border-left: 4px solid #ef4444; padding-left: 10px;">过敏信息</h2>
        <div style="background: #fef2f2; padding: 15px; border-radius: 8px; border: 1px solid #fecaca;">
          ${healthData.profile.allergies.map(allergy => `
            <span style="display: inline-block; background: #fee2e2; color: #991b1b; padding: 6px 12px; border-radius: 16px; margin: 4px; font-size: 13px;">${allergy}</span>
          `).join('')}
        </div>
      </div>
      ` : ''}

      ${healthData.profile.chronicDiseases && healthData.profile.chronicDiseases.length > 0 ? `
      <div style="margin-bottom: 30px;">
        <h2 style="color: #d97706; margin: 0 0 15px 0; font-size: 20px; border-left: 4px solid #f59e0b; padding-left: 10px;">慢性疾病</h2>
        <div style="background: #fffbeb; padding: 15px; border-radius: 8px; border: 1px solid #fde68a;">
          ${healthData.profile.chronicDiseases.map(disease => `
            <span style="display: inline-block; background: #fef3c7; color: #92400e; padding: 6px 12px; border-radius: 16px; margin: 4px; font-size: 13px;">${disease}</span>
          `).join('')}
        </div>
      </div>
      ` : ''}

      ${healthData.profile.emergencyContact && healthData.profile.emergencyContact.name ? `
      <div style="margin-bottom: 30px;">
        <h2 style="color: #059669; margin: 0 0 15px 0; font-size: 20px; border-left: 4px solid #10b981; padding-left: 10px;">紧急联系人</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: bold; width: 30%;">姓名</td>
            <td style="padding: 10px; border: 1px solid #e5e7eb;">${healthData.profile.emergencyContact.name}</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: bold;">电话</td>
            <td style="padding: 10px; border: 1px solid #e5e7eb;">${healthData.profile.emergencyContact.phone}</td>
          </tr>
        </table>
      </div>
      ` : ''}

      <div style="margin-bottom: 30px;">
        <h2 style="color: #7c3aed; margin: 0 0 15px 0; font-size: 20px; border-left: 4px solid #8b5cf6; padding-left: 10px;">当前健康指标</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 10px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: bold; width: 30%;">血压</td>
            <td style="padding: 10px; border: 1px solid #e5e7eb;">${healthData.vitals?.bloodPressure?.systolic || 0}/${healthData.vitals?.bloodPressure?.diastolic || 0} mmHg</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: bold;">心率</td>
            <td style="padding: 10px; border: 1px solid #e5e7eb;">${healthData.vitals?.heartRate?.value || 0} bpm</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: bold;">体重</td>
            <td style="padding: 10px; border: 1px solid #e5e7eb;">${healthData.vitals?.weight?.value || 0} kg</td>
          </tr>
          <tr>
            <td style="padding: 10px; border: 1px solid #e5e7eb; background: #f9fafb; font-weight: bold;">睡眠</td>
            <td style="padding: 10px; border: 1px solid #e5e7eb;">${healthData.vitals?.sleep?.value || 0} 小时</td>
          </tr>
        </table>
      </div>

      ${healthData.medications && healthData.medications.length > 0 ? `
      <div style="margin-bottom: 30px;">
        <h2 style="color: #7c3aed; margin: 0 0 15px 0; font-size: 20px; border-left: 4px solid #a855f7; padding-left: 10px;">用药清单</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #f3e8ff;">
              <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: left;">药物名称</th>
              <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: left;">剂量</th>
              <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: left;">频率</th>
              <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: left;">时间</th>
            </tr>
          </thead>
          <tbody>
            ${healthData.medications.map(med => `
              <tr>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">${med.name}</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">${med.dosage}</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">${med.frequency}</td>
                <td style="padding: 10px; border: 1px solid #e5e7eb;">${med.time}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
      ` : ''}

      ${healthData.symptoms && healthData.symptoms.length > 0 ? `
      <div style="margin-bottom: 30px;">
        <h2 style="color: #dc2626; margin: 0 0 15px 0; font-size: 20px; border-left: 4px solid #f43f5e; padding-left: 10px;">症状记录</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <thead>
            <tr style="background: #ffe4e6;">
              <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: left;">日期</th>
              <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: left;">症状</th>
              <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: left;">严重程度</th>
              <th style="padding: 10px; border: 1px solid #e5e7eb; text-align: left;">备注</th>
            </tr>
          </thead>
          <tbody>
            ${healthData.symptoms.map(symptom => {
              const severityText = severityMap[symptom.severity] || symptom.severity;
              return `
                <tr>
                  <td style="padding: 10px; border: 1px solid #e5e7eb;">${symptom.date}</td>
                  <td style="padding: 10px; border: 1px solid #e5e7eb;">${symptom.symptoms}</td>
                  <td style="padding: 10px; border: 1px solid #e5e7eb;">${severityText}</td>
                  <td style="padding: 10px; border: 1px solid #e5e7eb;">${symptom.notes || '-'}</td>
                </tr>
              `;
            }).join('')}
          </tbody>
        </table>
      </div>
      ` : ''}

      <div style="margin-top: 50px; padding-top: 20px; border-top: 1px solid #e5e7eb; text-align: center; color: #9ca3af; font-size: 12px;">
        <p>此报告由 U-HealthDashboard 生成 | 生成时间: ${new Date().toLocaleString('zh-CN')}</p>
      </div>
    `;

    // 添加到文档
    document.body.appendChild(reportElement);

    try {
      // 使用 html2canvas 转换为图片
      const canvas = await html2canvas(reportElement, {
        scale: 2,
        useCORS: true,
        logging: false
      });

      // 创建 PDF
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgWidth = 210;
      const pageHeight = 297;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // 添加第一页
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // 如果需要分页
      while (heightLeft > 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // 保存 PDF
      pdf.save(`健康报告_${healthData.profile.name || '用户'}.pdf`);
    } catch (error) {
      console.error('生成 PDF 失败:', error);
      alert('生成 PDF 失败,请重试');
    } finally {
      // 移除临时元素
      document.body.removeChild(reportElement);
    }
  };

  // 计算健康统计数据
  const calculateHealthStats = () => {
    const history = healthData.vitalHistory || [];
    
    // 计算最近7天的平均指标
    const recentRecords = [...history]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 7);
    
    if (recentRecords.length === 0) return null;
    
    const avgHeartRate = recentRecords.reduce((sum, record) => sum + record.heartRate, 0) / recentRecords.length;
    const avgWeight = recentRecords.reduce((sum, record) => sum + record.weight, 0) / recentRecords.length;
    const avgSleep = recentRecords.reduce((sum, record) => sum + record.sleep, 0) / recentRecords.length;
    
    return {
      avgHeartRate: avgHeartRate.toFixed(1),
      avgWeight: avgWeight.toFixed(1),
      avgSleep: avgSleep.toFixed(1),
      daysCount: recentRecords.length
    };
  };
  
  const healthStats = calculateHealthStats();
  
  return (
    <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <FileText className="w-8 h-8 text-blue-500" />
          <div>
            <h3 className="text-xl font-bold text-gray-800">健康报告</h3>
            <p className="text-sm text-gray-500">一键生成可打印的健康报告</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-blue-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-blue-600">{healthData.medications?.length || 0}</div>
          <div className="text-sm text-gray-600">用药数量</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-purple-600">{healthData.symptoms?.length || 0}</div>
          <div className="text-sm text-gray-600">症状记录</div>
        </div>
        <div className="bg-green-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-green-600">{healthData.vitalHistory?.length || 0}</div>
          <div className="text-sm text-gray-600">健康记录天数</div>
        </div>
        <div className="bg-orange-50 rounded-lg p-4 text-center">
          <div className="text-2xl font-bold text-orange-600">{healthData.profile.allergies?.length || 0}</div>
          <div className="text-sm text-gray-600">过敏源数量</div>
        </div>
      </div>

      {healthStats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-lg p-4 text-center">
            <div className="text-xl font-bold text-blue-600">{healthStats.avgHeartRate}</div>
            <div className="text-sm text-gray-600">近{healthStats.daysCount}天平均心率 (bpm)</div>
          </div>
          <div className="bg-green-50 rounded-lg p-4 text-center">
            <div className="text-xl font-bold text-green-600">{healthStats.avgWeight}</div>
            <div className="text-sm text-gray-600">近{healthStats.daysCount}天平均体重 (kg)</div>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 text-center">
            <div className="text-xl font-bold text-purple-600">{healthStats.avgSleep}</div>
            <div className="text-sm text-gray-600">近{healthStats.daysCount}天平均睡眠 (小时)</div>
          </div>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-4">
        <p className="text-gray-600 text-sm mb-2">
          报告将包含以下内容:
        </p>
        <ul className="text-sm text-gray-600 space-y-1">
          <li>• 用户基本信息(姓名、年龄、血型等)</li>
          <li>• 过敏信息和慢性疾病</li>
          <li>• 紧急联系人信息</li>
          <li>• 当前健康指标(血压、心率、体重、睡眠)</li>
          <li>• 用药清单和用药提醒设置</li>
          <li>• 症状追踪记录</li>
        </ul>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={generateReport}
          className="flex-1 flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg hover:from-blue-600 hover:to-blue-700 transition font-semibold"
        >
          <Download className="w-5 h-5" />
          <span>下载PDF报告</span>
        </button>

        <button
          onClick={generateReport}
          className="flex-1 flex items-center justify-center space-x-2 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition font-semibold"
        >
          <Printer className="w-5 h-5" />
          <span>打印报告</span>
        </button>
      </div>
    </div>
  );
}
