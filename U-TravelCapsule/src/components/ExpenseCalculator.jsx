import { useState } from 'react';
import { DollarSign, Calculator, PieChart, Plus, Trash2, Users } from 'lucide-react';

export default function ExpenseCalculator({ expenses, onUpdate }) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newExpense, setNewExpense] = useState({
    category: '交通',
    amount: '',
    description: '',
    splitWith: ['A', 'B']
  });

  const categories = ['交通', '住宿', '餐饮', '景点', '购物', '其他'];
  const people = ['A', 'B', 'C', 'D'];

  const addExpense = () => {
    if (newExpense.amount && newExpense.description) {
      const expense = {
        id: Date.now(),
        ...newExpense,
        amount: parseFloat(newExpense.amount)
      };
      onUpdate([...expenses, expense]);
      setNewExpense({
        category: '交通',
        amount: '',
        description: '',
        splitWith: ['A', 'B']
      });
      setShowAddForm(false);
    }
  };

  const removeExpense = (id) => {
    onUpdate(expenses.filter(e => e.id !== id));
  };

  const togglePersonSplit = (person) => {
    setNewExpense(prev => ({
      ...prev,
      splitWith: prev.splitWith.includes(person)
        ? prev.splitWith.filter(p => p !== person)
        : [...prev.splitWith, person]
    }));
  };

  const calculateTotal = () => expenses.reduce((sum, e) => sum + e.amount, 0);

  const calculateSplitPerPerson = () => {
    const splits = {};
    expenses.forEach(expense => {
      const amountPerPerson = expense.amount / expense.splitWith.length;
      expense.splitWith.forEach(person => {
        splits[person] = (splits[person] || 0) + amountPerPerson;
      });
    });
    return splits;
  };

  const splits = calculateSplitPerPerson();
  const categoryTotals = expenses.reduce((acc, expense) => {
    acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-r from-blue-400 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <DollarSign className="w-8 h-8" />
            <span className="text-sm opacity-80">总支出</span>
          </div>
          <div className="text-3xl font-bold">¥{calculateTotal().toLocaleString()}</div>
        </div>

        <div className="bg-gradient-to-r from-green-400 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <Calculator className="w-8 h-8" />
            <span className="text-sm opacity-80">人均消费</span>
          </div>
          <div className="text-3xl font-bold">
            ¥{(calculateTotal() / Object.keys(splits).length || 0).toLocaleString()}
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-2">
            <PieChart className="w-8 h-8" />
            <span className="text-sm opacity-80">支出项数</span>
          </div>
          <div className="text-3xl font-bold">{expenses.length}</div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">费用明细</h3>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
          >
            <Plus className="w-4 h-4" />
            <span>添加</span>
          </button>
        </div>

        {showAddForm && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">类别</label>
              <select
                value={newExpense.category}
                onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">金额</label>
              <input
                type="number"
                value={newExpense.amount}
                onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">描述</label>
              <input
                type="text"
                value={newExpense.description}
                onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                placeholder="费用描述"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">分摊人员</label>
              <div className="flex flex-wrap gap-2">
                {people.map(person => (
                  <button
                    key={person}
                    onClick={() => togglePersonSplit(person)}
                    className={`px-4 py-2 rounded-lg transition ${
                      newExpense.splitWith.includes(person)
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    <Users className="w-4 h-4 inline mr-1" />
                    {person}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={addExpense}
              className="w-full py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition font-medium"
            >
              确认添加
            </button>
          </div>
        )}

        <div className="space-y-3">
          {expenses.map(expense => (
            <div
              key={expense.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    expense.category === '交通' ? 'bg-blue-100 text-blue-700' :
                    expense.category === '住宿' ? 'bg-purple-100 text-purple-700' :
                    expense.category === '餐饮' ? 'bg-orange-100 text-orange-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {expense.category}
                  </span>
                  <span className="font-semibold text-gray-800">{expense.description}</span>
                </div>
                <div className="text-sm text-gray-500">
                  分摊: {expense.splitWith.join(', ')} | 
                  每人: ¥{(expense.amount / expense.splitWith.length).toFixed(2)}
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <span className="text-xl font-bold text-gray-800">¥{expense.amount.toLocaleString()}</span>
                <button
                  onClick={() => removeExpense(expense.id)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">分类统计</h3>
        <div className="space-y-4">
          {Object.entries(categoryTotals).map(([category, amount]) => (
            <div key={category}>
              <div className="flex justify-between mb-1">
                <span className="font-medium text-gray-700">{category}</span>
                <span className="font-bold text-gray-800">¥{amount.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-gradient-to-r from-blue-400 to-blue-600 h-3 rounded-full transition-all"
                  style={{ width: `${(amount / calculateTotal()) * 100}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-bold text-gray-800 mb-6">人均分摊</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {Object.entries(splits).map(([person, amount]) => (
            <div
              key={person}
              className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-4 text-center"
            >
              <div className="flex items-center justify-center mb-2">
                <Users className="w-6 h-6 text-blue-500" />
              </div>
              <div className="text-2xl font-bold text-gray-800">{person}</div>
              <div className="text-lg font-semibold text-blue-600">
                ¥{amount.toFixed(2)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
