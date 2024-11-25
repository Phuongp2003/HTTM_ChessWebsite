import tensorflow as tf
from sklearn.model_selection import train_test_split
import numpy as np
import json
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
from tensorflow.keras.layers import Dropout
import tensorflowjs as tfjs

# Load dữ liệu
with open('chess_data.json', 'r') as f:
    data = json.load(f)

# Chuyển dữ liệu thành đầu vào và đầu ra
X = [f"{item['fen']} {item['move']}" for item in data]
y = [item['intent'] for item in data]

# Encode nhãn
label_map = {label: idx for idx, label in enumerate(set(y))}
y_encoded = np.array([label_map[label] for label in y])

# Tokenizer
tokenizer = tf.keras.preprocessing.text.Tokenizer()
tokenizer.fit_on_texts(X)
X_seq = tokenizer.texts_to_sequences(X)
X_padded = tf.keras.preprocessing.sequence.pad_sequences(X_seq, padding='post')

# Chia tập dữ liệu
X_train, X_test, y_train, y_test = train_test_split(X_padded, y_encoded, test_size=0.2, random_state=42)

# Load MobileNetV3Large model
base_model = tf.keras.applications.MobileNetV3Large(input_shape=(224, 224, 3), weights='imagenet', classifier_activation='softmax')

base_model.save('chess_intent_model_mobilenetv3large.h5')
with open('tokenizer.json', 'w') as f:
    json.dump(tokenizer.to_json(), f)
with open('label_map.json', 'w') as f:
    json.dump(label_map, f)
tfjs.converters.save_keras_model(base_model, "model")
