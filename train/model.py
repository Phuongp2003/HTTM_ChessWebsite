import tensorflow as tf
from tensorflow.keras.preprocessing import image
import numpy as np

# Load mô hình
model = tf.keras.models.load_model('chess_piece_model.h5')

def predict_chess_piece(image_path):
    # Preprocess ảnh
    img = image.load_img(image_path, target_size=(150, 150))
    img_array = image.img_to_array(img) / 255.0  # Chuẩn hóa
    img_array = np.expand_dims(img_array, axis=0)  # Thêm chiều batch

    # Dự đoán
    predictions = model.predict(img_array)
    class_idx = np.argmax(predictions[0])  # Lấy chỉ số lớp có xác suất cao nhất
    return class_idx
