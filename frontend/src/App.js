import React, { useState } from 'react';
import axios from 'axios';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Main from './components/Main';

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processedImageUrl, setProcessedImageUrl] = useState(null);
  const [currentImage, setCurrentImage] = useState(null);
  const [originalImage, setOriginalImage] = useState(null);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
        setCurrentImage(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!selectedFile) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('image', selectedFile);

    try {
      console.log('배경 제거 요청 시작:', selectedFile.name);
      const response = await axios.post('/api/remove-bg', formData, {
        responseType: 'blob',
        timeout: 300000, // 5분 타임아웃
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          console.log(`업로드 진행률: ${percentCompleted}%`);
        }
      });

      console.log('배경 제거 응답 수신');
      const url = window.URL.createObjectURL(new Blob([response.data]));
      setProcessedImageUrl(url);
      
      const processedFile = new File([response.data], 'processed.png', { type: 'image/png' });
      setCurrentImage(processedFile);
      
      // 원본 이미지 저장
      if (!originalImage) {
        setOriginalImage(selectedFile);
      }
    } catch (error) {
      console.error('상세 오류:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        headers: error.response?.headers
      });
      
      let errorMessage = '배경 제거 중 오류가 발생했습니다.';
      if (error.response) {
        errorMessage += `\n상태 코드: ${error.response.status}`;
        if (error.response.data) {
          try {
            const errorText = await error.response.data.text();
            errorMessage += `\n서버 응답: ${errorText}`;
          } catch (e) {
            errorMessage += '\n서버 응답을 읽을 수 없습니다.';
          }
        }
      } else if (error.request) {
        errorMessage += '\n서버에 연결할 수 없습니다.';
      } else {
        errorMessage += `\n${error.message}`;
      }
      alert(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const applyEffect = async (effectType, effectValue) => {
    if (!currentImage) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('image', currentImage);
    formData.append('effect_type', effectType);
    formData.append('effect_value', effectValue);

    try {
      const response = await axios.post('/api/apply-effect', formData, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      setProcessedImageUrl(url);
      setCurrentImage(new File([response.data], 'processed.png', { type: 'image/png' }));
    } catch (error) {
      console.error('Error:', error);
      alert('효과 적용 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-white">
      <Header />
      <Main 
        previewUrl={previewUrl}
        handleFileSelect={handleFileSelect}
        processedImageUrl={processedImageUrl}
        isLoading={isLoading}
        handleSubmit={handleSubmit}
        setSelectedFile={setSelectedFile}
        setPreviewUrl={setPreviewUrl}
        setProcessedImageUrl={setProcessedImageUrl}
        setCurrentImage={setCurrentImage}
        currentImage={currentImage}
        applyEffect={applyEffect}
      />
      <Footer />
    </div>
  );
}

export default App; 