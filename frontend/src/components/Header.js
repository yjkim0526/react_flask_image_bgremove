import React from 'react';
import { GiPear } from 'react-icons/gi';

function Header() {
  return (
    <nav className="bg-white border-b border-gray-200 h-16">
      <div className="h-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-full items-center">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <div className="relative">
                <GiPear className="h-8 w-8 text-gray-800" />
              </div>
              <span className="text-xl font-bold text-gray-800">Remove Background Image</span>
            </div>
            <div className="hidden md:block ml-10">
              {/* <div className="flex space-x-4">
                <button className="text-white px-3 py-2 text-sm font-medium">배경 제거</button>
                <button className="text-white px-3 py-2 text-sm font-medium"> 작업</button>
              </div> */}
            </div>
          </div>
          {/* <div className="flex items-center space-x-4">
            <button className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium">로그인</button>
            <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700">가입</button>
          </div> */}
        </div>
      </div>
    </nav>
  );
}

export default Header; 