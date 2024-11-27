<template>
	<div id="app-content">
		<div
			v-if="errorMessage"
			class="error-message">
			<p class="error">
				{{ errorMessage }}
			</p>
		</div>
		<div>
			<button @click="createRoom">Create Room</button>
			<input
				v-model="roomId"
				placeholder="Enter Room ID" />
			<button @click="joinRoom">Join Room</button>
			<div v-if="roomId">Room ID: {{ roomId }}</div>
			<div v-if="playerId">Player ID: {{ playerId }}</div>
		</div>
		<PVPChessboard
			v-if="currentPlayer && roomJoined"
			:matchId="roomId"
			:playerID="playerId"
			:playerColor="currentPlayer"
			:socket="socket" />
		<div class="connection-status">Socket Status: {{ socketStatus }}</div>
	</div>
</template>

<script>
	import { PVPChessboard } from 'tsk-chess';
	import axios from 'axios';
	import { useCookies } from '@vueuse/integrations/useCookies';
	import { computed, ref } from 'vue';
	import io from 'socket.io-client';
	import 'tsk-chess/style';

	export default {
		components: {
			PVPChessboard,
		},
		data() {
			return {
				useServer: true,
				isPvPMode: true,
				errorMessage: '',
				playerProfiles: {
					player1: {
						name: 'Demo Player',
						avatar: '/favicon.ico',
					},
					player2: {
						name: 'BOT Stockfish Dept 3',
						avatar: '/images/stockfish-logo.png',
					},
				},
				currentPlayer: null,
				roomId: '',
				playerId: this.cookies.get('user').uid,
				roomJoined: false,
				socket: null,
				socketStatus: 'Disconnected',
			};
		},
		inject: ['pTitle'],
		setup() {
			const cookies = useCookies();
			return { cookies };
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
		mounted() {
			this.checkServer();
			this.connectSocket();
			this.pTitle = `Đánh cờ vua`;
		},
		methods: {
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
						this.errorMessage = '';
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
					console.log('🚀 ~ this.socket.on ~ data:', data);
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
				const color = confirm('Bạn có muốn đi trước không?')
					? 'white'
					: 'black';
				this.socket.emit('choose_color', {
					gameId: this.roomId,
					playerId: this.playerId,
					color,
				});
			},
		},
		provide() {
			return {
				playerProfiles: computed(() => this.playerProfiles),
				baseUrl: window.location.origin,
				isetupPlayer: computed(() => this.currentPlayer),
				iPlayWithBot: false,
				matchId: computed(() => this.roomId),
				playerColor: computed(() => this.currentPlayer),
				errorMessage: ref(() => this.errorMessage),
			};
		},
	};
</script>

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
</style>
