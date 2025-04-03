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
      const response = await axios.post('http://localhost:5000/remove-bg', formData, {
        responseType: 'blob'
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      setProcessedImageUrl(url);
      
      // 배경 제거된 이미지를 파일로 저장
      const processedFile = new File([response.data], 'processed.png', { type: 'image/png' });
      setCurrentImage(processedFile);
      
      // 원본 이미지 저장
      if (!originalImage) {
        setOriginalImage(selectedFile);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('배경 제거 중 오류가 발생했습니다.');
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
      const response = await axios.post('http://localhost:5000/apply-effect', formData, {
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