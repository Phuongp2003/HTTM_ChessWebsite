<script>
	import LeaderBoard from '@/components/Home/LeaderBoard.vue';
	import UserInfo from '@/components/Home/UserInfo.vue';
	export default {
		inject: ['pTitle'],
		components: {
			UserInfo,
			LeaderBoard,
		},
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
				<user-info />
			</div>
			<div class="w-1/2 h-full">
				<leader-board />
			</div>
		</div>
	</div>
</template>

<style lang="scss" scope></style>
