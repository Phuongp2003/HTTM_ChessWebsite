import tensorflow as tf
from sklearn.model_selection import train_test_split, StratifiedKFold
import numpy as np
import json
from tensorflow.keras.callbacks import EarlyStopping, ReduceLROnPlateau
from tensorflow.keras.layers import Dropout

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

# Calculate batch size for approximately 3000 steps per epoch
batch_size = len(X_train) // 586

# Cross-validation
kfold = StratifiedKFold(n_splits=10, shuffle=True, random_state=42)
best_accuracy = 0
best_model = None

for train_index, val_index in kfold.split(X_train, y_train):
    X_train_fold, X_val_fold = X_train[train_index], X_train[val_index]
    y_train_fold, y_val_fold = y_train[train_index], y_train[val_index]

    # Mô hình tối ưu
    model = tf.keras.Sequential([
        tf.keras.layers.Embedding(input_dim=len(tokenizer.word_index) + 1, output_dim=256, input_length=X_padded.shape[1]),
        tf.keras.layers.Conv1D(filters=128, kernel_size=5, activation='relu'),
        tf.keras.layers.MaxPooling1D(pool_size=2),
        Dropout(0.5),
        tf.keras.layers.LSTM(128, return_sequences=True),
        Dropout(0.5),
        tf.keras.layers.LSTM(64),
        Dropout(0.5),
        tf.keras.layers.Dense(128, activation='relu'),
        Dropout(0.5),
        tf.keras.layers.Dense(64, activation='relu'),
        tf.keras.layers.Dense(len(label_map), activation='softmax')
    ])

    model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
                  loss='sparse_categorical_crossentropy', 
                  metrics=['accuracy'])

    # Các callback để tối ưu hóa quá trình huấn luyện
    early_stopping = EarlyStopping(monitor='val_loss', patience=5, restore_best_weights=True)
    lr_scheduler = ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=3, min_lr=0.00001)

    # Huấn luyện mô hình
    model.fit(X_train_fold, y_train_fold, epochs=100, batch_size=batch_size, validation_data=(X_val_fold, y_val_fold),
              callbacks=[early_stopping, lr_scheduler])

    # Đánh giá mô hình
    loss, accuracy = model.evaluate(X_val_fold, y_val_fold)
    print(f"Validation accuracy: {accuracy * 100:.2f}%")

    if accuracy > best_accuracy:
        best_accuracy = accuracy
        best_model = model

# Đánh giá mô hình trên tập test
loss, accuracy = best_model.evaluate(X_test, y_test)
print(f"Test accuracy: {accuracy * 100:.2f}%")

# Lưu mô hình và tokenizer
best_model.save('chess_intent_model.h5')
with open('chess_intent_model.json', 'w') as json_file:
    json_file.write(best_model.to_json())
with open('tokenizer.json', 'w') as f:
    json.dump(tokenizer.to_json(), f)
with open('label_map.json', 'w') as f:
    json.dump(label_map, f)
