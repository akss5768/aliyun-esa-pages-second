import { Download } from 'lucide-react';
import jsPDF from 'jspdf';

export default function PDFExport({ tripData }) {
  const generatePDF = () => {
    // 创建一个隐藏的div来生成PDF内容
    const contentDiv = document.createElement('div');
    contentDiv.style.fontFamily = 'SimSun, SimHei, sans-serif';
    contentDiv.style.fontSize = '12px';
    contentDiv.style.lineHeight = '1.5';
    contentDiv.style.padding = '20px';
    contentDiv.style.width = '210mm'; // A4宽度
    contentDiv.style.minHeight = '297mm'; // A4高度
    
    // 构建PDF内容
    contentDiv.innerHTML = `
      <h1 style="font-size: 20px; margin-bottom: 15px;">U-TravelCapsule 旅行手册</h1>
      <p style="font-size: 14px; margin: 10px 0;"><strong>目的地:</strong> ${tripData.destination || '未设置'}</p>
      <p style="font-size: 14px; margin: 10px 0;"><strong>出发日期:</strong> ${tripData.startDate || '未设置'}</p>
      <p style="font-size: 14px; margin: 10px 0;"><strong>返回日期:</strong> ${tripData.endDate || '未设置'}</p>
      <h2 style="font-size: 16px; margin: 20px 0 10px 0;">行程安排</h2>
    `;
    
    // 添加行程安排
    if (tripData.schedule && tripData.schedule.length > 0) {
      tripData.schedule.forEach(day => {
        contentDiv.innerHTML += `<h3 style="font-size: 14px; margin: 8px 0;">第 ${day.day} 天 (${day.date})</h3>`;
        
        day.activities.forEach(activity => {
          contentDiv.innerHTML += `
            <div style="margin-left: 10px; margin-bottom: 8px;">
              <p style="margin: 4px 0;"><strong>${activity.time}</strong> - ${activity.activity}</p>
              <p style="margin: 4px 0; font-size: 11px; color: #666;">地点: ${activity.location}</p>
            </div>
          `;
        });
      });
    }
    
    // 添加打包清单
    contentDiv.innerHTML += '<h2 style="font-size: 16px; margin: 20px 0 10px 0;">打包清单</h2>';
    
    if (tripData.packingList) {
      Object.entries(tripData.packingList).forEach(([category, items]) => {
        if (items && items.length > 0) {
          contentDiv.innerHTML += `<h3 style="font-size: 14px; margin: 8px 0;">${category}:</h3>`;
          
          items.forEach(item => {
            const status = item.packed ? '[已打包]' : '[待打包]';
            contentDiv.innerHTML += `
              <div style="margin-left: 10px; margin-bottom: 6px;">
                <p style="margin: 4px 0;">${item.item} x${item.quantity} ${status}</p>
              </div>
            `;
          });
        }
      });
    }
    
    // 添加紧急联系方式
    contentDiv.innerHTML += '<h2 style="font-size: 16px; margin: 20px 0 10px 0;">紧急联系方式</h2>';
    
    if (tripData.emergencyInfo) {
      if (tripData.emergencyInfo.embassy?.name) {
        contentDiv.innerHTML += `
          <div style="margin-bottom: 10px;">
            <p style="margin: 4px 0;"><strong>${tripData.emergencyInfo.embassy.name}</strong></p>
            <p style="margin: 4px 0; font-size: 11px;">电话: ${tripData.emergencyInfo.embassy.phone}</p>
            ${tripData.emergencyInfo.embassy.emergency ? `<p style="margin: 4px 0; font-size: 11px;"><strong>紧急: ${tripData.emergencyInfo.embassy.emergency}</strong></p>` : ''}
          </div>
        `;
      }
      
      contentDiv.innerHTML += `
        <p style="margin: 4px 0;">报警: ${tripData.emergencyInfo.localPolice?.number || '110'}</p>
        <p style="margin: 4px 0;">救护车: ${tripData.emergencyInfo.ambulance?.number || '119'}</p>
      `;
    }
    
    // 将内容添加到body中
    document.body.appendChild(contentDiv);
    
    // 使用html2canvas生成图片，然后添加到PDF
    import('html2canvas').then(module => {
      const html2canvas = module.default;
      html2canvas(contentDiv, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgWidth = 210; // A4宽度(mm)
        const pageHeight = 295; // A4高度(mm)
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;
        
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
        
        // 如果内容超过一页，添加新页
        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        
        pdf.save(`${tripData.destination || '旅行'}_手册.pdf`);
        
        // 清理DOM
        document.body.removeChild(contentDiv);
      });
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-gray-800">导出旅行手册</h3>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 mb-6">
        <p className="text-gray-600 mb-4">
          生成包含完整行程安排、打包清单和紧急联系信息的PDF手册，方便离线查看。
        </p>
        <div className="grid grid-cols-3 gap-4 text-center text-sm">
          <div className="bg-white rounded-lg p-3">
            <div className="font-bold text-blue-600">{tripData?.schedule?.length || 0}</div>
            <div className="text-gray-500">天行程</div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="font-bold text-green-600">
              {Object.values(tripData?.packingList || {}).flat().filter(i => i.packed).length || 0} / 
              {Object.values(tripData?.packingList || {}).flat().length || 0}
            </div>
            <div className="text-gray-500">已打包</div>
          </div>
          <div className="bg-white rounded-lg p-3">
            <div className="font-bold text-purple-600">¥{(tripData?.expenses?.reduce((sum, e) => sum + e.amount, 0) || 0).toLocaleString()}</div>
            <div className="text-gray-500">总预算</div>
          </div>
        </div>
      </div>

      <button
        onClick={generatePDF}
        className="w-full flex items-center justify-center space-x-2 py-4 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl hover:from-blue-600 hover:to-purple-700 transition font-semibold text-lg"
      >
        <Download className="w-6 h-6" />
        <span>生成PDF手册</span>
      </button>
    </div>
  );
}
