<template>
	<div id="app-content">
		<div
			v-if="errorMessage"
			class="error-message">
			<p class="error">
				{{ errorMessage }}
			</p>
		</div>
		<ChessBoard
			class="content-loaded"
			v-if="currentPlayer" />
		<div
			class="choose-player"
			v-if="!currentPlayer">
			<label for="player-select">Choose Player:</label>
			<select
				id="player-select"
				v-model="currentPlayer">
				<option
					disabled
					value="">
					Please select one
				</option>
				<option value="white">White</option>
				<option value="black">Black</option>
			</select>
		</div>
	</div>
</template>

<script>
	import 'tsk-chess/style';
	import axios from 'axios';
	import { ChessBoard, ChessBoardServerless } from 'tsk-chess';
	import { computed } from 'vue';

	export default {
		components: {
			ChessBoard,
			ChessBoardServerless,
		},
		data() {
			return {
				errorMessage: '',
				playerProfiles: {
					player1: {
						name: 'PTD21 Tester',
						avatar: '/imgs/p1.jpg',
					},
					player2: {
						name: 'BOT [120]',
						avatar: '/imgs/p2.jpg',
					},
				},
				currentPlayer: null,
			};
		},
		inject: ['pTitle'],
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
			this.pTitle = `Đánh cờ vua`;
			// this.pTitle = `${this.playerProfiles.player1.name} VS ${this.playerProfiles.player2.name}`;
		},
		methods: {
			async checkServer() {
				try {
					await axios.post('http://localhost:3000/api/pve/start');
					this.useServer = true;
					this.errorMessage = ''; // Clear any previous error messages
				} catch (error) {
					console.error('Server is not available:', error);
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
					this.errorMessage = '';
				}
			},
		},
		provide() {
			return {
				playerProfiles: computed(() => this.playerProfiles),
				baseUrl: window.location.origin,
				isetupPlayer: computed(() => this.currentPlayer),
				iPlayWithBot: true,
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
		background-color: rgba(0, 0, 0, 0.8);
		border: red 2px solid;
		left: 50%;
		max-width: 100%;
		position: absolute;
		top: 10px;
		transform: translateX(-50%);
		width: max-content;
	}
</style>
