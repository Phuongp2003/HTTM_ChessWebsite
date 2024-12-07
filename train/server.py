from flask import Flask, request, jsonify
from stockfish_lib.stockfish_lib import set_fen_position, get_best_move, get_best_moves, get_score, set_elo
from chess_intent_lib import predict_intent
import chess
import chess.engine

app = Flask(__name__)

@app.route('/check', methods=['POST'])
def check():
    data = request.json
    move = data.get('move')
    fen = data.get('fen')
    elo = data.get('elo')
    elo_multiple = data.get('eloMultiple')

    if not move or not fen or not elo:
        return jsonify({'error': 'Move, FEN, and ELO are required'}), 400

    adjusted_elo = round(elo * elo_multiple)
    set_elo(adjusted_elo)
    set_fen_position(fen)
    
    # Use python-chess to make the move and get the new FEN
    board = chess.Board(fen)
    board.push_uci(move)
    new_fen = board.fen()
    
    intent = predict_intent([f"{fen} {move}"])[0]

    set_fen_position(new_fen)
    top_moves = get_best_moves(new_fen, 5)
    risks = []
    for top_move in top_moves:
        risk_fen = f"{new_fen} {top_move['Move']}"
        risk_intent = predict_intent([risk_fen])[0]
        risks.append({'move': top_move['Move'], 'intent': risk_intent, 'fen': risk_fen})

    return jsonify({'intent': intent, 'risks': risks})

@app.route('/ghelp', methods=['POST'])
def ghelp():
    data = request.json
    fen = data.get('fen')
    elo = data.get('elo')
    elo_multiple = data.get('eloMultiple')
    intent = data.get('intent')
    if not fen or not elo or not intent:
        return jsonify({'error': 'FEN, ELO, and intent are required'}), 400

    adjusted_elo = round(elo * elo_multiple)
    set_elo(adjusted_elo)
    set_fen_position(fen)
    top_moves = get_best_moves(fen, 10)
    move_intents = [{'move': move['Move'], 'intent': predict_intent([f"{fen} {move['Move']}"])[0]} for move in top_moves]

    correct_moves = [m for m in move_intents if m['intent'] == intent]
    incorrect_moves = [m for m in move_intents if m['intent'] != intent]

    selected_moves = [move_intents[0]] + correct_moves[:4]
    if len(selected_moves) < 5:
        selected_moves += incorrect_moves[:5 - len(selected_moves)]

    results = []
    for m in selected_moves:
        new_fen = f"{fen} {m['move']}"
        set_fen_position(new_fen)
        risk_moves = get_best_moves(new_fen, 3)
        risks = [{'move': risk_move['Move'], 'intent': predict_intent([f"{new_fen} {risk_move['Move']}"])[0]} for risk_move in risk_moves]
        results.append({'move': m['move'], 'intent': m['intent'], 'risks': risks})

    score = (len(correct_moves) / len(top_moves)) * 100
    return jsonify({'score': score, 'moves': results})


if __name__ == '__main__':
    app.run(port=5000)
