import React from 'react';

const RecentOrdersTable = () => {
  const orders = [
    {
      customer: 'محمد أحمد',
      phone: '+966 500000000',
      total: '$120.00',
      city: 'الرياض',
      date: '2025-02-15',
      status: 'قيد المعالجة',
      statusColor: 'bg-yellow-400',
    },
    {
      customer: 'سارة خالد',
      phone: '+966 511111111',
      total: '$75.50',
      city: 'جدة',
      date: '2025-02-14',
      status: 'تم التوصيل',
      statusColor: 'bg-green-500',
    },
  ];

  return (
    <div className="bg-white rounded-lg shadow">
      <h2 className="p-4 text-xl font-bold text-gray-800">الطلبات الأخيرة</h2>
      <div className="overflow-x-auto">
        <table className="w-full border-collapse text-right">
          <thead>
            <tr className="bg-gray-200">
              <th className="p-3 border-b whitespace-nowrap">اسم العميل</th>
              <th className="p-3 border-b whitespace-nowrap">رقم الهاتف</th>
              <th className="p-3 border-b whitespace-nowrap">إجمالي الطلب</th>
              <th className="p-3 border-b whitespace-nowrap">المدينة</th>
              <th className="p-3 border-b whitespace-nowrap">التاريخ</th>
              <th className="p-3 border-b whitespace-nowrap">حالة الطلب</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index} className="hover:bg-gray-50">
                <td className="p-3 border-b whitespace-nowrap">{order.customer}</td>
                <td className="p-3 border-b whitespace-nowrap">{order.phone}</td>
                <td className="p-3 border-b whitespace-nowrap">{order.total}</td>
                <td className="p-3 border-b whitespace-nowrap">{order.city}</td>
                <td className="p-3 border-b whitespace-nowrap">{order.date}</td>
                <td className="p-3 border-b whitespace-nowrap">
                  <span className={`${order.statusColor} text-white px-2 py-1 rounded-lg`}>
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentOrdersTable;