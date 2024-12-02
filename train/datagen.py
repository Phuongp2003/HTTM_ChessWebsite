import chess
import random
import json
from stockfish_lib.stockfish_lib import get_best_move, get_score

# Hàm chuẩn bị các đặc trưng từ FEN và nước đi
def create_sample(fen):
    print('\n-> ', fen)
    board = chess.Board(fen)
    legal_moves = list(board.legal_moves)
    if not legal_moves:
        return None
    
    move = random.choice(legal_moves)
    board.push(move)

    # Lấy nước đi tốt nhất và điểm số từ Stockfish
    best_move = get_best_move(fen)
    score = get_score(fen)
    # Xác định intent dựa trên điểm số
    intent = "tấn công" if score['value'] > 0 else "phòng thủ" if score['value'] < 0 else "khác"

    # Tạo mẫu JSON
    sample = {
        "fen": fen,
        "move": best_move,
        "intent": intent
    }

    return sample

# Hàm tạo bộ dữ liệu mẫu
def generate_samples(num_samples):
    data = []
    for _ in range(num_samples):
        board = chess.Board()
        for _ in range(random.randint(1, 15)):  # Tiến hành 1-15 nước đi ngẫu nhiên
            if board.is_game_over():
                break
            move = random.choice(list(board.legal_moves))
            board.push(move)
        
        # Tạo mẫu cho mỗi FEN
        fen = board.fen()
        sample = create_sample(fen)
        if sample:
            data.append(sample)

    return data

# Tạo dữ liệu và lưu vào file JSON
num_samples = 7000
data = generate_samples(num_samples)

# Lưu dữ liệu vào file JSON
with open('chess_data2.json', 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=4)

print(f"Generated {len(data)} samples")
