<script>
	import Heatmap from '@/components/Heatmap/Index.vue';
	export default {
		inject: ['pTitle'],
		components: { Heatmap },
		mounted() {
			this.pTitle = 'Cờ vua PTD21';
		},
		data() {
			return {
				leaderBoard: [
					{ nickname: 'User1', elo: 1500 },
					{ nickname: 'User2', elo: 1450 },
					{ nickname: 'User3', elo: 1400 },
					{ nickname: 'User4', elo: 1350 },
					{ nickname: 'User5', elo: 1300 },
					{ nickname: 'User6', elo: 1250 },
					{ nickname: 'User7', elo: 1200 },
					{ nickname: 'User8', elo: 1150 },
					{ nickname: 'User9', elo: 1100 },
					{ nickname: 'User10', elo: 1050 },
				],
			};
		},
	};
</script>

<template>
	<div class="w-full h-full bg-gray-100">
		<div class="flex flex-row h-full">
			<div class="w-1/2 h-full border-r border-gray-700 border-solid">
				<div class="user-info p-4 bg-white shadow-md rounded-lg">
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
								Người chơi: PTD21 Tester
							</div>
							<div class="text-sm text-gray-600">
								Nickname: PTD21 Tester
							</div>
						</div>
					</div>
					<div
						class="score-info mt-4 p-4 pl-0 bg-gray-50 rounded-lg shadow-inner">
						<div class="elo-s text-xl font-semibold text-gray-800">
							ELO: 120
						</div>
						<div class="wl-his text-sm text-gray-600 mt-2">
							Chiến tích tuần này: 3W / 1L
						</div>
					</div>
					<div class="history-match w-[85%] mt-4">
						<div
							class="elo-s text-xl font-semibold text-gray-800 mb-2">
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
								<tr>
									<td
										class="border border-gray-700 border-solid text-center">
										1
									</td>
									<td
										class="border border-gray-700 border-solid text-center">
										20/11/2024
									</td>
									<td
										class="border border-gray-700 border-solid text-center">
										BOT [20]
									</td>
									<td
										class="border border-gray-700 border-solid text-center">
										Thắng
									</td>
								</tr>
								<tr>
									<td
										class="border border-gray-700 border-solid text-center">
										1
									</td>
									<td
										class="border border-gray-700 border-solid text-center">
										20/11/2024
									</td>
									<td
										class="border border-gray-700 border-solid text-center">
										BOT [70]
									</td>
									<td
										class="border border-gray-700 border-solid text-center">
										Thắng
									</td>
								</tr>
								<tr>
									<td
										class="border border-gray-700 border-solid text-center">
										2
									</td>
									<td
										class="border border-gray-700 border-solid text-center">
										20/11/2024
									</td>
									<td
										class="border border-gray-700 border-solid text-center">
										BOT [120]
									</td>
									<td
										class="border border-gray-700 border-solid text-center">
										Thua
									</td>
								</tr>
								<tr>
									<td
										class="border border-gray-700 border-solid text-center">
										3
									</td>
									<td
										class="border border-gray-700 border-solid text-center">
										20/11/2024
									</td>
									<td
										class="border border-gray-700 border-solid text-center">
										BOT [120]
									</td>
									<td
										class="border border-gray-700 border-solid text-center">
										Thắng
									</td>
								</tr>
								<tr>
									<td
										class="border border-gray-700 border-solid text-center">
										4
									</td>
									<td
										class="border border-gray-700 border-solid text-center">
										20/11/2024
									</td>
									<td
										class="border border-gray-700 border-solid text-center">
										BOT [120]
									</td>
									<td
										class="border border-gray-700 border-solid text-center">
										Thắng
									</td>
								</tr>
							</tbody>
						</table>
					</div>
				</div>
				<div
					class="user-heatmap mt-4 p-4 bg-white shadow-md rounded-lg">
					<h3 class="text-lg font-semibold text-gray-800 mb-2">
						Lịch sử hoạt động
					</h3>
					<Heatmap />
				</div>
			</div>
			<div class="w-1/2 h-full">
				<div class="leader-board h-1/2 border-b border-gray-300">
					<h2
						class="text-center text-2xl font-semibold text-gray-800 mb-4">
						Bảng xếp hạng
					</h2>
					<table
						class="leader-table w-[85%] mx-auto border border-gray-300 rounded-lg overflow-hidden">
						<thead class="bg-gray-200 text-gray-700">
							<tr>
								<th class="p-2 text-center">#</th>
								<th class="p-2 text-center">Nickname</th>
								<th class="p-2 text-center">ELO</th>
							</tr>
						</thead>
						<tbody>
							<tr
								v-for="(user, index) in leaderBoard"
								:key="index"
								class="bg-white text-gray-700 even:bg-gray-50">
								<td
									class="p-2 text-center border-t border-gray-300">
									{{ index + 1 }}
								</td>
								<td
									class="p-2 text-center border-t border-gray-300">
									{{ user.nickname }}
								</td>
								<td
									class="p-2 text-center border-t border-gray-300">
									{{ user.elo }}
								</td>
							</tr>
						</tbody>
					</table>
				</div>
				<div
					class="group h-1/2 flex flex-col justify-center items-center mt-4">
					<a
						href="/chess"
						class="play-chess-btn w-[75%] p-2 mb-4 text-center bg-blue-500 text-white rounded-xl shadow-md hover:bg-blue-600 transition duration-300">
						Đánh cờ vua
					</a>
					<div class="learning-training w-[75%] flex justify-between">
						<a
							href="/learning"
							class="learning-btn w-[48%] p-2 text-center bg-green-500 text-white rounded-xl shadow-md hover:bg-green-600 transition duration-300">
							Tiếp tục học
						</a>
						<a
							href="/training"
							class="training-btn w-[48%] p-2 text-center bg-yellow-500 text-white rounded-xl shadow-md hover:bg-yellow-600 transition duration-300">
							Luyện tập
						</a>
					</div>
				</div>
			</div>
		</div>
	</div>
</template>

<style lang="scss" scope></style>
