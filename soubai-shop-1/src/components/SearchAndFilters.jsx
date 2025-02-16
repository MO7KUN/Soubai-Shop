import React from 'react';

const SearchAndFilters = () => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-2 max-w-screen">
      <div className="flex flex-row md:flex-row gap-1 w-full justify-between">
        {/* Search Bar */}
        <div className="w-auto">
          <input
            type="text"
            placeholder="ابحث عن طلب..."
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {/* City Filter */}
        <div className="w-full md:w-1/4">
          <select className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400">
            <option value="">جميع المدن</option>
            <option value="الرياض">الرياض</option>
            <option value="جدة">جدة</option>
            <option value="مكة">مكة</option>
            <option value="الدمام">الدمام</option>
          </select>
        </div>

        {/* Date Range Filter */}
        <div className="w-full md:w-1/4 flex gap-2">
          <input
            type="date"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="من تاريخ"
          />
          <input
            type="date"
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400"
            placeholder="إلى تاريخ"
          />
        </div>

        {/* Status Filter */}
        <div className="w-auto md:w-1/4">
          <select className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-400">
            <option value="">جميع الحالات</option>
            <option value="processing">قيد المعالجة</option>
            <option value="shipped">تم الشحن</option>
            <option value="delivered">تم التوصيل</option>
            <option value="cancelled">ملغي</option>
          </select>
        </div>
      </div>

      {/* Add New Order Button */}
      <button className="w-full md:w-auto bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 whitespace-nowrap">
        <i className="fas fa-plus"></i> إضافة طلب
      </button>
    </div>
  );
};

export default SearchAndFilters;