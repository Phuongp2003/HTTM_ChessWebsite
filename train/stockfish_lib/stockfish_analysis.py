from stockfish_integration.stockfish_interface import get_best_move


def analyze_game(game):
    training_data = []
    try:
        board = game.board()  # Lấy đối tượng board từ game

        # Lặp qua tất cả các nước đi trong ván cờ
        for move in game.mainline_moves():
            board.push(move)  # Thực hiện nước đi
            fen = board.fen()  # Lấy FEN hiện tại
            best_move = get_best_move(fen)  # Lấy nước đi tốt nhất từ Stockfish
            print(fen, best_move)

            # Thêm kết quả phân tích vào training_data
            training_data.append({
                'FEN': fen,
                'Best Move': best_move,
            })
        
    except Exception as e:
        print(f"Error analyzing game: {e}")

    return training_data
