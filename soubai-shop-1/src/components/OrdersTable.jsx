import React from 'react';

const OrdersTable = () => {
  const orders = [
    {
      customer: 'محمد أحمد',
      phone: '+966 500000000',
      total: '$120.00',
      city: 'الرياض',
      date: '2025-02-15',
      status: 'قيد المعالجة',
    },
    {
      customer: 'سارة خالد',
      phone: '+966 511111111',
      total: '$75.50',
      city: 'جدة',
      date: '2025-02-14',
      status: 'تم التوصيل',
    },
  ];

  return (
    <div className="overflow-x-auto bg-white rounded-lg shadow">
      <table className="w-full border-collapse text-right">
        <thead>
          <tr className="bg-gray-200">
            <th className="p-3 border-b whitespace-nowrap">اسم العميل</th>
            <th className="p-3 border-b whitespace-nowrap">رقم الهاتف</th>
            <th className="p-3 border-b whitespace-nowrap">إجمالي الطلب</th>
            <th className="p-3 border-b whitespace-nowrap">المدينة</th>
            <th className="p-3 border-b whitespace-nowrap">التاريخ</th>
            <th className="p-3 border-b whitespace-nowrap">حالة الطلب</th>
            <th className="p-3 border-b whitespace-nowrap">الإجراءات</th>
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
                <select className="border p-1 rounded-lg bg-gray-100">
                  <option>قيد المعالجة</option>
                  <option>تم الشحن</option>
                  <option>تم التوصيل</option>
                  <option>ملغي</option>
                </select>
              </td>
              <td className="p-3 border-b text-center flex flex-row gap-2">
                <button className="bg-blue-500 text-white px-2 py-1 rounded-lg hover:bg-blue-600">
                  <i className="fas fa-edit"></i>
                </button>
                <button className="bg-red-500 text-white px-2 py-1 rounded-lg hover:bg-red-600">
                  <i className="fas fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;