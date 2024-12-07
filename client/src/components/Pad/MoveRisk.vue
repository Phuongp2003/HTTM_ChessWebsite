<script>
	export default {
		props: {
			move: { type: Object, required: true },
			setFen: { type: Function, required: true },
		},
		mounted() {
			console.log(this.move);
		},
		methods: {
			fixFen(fen) {
				return fen;
			},
		},
	};
</script>

<template>
	<div class="move-n-risk">
		<div class="layout flex flex-row">
			<button
				class="player w-[50%] flex flex-row border-solid border-gray-200 border-2 p-1 items-center"
				@click="
					setFen(
						move.move.after ? move.move.after : move.fen,
						move.move.lan ? move.move.lan : move.move
					)
				">
				<div
					class="p-icon w-[20%] border-solid border-blue-300 border-2 p-1">
					<img
						src="/imgs/swords.png"
						alt=""
						class="w-[90%] aspect-square"
						v-if="move.intent === 'atk'" />
					<img
						src="/imgs/shield.png"
						alt=""
						class="w-[90%] aspect-square"
						v-else />
				</div>
				<div class="p-move w-[85%]">
					<div class="make-move px-[15px] py-[10px]">
						{{ move.move.lan ? move.move.lan : move.move }}
					</div>
				</div>
			</button>
			<div
				class="bot w-[50%] flex flex-col border-solid border-gray-200 border-2 p-1">
				<button
					class="risk-b flex flex-row border-solid border-gray-200 border-2 p-3 items-center"
					v-for="risk in move.risks"
					:key="risk"
					@click="setFen(risk.fen, risk.move)">
					<div class="b-move w-[85%]">
						<div class="make-move px-[15px] py-[10px]">
							{{ risk.move }}
						</div>
					</div>
					<div class="b-icon w-[20%] border-solid border-2 p-2 border-blue-300 ">
						<img
							src="/imgs/swords.png"
							alt=""
							class="w-[90%] aspect-square"
							v-if="risk.intent === 'atk'" />
						<img
							src="/imgs/shield.png"
							alt=""
							class="w-[90%] aspect-square"
							v-else />
					</div>
				</button>
			</div>
		</div>
	</div>
</template>

<style></style>
