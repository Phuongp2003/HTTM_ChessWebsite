<style>
	.error {
		color: white;
		font-size: 20px;
	}
	.error-message {
		position: absolute;
		top: 10px;
		left: 50%;
		transform: translateX(-50%);
		width: max-content;
		max-width: 100%;
		background-color: rgba(0, 0, 0, 0.8);
		border: red 2px solid;
	}
	.connection-status {
		margin-top: 10px;
		font-weight: bold;
	}

	.d-flex {
		display: flex;
	}

	.flex-col {
		flex-direction: column;
	}
	.flex-row {
		flex-direction: row;
	}

	.main-chessboard-wrap {
		margin: 0 auto;
		gap: 20px;
	}
	.control-demo > *:not(.sect) {
		display: none;
	}
</style>

<template>
	<div id="app-content">
		<div v-if="showTrainShow">
			<TrainShow
				:close="closeTrainShow"
				:sFen="boardAPI.getFen()"
				:orientation="currentPlayer" />
		</div>
		<div v-else>
			<div
				class="setup-board"
				v-if="!isReady">
				<TrainSetup
					@done-setup="
						() => {
							isReady = true;
						}
					" />
			</div>
			<div
				class="train-board"
				v-if="isReady">
				<div
					v-if="errorMessage"
					class="error-message">
					<p class="error">{{ errorMessage }}</p>
				</div>
				<keep-alive>
					<div
						class="main-chessboard-wrap d-flex flex-row justify-evenly w-full"
						v-if="currentPlayer">
						<TrainBoard
							ref="chessboardwrap"
							@board-created="createdBoard"
							:matchId="roomId"
							:playerID="playerId"
							:playerColor="currentPlayer"
							:socket="socket" />
						<div class="control w-[500px] px-2 py-3">
							<GameControl
								:boardAPI="boardAPI"
								:trainingStart="trainingStart"
								v-if="boardAPI && trainingMode" />
							<button
								@click="startTraining"
								class="mt-2 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
								Phân tích thế cờ
							</button>
						</div>
					</div>
				</keep-alive>
				<div
					class="choose-player w-full h-full flex justify-center items-center"
					v-if="!currentPlayer">
					<div class="wrap w-[400px] p-4 flex flex-col">
						<label
							for="player-select"
							class="w-full px-1 py-1 text-2xl font-bold mb-2"
							>Chọn lượt chơi:</label
						>
						<select
							id="player-select"
							class="w-full px-1 py-1 border-2 border-solid border-green-600"
							v-model="currentPlayer">
							<option
								disabled
								value="">
								Hãy chọn màu dưới đây
							</option>
							<option value="white">Quân trắng</option>
							<option value="black">Quân đen</option>
						</select>
					</div>
				</div>
				<div class="connection-status">
					Socket Status: {{ socketStatus }}
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { TrainBoard, GameControl } from 'tsk-chess';
	import TrainSetup from './TrainSetup.vue';
	import TrainShow from './TrainShow.vue';
	import axios from 'axios';
	import { useCookies } from '@vueuse/integrations/useCookies';
	import { computed, ref, provide } from 'vue';
	import io from 'socket.io-client';
	import 'tsk-chess/style';

	export default {
		components: {
			GameControl,
			TrainBoard,
			TrainSetup,
			TrainShow,
		},
		data() {
			return {
				useServer: true,
				isPvPMode: false,
				errorMessage: '',
				playerProfiles: {
					player1: {
						name: 'Demo Player',
						avatar: '/favicon.ico',
					},
				},
				currentPlayer: null,
				roomId: '',
				playerId: this.cookies.get('user').uid,
				trainingMode: true,
				socket: null,
				socketStatus: 'Disconnected',
				boardAPI: null,
				isReady: false,
				showTrainShow: false,
				bkFen: null,
			};
		},
		setup() {
			const cookies = useCookies();
			let startupFen = ref('');
			provide('startupFen', startupFen);
			return { cookies, startupFen };
		},
		watch: {
			errorMessage(newValue) {
				if (newValue) {
					setTimeout(() => {
						this.errorMessage = '';
					}, 5000);
				}
			},
		},
		async mounted() {
			this.connectSocket();
			await this.checkServer();
		},
		beforeUnmount() {
			this.disconnectSocket();
		},
		methods: {
			createdBoard(boardApi) {
				this.boardAPI = boardApi;
			},
			async checkServer() {
				try {
					await axios.post('http://localhost:3000/api/pve/start');
					this.useServer = true;
					this.errorMessage = ''; // Clear any previous error messages
				} catch (error) {
					console.error('Server is not available:', error);
					this.useServer = false;
					this.errorMessage =
						'Server is not available. Using serverless mode.';
				}
			},
			async handleUseServerChange() {
				if (this.useServer) {
					try {
						await axios.post('http://localhost:3000/api/pve/start');
						this.errorMessage = ''; // Clear any previous error messages
					} catch (error) {
						console.error('Server is not available:', error);
						this.useServer = false;
						this.errorMessage =
							'Server is not available. Using serverless mode.';
					}
				} else {
					this.errorMessage = ''; // Clear error message when switching to serverless mode
				}
			},

			connectSocket() {
				this.socket = io('http://localhost:3000', {
					transports: ['websocket'],
					withCredentials: true,
				});
				this.socket.on('connect', () => {
					this.socketStatus = 'Connected';
					console.log('Socket connected:', this.socket.id);
				});
				this.socket.on('disconnect', () => {
					this.socketStatus = 'Disconnected';
					console.log('Socket disconnected');
				});
				this.socket.on('join_success', (data) => {
					this.roomJoined = true;
					console.log('Join success:', data);
				});
				this.socket.on('room_created', ({ gameId, playerId }) => {
					this.roomId = gameId;
					this.joinRoom();
				});
				this.socket.on('choose_color', ({ gameId }) => {
					if (this.roomId === gameId) {
						this.chooseColor();
					}
				});
				this.socket.on('color_chosen', (data) => {
					this.roomJoined = true;
					this.currentPlayer =
						data.gameState.white_player === this.playerId
							? 'white'
							: 'black';
					console.log('Color chosen:', data);
				});
				this.socket.on('error', (message) => {
					this.errorMessage = message;
					console.log('Socket error:', message);
				});
			},
			disconnectSocket() {
				if (this.socket) {
					this.socket.disconnect();
					this.socket = null;
					this.socketStatus = 'Disconnected';
					console.log('Socket disconnected manually');
				}
			},
			createRoom() {
				this.socket.emit('create_room', { playerId: this.playerId });
			},
			joinRoom() {
				this.socket.emit('join_game', {
					gameId: this.roomId,
					playerId: this.playerId,
				});
				this.socket.on('join_success', (data) => {
					this.roomJoined = true;
					console.log('Join success:', data);
				});
			},
			chooseColor() {
				const color = confirm('Do you want to play as white?')
					? 'white'
					: 'black';
				this.socket.emit('choose_color', {
					gameId: this.roomId,
					playerId: this.playerId,
					color,
				});
			},
			async trainingStart() {
				try {
					const response = await axios.post(
						'http://localhost:3000/api/train/start',
						{
							fen: this.$refs.chessboardwrap.boardAPI.getFen(),
							role:
								this.currentPlayer === 'white'
									? 'black'
									: 'white',
							elo: 10,
							coachEloMultiple: 1.2,
						}
					);
					const bestMove = response.data.bestMove;
					if (bestMove) {
						this.$refs.chessboardwrap.boardAPI.move({
							from: bestMove.slice(0, 2),
							to: bestMove.slice(2, 4),
						});
					}
					this.$refs.chessboardwrap.inTimePause = false;
					this.$refs.chessboardwrap.isFirstMoveDone = true;
					this.errorMessage = '';
				} catch (error) {
					console.error('Server is not available:', error);
					this.useServer = false;
					this.errorMessage =
						'Server is not available. Using serverless mode.';
				}
			},
			closeTrainShow() {
				this.showTrainShow = false;
			},
			startTraining() {
				this.showTrainShow = true;
			},
		},
		provide() {
			return {
				playerProfiles: computed(() => ({
					...this.playerProfiles,
					player2: {
						name: 'BOT PDT',
						avatar: '/imgs/p2.jpg',
					},
				})),
				isetupPlayer: computed(() => this.currentPlayer),
				iPlayWithBot: true,
				iTrainingMode: computed(() => this.trainingMode),
				matchId: computed(() => this.roomId),
				playerColor: computed(() => this.currentPlayer),
				errorMessage: ref(() => this.errorMessage),
			};
		},
	};
</script>
