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

# Function to preprocess input FEN strings
def preprocess_input(fen_strings):
    sequences = tokenizer.texts_to_sequences(fen_strings)
    padded_sequences = tf.keras.preprocessing.sequence.pad_sequences(sequences, padding='post', maxlen=padding_length)
    return padded_sequences

# Function to predict the intent using the model
def predict_intent(fen_strings):
    preprocessed_input = preprocess_input(fen_strings)
    predictions = model.predict(preprocessed_input)
    predicted_labels = np.argmax(predictions, axis=1)
    intents = [reverse_label_map[label] for label in predicted_labels]
    return intents

# Test the model using a few FEN strings
test_fen_strings = [
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1 e2e4",
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1 d2d4",
    "8/8/8/k7/1b6/1p6/8/3RK3 b KQkq - 0 1 d1d2",
    "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1 g1f3"
]

print("Testing with custom FEN strings:")
for fen in test_fen_strings:
    intent = predict_intent([fen])
    print(f"FEN: {fen} -> Intent: {intent[0]}")

# Test the model using the dataset
test_data = data[:10]  # Use the first 10 samples for testing
test_fen_strings = [f"{item['fen']} {item['move']}" for item in test_data]
test_intents = [item['intent'] for item in test_data]

print("\nTesting with dataset samples:")
for fen, true_intent in zip(test_fen_strings, test_intents):
    predicted_intent = predict_intent([fen])
    print(f"FEN: {fen} -> Predicted Intent: {predicted_intent[0]}, True Intent: {true_intent}")
