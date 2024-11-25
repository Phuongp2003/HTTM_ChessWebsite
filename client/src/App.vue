<style>
	a {
		text-decoration: none;
	}

	li {
		list-style: none;
	}

	body {
		background-color: var(--bs-light);
		color: black;
		font-family: Arial, Helvetica, sans-serif;
	}

	#app-content {
		min-height: 90vh;
	}

	*:has(#authorized) #navbar,
	*:has(#authorized) #sub-navbar {
		display: none;
	}
	#app-content:has(#authorized) {
		padding: 0;
	}
	.fade-enter-active,
	.fade-leave-active {
		transition: all 0.5s;
	}

	.fade-enter,
	.fade-leave-to {
		opacity: 0;
	}
	.fade-enter-from {
		transform: translateY(10vh);
	}
	.fade-leave-to {
		transform: translateY(-100vh);
	}

	.fades-enter-active,
	.fades-leave-active {
		transition: opacity 0.5s;
	}

	.fades-enter,
	.fades-leave-to {
		opacity: 0;
	}
</style>

<template>
	<div>
		<transition name="fades">
			<LoadingTransition v-if="showLoading" />
		</transition>
		<div class="flex relative">
			<Navbar
				id="navbar"
				:class="{
					'w-0 hidden': !isNavbarVisible,
					'w-64': isNavbarVisible,
				}"
				class="md:flex absolute z-[10000] flex-col bg-gray-800 md:sticky top-0 h-[100vh] transition-all duration-300">
				<div class="items-center px-4 flex md:hidden">
					<button
						class="text-gray-500 focus:outline-none focus:text-gray-700 p-4"
						id="navbar-toggle"
						@click="toggleNavbar">
						<svg
							xmlns="http://www.w3.org/2000/svg"
							class="h-6 w-6"
							fill="none"
							viewBox="0 0 24 24"
							stroke="currentColor">
							<path
								stroke-linecap="round"
								stroke-linejoin="round"
								stroke-width="2"
								d="M4 6h16M4 12h16M4 18h16" />
						</svg>
					</button>
				</div>
			</Navbar>
			<div
				id="main-content-wrap"
				class="flex flex-col flex-1">
				<div
					id="sub-navbar"
					class="flex items-center justify-between h-16 bg-white border-b border-gray-200 sticky top-0">
					<h2
						class="title absolute w-[100%] h-[100%] font-bold text-2xl top-0 left-0 text-center flex items-center justify-center z-[-1]">
						{{ pTitle }}
					</h2>
					<div class="flex items-center px-4">
						<button
							class="text-gray-500 focus:outline-none focus:text-gray-700 p-4"
							id="navbar-toggle"
							@click="toggleNavbar">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								class="h-6 w-6"
								fill="none"
								viewBox="0 0 24 24"
								stroke="currentColor">
								<path
									stroke-linecap="round"
									stroke-linejoin="round"
									stroke-width="2"
									d="M4 6h16M4 12h16M4 18h16" />
							</svg>
						</button>
					</div>
					<div
						class="flex items-center justify-between rounded-full border-2 border-red-950 overflow-hidden border-solid h-[85%] aspect-square mr-4">
						<img
							src="/imgs/p1.jpg"
							alt=""
							class="w-[100%] h-[100%]" />
					</div>
				</div>
				<div
					id="app-content"
					class="p-4 min-w-100">
					<router-view v-slot="{ Component }">
						<transition
							name="fade"
							mode="out-in">
							<component :is="Component" />
						</transition>
					</router-view>
				</div>
			</div>

			<Footer v-once />
		</div>
	</div>
</template>

<script>
	import { ref, onMounted, onBeforeUnmount } from 'vue';
	import Navbar from '@/components/Navbar.vue';
	import Footer from '@/components/Footer.vue';

	export default {
		components: { Navbar, Footer },
		data() {
			return {
				isNavbarVisible: true,
			};
		},
		inject: ['pTitle'],
		methods: {
			toggleNavbar() {
				this.isNavbarVisible = !this.isNavbarVisible;
			},
		},
		setup() {
			const showLoading = ref(true);

			const checkContent = () => {
				const appContent = document.getElementById('app-content');
				if (
					appContent &&
					appContent.querySelectorAll('div').length === 0
				) {
					showLoading.value = true;
				} else {
					showLoading.value = false;
				}
			};

			let interval;
			onMounted(() => {
				checkContent();
				interval = setInterval(checkContent, 1000);
			});

			onBeforeUnmount(() => {
				clearInterval(interval);
			});

			return {
				showLoading,
			};
		},
	};
</script>
