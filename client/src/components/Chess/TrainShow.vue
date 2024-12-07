<script>
	import { TheChessboard } from 'vue3-chessboard';
	import 'vue3-chessboard/style.css';
	import axios from 'axios';
	import Eye from '@/components/icons/Eye.vue';
	import MoveRisk from '@/components/Pad/MoveRisk.vue';
	import RotBoard from '@/components/icons/RotBoard.vue';
	export default {
		components: {
			TheChessboard,
			MoveRisk,
			Eye,
			RotBoard,
		},
		inject: ['startupFen', 'isetupPlayer'],
		props: {
			sFen: { type: String, required: true },
			orientation: { type: String, required: true },
			close: { type: Function, required: true },
		},
		data() {
			return {
				ready: false,
				boardConfig: {
					fen: this.sFen,
					orientation: this.orientation, // the orientation of the board
				},
				boardAPI: null,
				fen: '',
				nextTurn: 'w',
				pgn: '',
				rData: {
					intent: null,
					fen: null,
					move: null,
					elo: 40,
					eloMultiple: 1.2,
				},
				data: {
					intent: null, // for check move - use for check intent of use and show risks
					risks: null, // for check move - use for check intent of use and show risks
					moves: null, // for get moves - use for get moves and risks each move
					score: null, // for get moves - use for get moves and risks each move
				},
				mrData: null,
				componentKey: 0,
			};
		},
		mounted() {
			setTimeout(() => {
				this.ready = true;
			}, 500);
			this.fen = this.boardConfig.fen;
			console.log(this.fen);
		},
		methods: {
			async fetchIntent({ fen, move, elo, eloMultiple }) {
				try {
					await axios
						.post('http://localhost:5000/check', {
							fen,
							move,
							elo,
							eloMultiple,
						})
						.then((response) => response.data)
						.then((data) => {
							this.data = { ...data };
							this.mrData = [
								{
									move,
									fen: this.boardConfig.fen,
									intent: this.data.intent,
									risks: this.data.risks,
								},
							];
						})
						.catch((error) => {
							console.error(error);
						});
					this.errorMessage = '';
				} catch (error) {
					console.error('Server is not available:', error);
					this.useServer = false;
					this.errorMessage =
						'Server is not available. Using serverless mode.';
				}
			},
			async fetchRisks({ fen, elo, eloMultiple, intent }) {
				try {
					await axios
						.post('http://localhost:5000/ghelp', {
							fen,
							intent,
							elo,
							eloMultiple,
						})
						.then((response) => response.data)
						.then((data) => {
							this.data = { ...data };
							this.mrData = this.data.moves;
						})
						.catch((error) => {
							console.error(error);
						});
					this.errorMessage = '';
				} catch (error) {
					console.error('Server is not available:', error);
					this.useServer = false;
					this.errorMessage =
						'Server is not available. Using serverless mode.';
				}
			},
			onMove(move) {
				this.rData = {
					...this.rData,
					fen: this.boardConfig.fen,
					move: move,
				};
				this.fetchIntent(this.rData);
			},
			onSelectIntent(intent) {
				this.rData = {
					...this.rData,
					fen: this.boardConfig.fen,
					intent: intent,
				};
				this.fetchRisks(this.rData);
			},
			setFen(fen, move) {
				this.boardConfig.fen = fen;
				if (move) {
					console.log(move);
					const orig = move.slice(0, 2);
					const dest = move.slice(2, 4);
					this.boardAPI.drawMove(orig, dest, 'paleBlue');
				}
			},
			restart() {
				this.setFen(this.fen);
				this.mrData = null;
				this.componentKey += 1;
				this.data = {
					intent: null, // for check move - use for check intent of use and show risks
					risks: null, // for check move - use for check intent of use and show risks
					moves: null, // for get moves - use for get moves and risks each move
					score: null, // for get moves - use for get moves and risks each move
				};
			},
		},
	};
</script>

<template>
	<div
		class="input-fen flex flex-row w-full justify-evenly"
		:key="componentKey">
		<div class="board">
			<TheChessboard
				@move="onMove"
				v-if="ready"
				:board-config="boardConfig"
				@board-created="(api) => (boardAPI = api)"
				reactive-config />
		</div>
		<div
			class="config w-[500px] flex flex-col justify-between items-start">
			<div class="w-full top h-[600px] overflow-y-scroll scroll-bar-c">
				<div class="action">
					<button
						class="button"
						title="Kiểm tra các rủi ro"
						@click="boardAPI?.toggleMoves()">
						<Eye />
					</button>
					<div
						class="quote"
						v-if="!(data.moves || data.risks)">
						Chọn mục tiêu ở phía dưới hoặc thực hiện 1 nước đi ở bàn
						cờ bên cạnh!
					</div>
					<div
						class="action-btns flex flex-row justify-evenly items-center"
						v-if="!(data.moves || data.risks)">
						<button
							class="action-btn button"
							@click="onSelectIntent('def')">
							Phòng thủ
						</button>
						<button
							class="action-btn button"
							@click="onSelectIntent('atk')">
							Tấn công
						</button>
					</div>
				</div>
				<div
					class="score"
					v-if="data.score || data.intent">
					<div
						class="intent-show"
						v-if="!data.score">
						Mục tiêu của bạn:
						{{ data.intent === 'atk' ? 'Tấn công' : 'Phòng thủ' }}
					</div>
					<div
						class="intent-show"
						v-else>
						Mục tiêu:
						{{ data.intent === 'atk' ? 'Tấn công' : 'Phòng thủ' }}
					</div>
					<div
						class="score-show"
						v-if="data.score">
						Đánh giá: {{ data.score }}
					</div>
				</div>
				<div
					class="risks flex flex-col mt-3"
					v-if="data.moves || data.risks">
					<div class="control flex flex-row justify-between">
						<button
							class="player w-[48%] flex flex-row button"
							@click="boardAPI?.toggleOrientation()">
							Xoay bàn cờ
						</button>
						<button
							class="player w-[48%] flex flex-row button"
							@click="restart">
							Trở về như cũ
						</button>
					</div>
					<div
						class="mr-item mt-3 border-solid border-gray-300 border-2 p-3"
						v-for="move in mrData"
						:key="move">
						<move-risk
							:move="move"
							:setFen="setFen" />
					</div>
				</div>
			</div>
			<div class="w-full bottom">
				<button
					@click="close"
					class="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
					Kết thúc phân tích
				</button>
			</div>
		</div>
	</div>
</template>
