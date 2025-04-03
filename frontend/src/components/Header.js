import React from 'react';

function Header() {
  return (
    <nav className="bg-white border-b border-gray-200 h-16">
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-full items-center">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-xl font-bold text-gray-800">remove background</span>
            </div>
            <div className="hidden md:block ml-10">
              <div className="flex space-x-4">
                <button className="text-gray-900 px-3 py-2 text-sm font-medium">배경 제거</button>
                <button className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">기능</button>
                <button className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">비즈니스용</button>
                <button className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">가격</button>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">로그인</button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">가입</button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Header; 