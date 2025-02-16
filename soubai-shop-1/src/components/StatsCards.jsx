import React from 'react';

const StatsCards = () => {
  const stats = [
    {
      title: 'إجمالي الطلبات',
      value: '120',
      icon: 'fa-shopping-cart',
      bgColor: 'bg-yellow-400',
    },
    {
      title: 'إجمالي الإيرادات',
      value: '$5,000',
      icon: 'fa-dollar-sign',
      bgColor: 'bg-green-500',
    },
    {
      title: 'إجمالي العملاء',
      value: '85',
      icon: 'fa-users',
      bgColor: 'bg-blue-500',
    },
    {
      title: 'الطلبات المعلقة',
      value: '12',
      icon: 'fa-exclamation-circle',
      bgColor: 'bg-red-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {stats.map((stat, index) => (
        <div key={index} className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500">{stat.title}</p>
              <p className="text-2xl font-bold">{stat.value}</p>
            </div>
            <div className={`${stat.bgColor} py-1.5 px-2 rounded-full`}>
              <i className={`fas ${stat.icon} text-white`}></i>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default StatsCards;