<script>
	import IconHome from '@/assets/icons/Home.vue';
	import IconChess from '@/assets/icons/Chess.vue';
	import IconLightBuld from '@/assets/icons/LightBuld.vue';
	import IconLearning from '@/assets/icons/Learning.vue';
	import IconPerson from '@/assets/icons/Person.vue';
	import IconRobot from '@/assets/icons/Robot.vue';
	export default {
		components: {
			IconHome,
			IconChess,
			IconLightBuld,
			IconLearning,
			IconPerson,
			IconRobot,
		},
	};
</script>

<template>
	<div
		id="navbar"
		class="overflow-x-hidden">
		<div
			class="flex items-center md:text-center justify-center h-16 bg-gray-900 min-w-[100%] select-none">
			<slot />
			<span
				class="text-white flex-1 mt-[1%] font-bold uppercase text-nowrap">
				PTD21 Chess
			</span>
		</div>
		<div class="flex flex-col flex-1 overflow-y-auto">
			<nav class="flex-1 px-2 py-4 bg-gray-800">
				<RouterLink
					to="/"
					class="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700 select-none">
					<IconHome class="h-6 w-6 mr-2" />
					<div
						class="content overflow-hidden text-ellipsis whitespace-nowrap">
						Trang chủ
					</div>
				</RouterLink>
				<label class="flex flex-col">
					<input
						type="checkbox"
						class="hidden peer" />
					<div
						class="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700 cursor-pointer select-none">
						<IconChess class="h-6 w-6 mr-2 ml-[-1%]" />
						<div
							class="content overflow-hidden text-ellipsis whitespace-nowrap">
							Đánh cờ vua
						</div>
					</div>
					<div
						class="peer-checked:block hidden mt-2 ml-4 flex-1 bg-gray-800">
						<RouterLink
							to="/chess/pvp"
							class="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700 select-none">
							<IconPerson
								class="bi bi-person-plus-fill h-5 w-5 mr-1" />
							<div
								class="content overflow-hidden text-ellipsis whitespace-nowrap">
								PvP
							</div>
						</RouterLink>
						<RouterLink
							to="/chess/pve"
							class="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700 select-none">
							<IconRobot class="bi bi-robot h-5 w-5 mr-1" />
							<div
								class="content overflow-hidden text-ellipsis whitespace-nowrap">
								PvE
							</div>
						</RouterLink>
					</div>
				</label>
				<RouterLink
					to="/training"
					class="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700 select-none">
					<IconLightBuld class="bi bi-lightbulb-fill w-6 h-6 mr-2" />
					<div
						class="content overflow-hidden text-ellipsis whitespace-nowrap">
						Luyện tập
					</div>
				</RouterLink>
			</nav>
			<RouterLink
				to="/learning"
				class="flex items-center px-6 py-4 mt-2 mb-2 text-gray-100 hover:bg-gray-700 select-none">
				<IconLearning class="h-6 w-6 mr-2 bi bi-mortarboard" />
				<div
					class="content overflow-hidden text-ellipsis whitespace-nowrap">
					Làm quen với cờ vua
				</div>
			</RouterLink>
		</div>
	</div>
</template>
