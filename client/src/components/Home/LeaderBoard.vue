<script>
	import UserInfo from '@/components/Home/UserInfo.vue';
	export default {
		components: {
			UserInfo,
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
	<div class="leader-board-wrap">
		<div class="leader-board h-1/2 border-b border-gray-300">
			<h2 class="text-center text-2xl font-semibold text-gray-800 mb-4">
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
						<td class="p-2 text-center border-t border-gray-300">
							{{ index + 1 }}
						</td>
						<td class="p-2 text-center border-t border-gray-300">
							{{ user.nickname }}
						</td>
						<td class="p-2 text-center border-t border-gray-300">
							{{ user.elo }}
						</td>
					</tr>
				</tbody>
			</table>
		</div>
		<div class="group h-1/2 flex flex-col justify-center items-center mt-4">
			<RouterLink
				to="/chess/pvp"
				class="play-chess-btn w-[75%] p-2 mb-4 text-center bg-blue-500 text-white rounded-xl shadow-md hover:bg-blue-600 transition duration-300">
				Đánh cờ vua với người chơi
			</RouterLink>
			<div class="learning-training w-[75%] flex justify-between">
				<RouterLink
					to="/learning"
					class="learning-btn w-[48%] p-2 text-center bg-green-500 text-white rounded-xl shadow-md hover:bg-green-600 transition duration-300">
					Tiếp tục học
				</RouterLink>
				<RouterLink
					to="/training"
					class="training-btn w-[48%] p-2 text-center bg-yellow-500 text-white rounded-xl shadow-md hover:bg-yellow-600 transition duration-300">
					Luyện tập
				</RouterLink>
			</div>
		</div>
	</div>
</template>
<style></style>
