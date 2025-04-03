from flask import Flask, request, send_file
from flask_cors import CORS
from rembg import remove
from PIL import Image, ImageFilter, ImageEnhance, ImageOps
import io
import os

app = Flask(__name__)
CORS(app)

@app.route('/remove-bg', methods=['POST'])
def remove_background():
    if 'image' not in request.files:
        return {'error': '이미지 파일이 없습니다.'}, 400
    
    file = request.files['image']
    if file.filename == '':
        return {'error': '선택된 파일이 없습니다.'}, 400
    
    # 이미지 읽기
    input_image = Image.open(file.stream)
    
    # 배경 제거
    output_image = remove(input_image)
    
    # 이미지를 바이트로 변환
    img_byte_arr = io.BytesIO()
    output_image.save(img_byte_arr, format='PNG')
    img_byte_arr.seek(0)
    
    return send_file(
        img_byte_arr,
        mimetype='image/png'
    )

@app.route('/apply-effect', methods=['POST'])
def apply_effect():
    if 'image' not in request.files:
        return {'error': '이미지 파일이 없습니다.'}, 400
    
    file = request.files['image']
    effect_type = request.form.get('effect_type', '')
    effect_value = float(request.form.get('effect_value', 1.0))
    
    if file.filename == '':
        return {'error': '선택된 파일이 없습니다.'}, 400
    
    # 이미지 읽기
    image = Image.open(file.stream)
    
    # 효과 적용
    if effect_type == 'blur':
        processed_image = image.filter(ImageFilter.GaussianBlur(radius=effect_value))
    elif effect_type == 'sharpness':
        enhancer = ImageEnhance.Sharpness(image)
        processed_image = enhancer.enhance(effect_value)
    elif effect_type == 'brightness':
        enhancer = ImageEnhance.Brightness(image)
        processed_image = enhancer.enhance(effect_value)
    elif effect_type == 'contrast':
        enhancer = ImageEnhance.Contrast(image)
        processed_image = enhancer.enhance(effect_value)
    elif effect_type == 'saturation':
        enhancer = ImageEnhance.Color(image)
        processed_image = enhancer.enhance(effect_value)
    elif effect_type == 'grayscale':
        processed_image = ImageOps.grayscale(image)
        # grayscale 이미지를 RGB로 변환하여 일관성 유지
        processed_image = Image.merge('RGB', [processed_image, processed_image, processed_image])
    else:
        return {'error': '지원하지 않는 효과입니다.'}, 400
    
    # 이미지를 바이트로 변환
    img_byte_arr = io.BytesIO()
    processed_image.save(img_byte_arr, format='PNG')
    img_byte_arr.seek(0)
    
    return send_file(
        img_byte_arr,
        mimetype='image/png',
        as_attachment=True,
        download_name='processed_image.png'
    )

if __name__ == '__main__':
    app.run(debug=True, port=5000) 