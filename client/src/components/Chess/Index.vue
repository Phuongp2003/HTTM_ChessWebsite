<template>
	<div id="app">
		<div
			v-if="errorMessage"
			class="error-message">
			<p class="error">
				{{ errorMessage }}
			</p>
		</div>
		<label>
			<input
				type="checkbox"
				v-model="useServer"
				@change="handleUseServerChange" />
			Use Server
		</label>
		<component
			:is="useServer ? 'ChessBoard' : 'ChessBoardServerless'"
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
	import { ChessBoard, ChessBoardServerless } from 'tsk-chess';
	import axios from 'axios';
	import { computed } from 'vue';
	import 'tsk-chess/style';

	export default {
		components: {
			ChessBoard,
			ChessBoardServerless,
		},
		data() {
			return {
				useServer: true,
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
				currentPlayer: '',
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
					await axios.post('http://localhost:3000/start');
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
						await axios.post('http://localhost:3000/start');
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
		position: absolute;
		top: 10px;
		left: 50%;
		transform: translateX(-50%);
		width: max-content;
		max-width: 100%;
		background-color: rgba(0, 0, 0, 0.8);
		border: red 2px solid;
	}
</style>
