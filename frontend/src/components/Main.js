import React, { useCallback, useState, useEffect } from 'react';

function Main({ 
  previewUrl, 
  handleFileSelect, 
  processedImageUrl, 
  isLoading, 
  handleSubmit, 
  setSelectedFile, 
  setPreviewUrl, 
  setProcessedImageUrl, 
  setCurrentImage,
  currentImage,
  applyEffect 
}) {
  // 원본 이미지 저장
  const [originalImage, setOriginalImage] = useState(null);
  const [removedBgImage, setRemovedBgImage] = useState(null);
  const [lastEffectImage, setLastEffectImage] = useState(null);

  // 이미지가 처리될 때마다 원본 이미지 저장
  useEffect(() => {
    if (currentImage && !originalImage) {
      setOriginalImage(currentImage);
    }
  }, [currentImage, originalImage]);

  // 배경 제거된 이미지 저장
  useEffect(() => {
    if (processedImageUrl) {
      fetch(processedImageUrl)
        .then(res => res.blob())
        .then(blob => {
          const removedBgFile = new File([blob], 'removed-bg.png', { type: 'image/png' });
          setRemovedBgImage(removedBgFile);
          console.log('배경 제거된 이미지 저장됨:', removedBgFile);
        })
        .catch(error => {
          console.error('배경 제거된 이미지 저장 중 오류:', error);
        });
    }
  }, [processedImageUrl]);

  // 효과 적용 전 이미지 저장
  useEffect(() => {
    if (currentImage) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const blob = new Blob([currentImage], { type: currentImage.type });
        setLastEffectImage(new File([blob], 'last-effect.png', { type: 'image/png' }));
      };
      reader.readAsArrayBuffer(currentImage);
    }
  }, [currentImage]);

  // 효과 적용 함수
  const handleEffectClick = useCallback((effectType) => {
    if (!currentImage) return;
    
    // 효과 적용 전 현재 상태 저장
    const reader = new FileReader();
    reader.onloadend = () => {
      const blob = new Blob([currentImage], { type: currentImage.type });
      setLastEffectImage(new File([blob], 'last-effect.png', { type: 'image/png' }));
    };
    reader.readAsArrayBuffer(currentImage);
    
    // 효과 타입에 따라 다른 강도 적용
    const effectValues = {
      'brightness': 1.2,
      'contrast': 1.3,
      'saturation': 1.4,
      'grayscale': 1.0,
      'blur': 2.0,
      'sharpness': 2.0
    };
    applyEffect(effectType, effectValues[effectType]);
  }, [currentImage, applyEffect]);

  // 복원 함수
  const handleRestore = useCallback(() => {
    console.log('복원 버튼 클릭됨', { removedBgImage, currentImage });
    if (removedBgImage) {
      console.log('removedBgImage 사용');
      setCurrentImage(removedBgImage);
      const url = URL.createObjectURL(removedBgImage);
      setProcessedImageUrl(url);
    } else {
      console.log('복원할 이미지가 없습니다');
    }
  }, [removedBgImage, setCurrentImage, setProcessedImageUrl]);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      handleFileSelect({ target: { files: [file] } });
    }
  }, [handleFileSelect]);

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  return (
    <main className="flex-1 overflow-y-auto flex items-center justify-center">
      <div className="max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-4">
        {/* 이미지와 효과 버튼을 감싸는 컨테이너 */}
        <div className="flex flex-col lg:flex-row gap-4 max-w-5xl mx-auto">
          {/* 이미지 영역들을 감싸는 flex 컨테이너 */}
          <div className="flex flex-col lg:flex-row gap-4 flex-1">
            {/* 왼쪽 이미지 영역과 새 이미지 버튼 */}
            <div className="flex flex-col gap-2 w-full lg:w-1/2">
              {!previewUrl ? (
                <>
                  <div 
                    className="w-full h-[400px] bg-gray-50 rounded-lg relative flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors"
                    onClick={() => document.getElementById('fileInput').click()}
                    onDrop={handleDrop}
                    onDragOver={handleDragOver}
                  >
                    <div className="flex flex-col items-center justify-center p-4">
                      <svg className="w-12 h-12 lg:w-16 lg:h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      <span className="text-base lg:text-lg font-medium text-gray-900">웹이미지 업로드</span>
                      <span className="text-xs lg:text-sm text-gray-500 mt-2">또는 파일을 여기로 드래그하세요</span>
                      <input 
                        id="fileInput"
                        type="file" 
                        className="hidden" 
                        accept="image/*" 
                        onChange={handleFileSelect} 
                      />
                    </div>
                  </div>
                  <div className="flex justify-center mt-2">
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-lg flex items-center gap-2"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                        setProcessedImageUrl(null);
                        setCurrentImage(null);
                        setOriginalImage(null);
                        setRemovedBgImage(null);
                        setLastEffectImage(null);
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      새 이미지
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-full h-[400px] bg-gray-50 rounded-lg relative">
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <img
                        src={previewUrl}
                        alt="원본 이미지"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-white/80 backdrop-blur-sm text-sm px-3 py-1 rounded-full">
                        원본
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-center mt-2">
                    <button
                      type="button"
                      className="px-4 py-2 text-sm font-medium text-white bg-gray-600 hover:bg-gray-700 rounded-lg flex items-center gap-2"
                      onClick={() => {
                        setSelectedFile(null);
                        setPreviewUrl(null);
                        setProcessedImageUrl(null);
                        setCurrentImage(null);
                        setOriginalImage(null);
                        setRemovedBgImage(null);
                        setLastEffectImage(null);
                      }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
                      </svg>
                      새 이미지
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* 오른쪽 이미지 영역 */}
            <div className="w-full lg:w-1/2">
              <div className="w-full h-[400px] bg-gray-50 rounded-lg relative">
                {isLoading ? (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-gray-500">이미지 처리 중...</div>
                  </div>
                ) : processedImageUrl ? (
                  <>
                    <div className="absolute inset-0 flex items-center justify-center p-4">
                      <img
                        src={processedImageUrl}
                        alt="처리된 이미지"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="absolute top-4 left-4 z-10">
                      <span className="bg-white/80 backdrop-blur-sm text-sm px-3 py-1 rounded-full">
                        결과
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-gray-500">
                      처리된 이미지가 여기에 표시됩니다
                    </div>
                  </div>
                )}
              </div>
              <div className="flex justify-center gap-2 mt-2">
                <button
                  onClick={handleSubmit}
                  disabled={isLoading || !currentImage}
                  className={`px-4 py-2 text-sm font-medium rounded-lg flex items-center gap-2 ${
                    !currentImage || isLoading
                      ? 'text-gray-500 bg-gray-100 cursor-not-allowed'
                      : 'text-white bg-blue-600 hover:bg-blue-700'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                  </svg>
                  배경 제거
                </button>
                {processedImageUrl && (
                  <a
                    href={processedImageUrl}
                    download="processed_image.png"
                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 hover:bg-green-700 rounded-lg flex items-center gap-2"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                    다운로드
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* 오른쪽 효과 버튼 영역 */}
          <div className="flex flex-wrap lg:flex-col justify-center gap-2 lg:w-20 py-2">
            <button
              onClick={() => handleEffectClick('blur')}
              disabled={isLoading || !currentImage}
              className={`min-w-[60px] px-2 py-1 text-xs rounded-md border flex items-center justify-center gap-1 ${
                !currentImage || isLoading
                  ? 'text-gray-500 bg-gray-100 border-gray-300 cursor-not-allowed'
                  : 'text-gray-700 hover:text-gray-900 bg-gray-50 border-gray-300 hover:bg-gray-100'
              }`}
              title="블러"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              <span>블러</span>
            </button>

            <button
              onClick={() => handleEffectClick('sharpness')}
              disabled={isLoading || !currentImage}
              className={`min-w-[60px] px-2 py-1 text-xs rounded-md border flex items-center justify-center gap-1 ${
                !currentImage || isLoading
                  ? 'text-gray-500 bg-gray-100 border-gray-300 cursor-not-allowed'
                  : 'text-gray-700 hover:text-gray-900 bg-gray-50 border-gray-300 hover:bg-gray-100'
              }`}
              title="선명도"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span>선명</span>
            </button>

            <button
              onClick={() => handleEffectClick('brightness')}
              disabled={isLoading || !currentImage}
              className={`min-w-[60px] px-2 py-1 text-xs rounded-md border flex items-center justify-center gap-1 ${
                !currentImage || isLoading
                  ? 'text-gray-500 bg-gray-100 border-gray-300 cursor-not-allowed'
                  : 'text-gray-700 hover:text-gray-900 bg-gray-50 border-gray-300 hover:bg-gray-100'
              }`}
              title="밝기"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span>밝기</span>
            </button>

            <button
              onClick={() => handleEffectClick('contrast')}
              disabled={isLoading || !currentImage}
              className={`min-w-[60px] px-2 py-1 text-xs rounded-md border flex items-center justify-center gap-1 ${
                !currentImage || isLoading
                  ? 'text-gray-500 bg-gray-100 border-gray-300 cursor-not-allowed'
                  : 'text-gray-700 hover:text-gray-900 bg-gray-50 border-gray-300 hover:bg-gray-100'
              }`}
              title="대비"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 12H4M12 4v16" />
              </svg>
              <span>대비</span>
            </button>

            <button
              onClick={() => handleEffectClick('saturation')}
              disabled={isLoading || !currentImage}
              className={`min-w-[60px] px-2 py-1 text-xs rounded-md border flex items-center justify-center gap-1 ${
                !currentImage || isLoading
                  ? 'text-gray-500 bg-gray-100 border-gray-300 cursor-not-allowed'
                  : 'text-gray-700 hover:text-gray-900 bg-gray-50 border-gray-300 hover:bg-gray-100'
              }`}
              title="채도"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
              </svg>
              <span>채도</span>
            </button>

            {/* <button
              onClick={() => handleEffectClick('grayscale')}
              disabled={isLoading || !currentImage}
              className={`min-w-[60px] px-2 py-1 text-xs rounded-md border flex items-center justify-center gap-1 ${
                !currentImage || isLoading
                  ? 'text-gray-500 bg-gray-100 border-gray-300 cursor-not-allowed'
                  : 'text-gray-700 hover:text-gray-900 bg-gray-50 border-gray-300 hover:bg-gray-100'
              }`}
              title="흑백"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="10" strokeWidth="2" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v8M8 12h8" />
              </svg>
              <span>흑백</span>
            </button> */}

            {/* <button
              onClick={handleRestore}
              disabled={isLoading || !removedBgImage}
              className={`min-w-[60px] px-2 py-1 text-xs rounded-md border flex items-center justify-center gap-1 ${
                !removedBgImage || isLoading
                  ? 'text-gray-500 bg-gray-100 border-gray-300 cursor-not-allowed'
                  : 'text-yellow-700 hover:text-yellow-800 bg-yellow-50 border-yellow-300 hover:bg-yellow-100'
              }`}
              title="복원"
            >
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>복원</span>
            </button> */}
          </div>
        </div>
      </div>
    </main>
  );
}

export default Main;