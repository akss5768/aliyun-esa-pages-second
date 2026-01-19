import { useState } from 'react';
import { MapPin, Calendar, User, Menu, Edit3 } from 'lucide-react';

export default function Header({ tripData, onMenuToggle, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [tempDestination, setTempDestination] = useState(tripData?.destination || '');
  const [tempStartDate, setTempStartDate] = useState(tripData?.startDate || '');
  const [tempEndDate, setTempEndDate] = useState(tripData?.endDate || '');
  
  const handleSave = () => {
    if (onUpdate) {
      onUpdate({
        ...tripData,
        destination: tempDestination,
        startDate: tempStartDate,
        endDate: tempEndDate
      });
    }
    setEditing(false);
  };
  
  const handleCancel = () => {
    setTempDestination(tripData?.destination || '');
    setTempStartDate(tripData?.startDate || '');
    setTempEndDate(tripData?.endDate || '');
    setEditing(false);
  };
  
  const editable = !!onUpdate;
  
  return (
    <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <MapPin className="w-8 h-8" />
            <h1 className="text-xl font-bold">U-TravelCapsule</h1>
          </div>
          
          <button 
            onClick={onMenuToggle}
            className="md:hidden p-2 hover:bg-white/20 rounded-lg transition"
          >
            <Menu className="w-6 h-6" />
          </button>
          
          <div className="hidden md:flex items-center space-x-6">
            {tripData?.destination && (
              <>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-5 h-5" />
                  {editing ? (
                    <input
                      type="text"
                      value={tempDestination}
                      onChange={(e) => setTempDestination(e.target.value)}
                      className="bg-white/20 text-white placeholder-white/70 border border-white/30 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-white w-32"
                      placeholder="目的地"
                    />
                  ) : (
                    <span>{tripData.destination}</span>
                  )}
                  {editable && (
                    <button 
                      onClick={() => setEditing(!editing)}
                      className="p-1 hover:bg-white/20 rounded transition"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  {editing ? (
                    <div className="flex items-center space-x-2">
                      <input
                        type="date"
                        value={tempStartDate}
                        onChange={(e) => setTempStartDate(e.target.value)}
                        className="bg-white/20 text-white border border-white/30 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-white"
                      />
                      <span>~</span>
                      <input
                        type="date"
                        value={tempEndDate}
                        onChange={(e) => setTempEndDate(e.target.value)}
                        className="bg-white/20 text-white border border-white/30 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-white"
                      />
                    </div>
                  ) : (
                    <span>{tripData.startDate} ~ {tripData.endDate}</span>
                  )}
                </div>
              </>
            )}
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5" />
              <span>旅行者</span>
            </div>
            {editing && (
              <div className="flex space-x-2">
                <button
                  onClick={handleSave}
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition text-sm"
                >
                  保存
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition text-sm"
                >
                  取消
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
