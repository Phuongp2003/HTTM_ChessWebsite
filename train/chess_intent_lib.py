import tensorflow as tf
import numpy as np
import json

# Load the saved model and tokenizer
model = tf.keras.models.load_model('chess_intent_model.h5')

with open('tokenizer.json', 'r') as f:
    tokenizer_data = json.load(f)
tokenizer = tf.keras.preprocessing.text.tokenizer_from_json(tokenizer_data)

with open('label_map.json', 'r') as f:
    label_map = json.load(f)
reverse_label_map = {v: k for k, v in label_map.items()}

# Determine the correct padding length
with open('chess_data.json', 'r') as f:
    data = json.load(f)
X = [f"{item['fen']} {item['move']}" for item in data]
tokenizer.fit_on_texts(X)
X_seq = tokenizer.texts_to_sequences(X)
X_padded = tf.keras.preprocessing.sequence.pad_sequences(X_seq, padding='post')
padding_length = X_padded.shape[1]

def preprocess_input(fen_strings):
    sequences = tokenizer.texts_to_sequences(fen_strings)
    padded_sequences = tf.keras.preprocessing.sequence.pad_sequences(sequences, padding='post', maxlen=padding_length)
    return padded_sequences

def predict_intent(fen_strings):
    preprocessed_input = preprocess_input(fen_strings)
    predictions = model.predict(preprocessed_input)
    predicted_labels = np.argmax(predictions, axis=1)
    intents = [reverse_label_map[label] for label in predicted_labels]
    return intents
