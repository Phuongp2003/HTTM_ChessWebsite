<script>
	import Heatmap from '@/components/Heatmap/Index.vue';
	import { useCookies } from '@vueuse/integrations/useCookies';
	import axios from 'axios';
	export default {
		components: {
			Heatmap,
		},
		setup() {
			const cookies = useCookies();
			return { cookies };
		},
		data() {
			return {
				user: null,
				matches: null,
			};
		},
		async mounted() {
			this.user = await this.cookies.get('user');
			await this.fetchMatchesHistory();
			console.log(this.user);
		},
		methods: {
			async fetchUserByUid(uid) {
				try {
					const response = await axios.get(
						`http://localhost:3000/api/user/${uid}`
					);
					return response.data;
				} catch (error) {
					console.error(
						`Error fetching user with UID ${uid}:`,
						error
					);
					return `Player ${uid}`;
				}
			},
			async fetchMatchesHistory() {
				try {
					const response = await axios.get(
						`http://localhost:3000/api/match/history/${this.user.uid}`
					);
					const matches = await Promise.all(
						response.data.map(async (match) => {
							const opponentUid =
								match.player_b === this.user.uid
									? match.player_a
									: match.player_b;
							const opponent = await this.fetchUserByUid(
								opponentUid
							);
							const isWhitePlayer =
								this.user.uid === match.white_player;
							const whiteWon =
								match.result.split('_')[1] === 'WHITE';
							return {
								date: match.date
									? new Date(match.date).toLocaleDateString(
											'vi-VN',
											{
												day: '2-digit',
												month: '2-digit',
												year: 'numeric',
											}
									  )
									: 'Unknown',
								op: opponent.nickname,
								res:
									(isWhitePlayer && whiteWon) ||
									(!isWhitePlayer && !whiteWon),
							};
						})
					);
					this.matches = matches;
				} catch (error) {
					console.error('Error fetching matches history:', error);
				}
			},
		},
		computed: {
			winLossRecord() {
				const now = new Date();
				const dayOfWeek = now.getDay();
				const startOfWeek = new Date(now);
				startOfWeek.setDate(
					now.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1) - 1
				); // Adjust to Monday

				const matchesThisWeek = this.matches.filter((match) => {
					const matchDate = new Date(
						match.date.split('/').reverse().join('-')
					); // Convert to Date object
					return matchDate >= startOfWeek && matchDate <= now;
				});

				const wins = matchesThisWeek.filter(
					(match) => match.res
				).length;
				const losses = matchesThisWeek.length - wins;
				return `${wins} trận THẮNG / ${losses} trận THUA`;
			},
		},
	};
</script>

<template>
	<div class="user-info">
		<div
			class="user-info p-4 bg-white shadow-md rounded-lg"
			v-if="user && matches">
			<div
				class="basic-info flex items-center gap-3 justify-start border border-gray-700 border-solid w-[75%] p-2 rounded-xl">
				<div
					class="avatar-container w-[75px] h-[75px] flex-shrink-0 rounded-full overflow-hidden border border-gray-300">
					<img
						src="/imgs/p1.jpg"
						alt="User Avatar"
						class="avatar w-full h-full object-cover" />
				</div>
				<div
					class="user-name flex flex-col gap-2 h-full min-h-[100%] justify-center border-l border-gray-700 pl-3">
					<div class="text-lg font-semibold text-gray-800">
						Người chơi: {{ user.lastName }} {{ user.firstName }}
					</div>
					<div class="text-sm text-gray-600">
						Nickname: {{ user.nickname }}
					</div>
				</div>
			</div>
			<div
				class="score-info mt-4 p-4 pl-0 bg-gray-50 rounded-lg shadow-inner">
				<div class="elo-s text-xl font-semibold text-gray-800">
					ELO: {{ user.elo }}
				</div>
				<div class="wl-his text-sm text-gray-600 mt-2">
					Chiến tích tuần này: {{ winLossRecord }}
				</div>
			</div>
			<div class="history-match w-[85%] mt-4">
				<div class="elo-s text-xl font-semibold text-gray-800 mb-2">
					Lịch sử đấu
				</div>
				<table
					class="history-table w-full border border-gray-700 border-solid">
					<thead>
						<tr>
							<th
								class="border border-gray-700 border-solid text-center">
								#
							</th>
							<th
								class="border border-gray-700 border-solid text-center">
								Ngày
							</th>
							<th
								class="border border-gray-700 border-solid text-center">
								Đối thủ
							</th>
							<th
								class="border border-gray-700 border-solid text-center">
								Kết quả
							</th>
						</tr>
					</thead>
					<tbody>
						<tr
							v-for="(match, index) in matches"
							:key="match">
							<td
								class="border border-gray-700 border-solid text-center">
								{{ index + 1 }}
							</td>
							<td
								class="border border-gray-700 border-solid text-center">
								{{ match.date }}
							</td>
							<td
								class="border border-gray-700 border-solid text-center">
								{{ match.op }}
							</td>
							<td
								class="border border-gray-700 border-solid text-center">
								{{ match.res ? 'Thắng' : 'Thua' }}
							</td>
						</tr>
					</tbody>
				</table>
			</div>
		</div>
		<div class="user-heatmap mt-4 p-4 bg-white shadow-md rounded-lg">
			<h3 class="text-lg font-semibold text-gray-800 mb-2">
				Lịch sử hoạt động
			</h3>
			<Heatmap
				:matches="matches"
				v-if="matches" />
		</div>
	</div>
</template>

<style></style>
