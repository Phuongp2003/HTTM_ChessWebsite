<script>
	import { TheChessboard } from 'vue3-chessboard';
	import 'vue3-chessboard/style.css';
	export default {
		components: {
			TheChessboard,
		},
		inject: ['startupFen'],
		data() {
			return {
				ready: false,
				boardConfig: {
					fen: 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1',
					orientation: 'white', // the orientation of the board
					highlight: {
						lastMove: false, // highlight the last move on the board
						check: false, // highlight king in check
					},
					movable: {
						free: true,
					},
					draggable: {
						showGhost: true,
						deleteOnDropOff: true,
					},
				},
				pieces: [
					{ key: 'wK', class: 'white king', piece: 'king' },
					{ key: 'wQ', class: 'white queen', piece: 'queen' },
					{ key: 'wR', class: 'white rook', piece: 'rook' },
					{ key: 'wB', class: 'white bishop', piece: 'bishop' },
					{ key: 'wN', class: 'white knight', piece: 'knight' },
					{ key: 'wP', class: 'white pawn', piece: 'pawn' },
					{ key: 'bK', class: 'black king', piece: 'king' },
					{ key: 'bQ', class: 'black queen', piece: 'queen' },
					{ key: 'bR', class: 'black rook', piece: 'rook' },
					{ key: 'bB', class: 'black bishop', piece: 'bishop' },
					{ key: 'bN', class: 'black knight', piece: 'knight' },
					{ key: 'bP', class: 'black pawn', piece: 'pawn' },
				],
				draggedPiece: null,
				boardAPI: null,
				fen: '',
				nextTurn: 'w',
				pgn: '',
			};
		},
		mounted() {
			setTimeout(() => {
				this.ready = true;
			}, 500);
		},
		methods: {
			handleDragStart(piece) {
				this.draggedPiece = piece;
			},
			handleDrop(event) {
				let boardElement = event.target;
				if (boardElement.tagName.toLowerCase() === 'piece') {
					boardElement = boardElement.parentElement;
				}
				const boardRect = boardElement.getBoundingClientRect();
				const squareSize = boardRect.width / 8;

				const x = event.clientX - boardRect.left;
				const y = event.clientY - boardRect.top;

				const col = Math.floor(x / squareSize);
				const row = 7 - Math.floor(y / squareSize);

				const targetSquare = String.fromCharCode(97 + col) + (row + 1);

				if (targetSquare && this.draggedPiece) {
					this.boardAPI.putPiece(
						{
							role: this.draggedPiece.piece,
							color: this.draggedPiece.key[0],
							type: this.draggedPiece.key[1].toLowerCase(),
						},
						targetSquare
					);
					this.draggedPiece = null;
				}
			},
			updateNextTurn() {
				const fenParts = this.fen.split(' ');
				this.nextTurn = fenParts[1];
			},
			updateFEN() {
				const fenParts = this.fen.split(' ');
				fenParts[1] = this.nextTurn;
				this.fen = fenParts.join(' ');
			},
			changeFEN() {
				this.boardConfig.fen = this.fen;
			},
			confirmFen() {
				this.startupFen = this.boardConfig.fen;
				this.$emit('done-setup');
			},
		},
	};
</script>

<template>
	<div class="input-fen flex flex-row w-full justify-evenly">
		<div class="board">
			<TheChessboard
				class="board shadow-md drop-shadow-sm shadow-slate-500"
				v-if="ready"
				:board-config="boardConfig"
				@drop="handleDrop"
				@dragover.prevent
				@board-created="(api) => (boardAPI = api)"
				reactive-config />

			<cg-board class="pieces relative">
				<div class="flex w-[601px] relative flex-wrap mx-auto">
					<piece
						v-for="piece in pieces"
						:key="piece.key"
						class="piece w-[100px] h-[75px] static bg-contain bg-center bg-no-repeat"
						:class="piece.class"
						:draggable="true"
						@dragstart="handleDragStart(piece)"></piece>
				</div>
			</cg-board>
		</div>
		<div class="config w-[500px] flex flex-col justify-between items-start">
			<div
				class="w-full top shadow-md drop-shadow-sm shadow-slate-500 p-10">
				<h2>
					Điều chỉnh mã FEN bằng cách kéo thả bàn cờ bên cạnh, hoặc
					nhập thủ công bằng ô ở dưới
				</h2>
				<label
					for="fen"
					class="block text-sm font-medium text-gray-700 mt-3"
					>FEN:</label
				>
				<input
					type="text"
					id="fen"
					v-model="fen"
					@input="updateNextTurn"
					class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" />

				<button
					@click="this.fen = this.boardConfig.fen"
					class="mt-2 ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
					Nhận FEN hiện tại
				</button>
				<label
					for="nextTurn"
					class="block text-sm font-medium text-gray-700 mt-4"
					>Người chơi lượt tiếp theo:</label
				>
				<select
					id="nextTurn"
					v-model="nextTurn"
					@change="updateFEN"
					class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
					<option value="w">Quân trắng</option>
					<option value="b">Quân đen</option>
				</select>
				<button
					@click="changeFEN"
					:disabled="boardConfig.fen === fen"
					class="mt-2 mb-2 ml-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
					Thay đổi FEN
				</button>
				<h2>
					Nếu nhập thủ công bằng bộ cài bên này, bạn cần nhấn
					<span class="text-red-500 font-bold">Thay đổi FEN</span>
					trước khi bắt đầu
				</h2>

				<!-- <label
					for="pgn"
					class="block text-sm font-medium text-gray-700 mt-4"
					>PGN (optional):</label
				>
				<textarea
					id="pgn"
					v-model="pgn"
					class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"></textarea> -->
			</div>
			<div class="w-full bottom pl-10">
				<button
					@click="confirmFen"
					class="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
					Bắt đầu luyện tập
				</button>
			</div>
		</div>
	</div>
</template>
