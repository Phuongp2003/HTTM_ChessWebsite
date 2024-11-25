import time
from stockfish import Stockfish
import os

# Đường dẫn đến file thực thi Stockfish
stockfish_path = "stockfish/stockfish-windows-x86-64-sse41-popcnt.exe"

if not os.path.exists(stockfish_path):
    raise FileNotFoundError(
        f"Stockfish executable not found at {stockfish_path}"
    )

# Khởi tạo Stockfish
stockfish = Stockfish(stockfish_path)

def set_fen_position(fen):
    """Thiết lập vị trí FEN trong Stockfish"""
    stockfish.set_fen_position(fen)

def get_best_move(fen):
    """Lấy nước đi tốt nhất từ Stockfish"""
    global stockfish
    try:
        stockfish.set_fen_position(fen)
        stockfish.set_depth(1)
        return stockfish.get_best_move_time(500)
    except Exception as e:
        print(f"Error: {e}")
        for attempt in range(5):
            print(f"Attempt {attempt + 1}: Resetting Stockfish")
            try:
                stockfish = Stockfish(stockfish_path)
                stockfish.set_fen_position(fen)
                stockfish.set_depth(1)
                res = stockfish.get_best_move_time(500)
                print(f"Attempt {attempt + 1} success")
                return res
            except Exception as retry_error:
                print(f"Retry {attempt + 1} failed: {retry_error}")
                time.sleep(2)
        print("All attempts to reset Stockfish failed. Exiting.")
        exit(1)

def get_best_moves(fen, count=5):
    """Lấy danh sách nước đi tốt nhất từ Stockfish"""
    try:
        set_fen_position(fen)
        return stockfish.get_top_moves(count)
    except Exception as e:
        print(f"Error: {e}")
        for rt in range(10):
            stockfish = Stockfish(stockfish_path)
            time.sleep(2)
        exit()
        raise
    
def get_score(fen):
    """Lấy điểm số từ Stockfish"""
    global stockfish
    try:
        set_fen_position(fen)
        score = stockfish.get_evaluation()
        return score
    except Exception as e:
        print(f"Error: {e}")
        for rt in range(10):
            try:
                stockfish = Stockfish(stockfish_path)
                set_fen_position(fen)
                score = stockfish.get_evaluation()
                return score
            except Exception as retry_error:
                print(f"Retry {rt + 1} failed: {retry_error}")
                time.sleep(2)
        print("All attempts to reset Stockfish failed. Exiting.")
        exit(1)
# Đảm bảo đóng Stockfish khi hoàn tất (không cần gọi trực tiếp vì thư viện tự quản lý)
