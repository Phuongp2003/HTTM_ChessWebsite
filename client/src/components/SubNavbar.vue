<template>
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
		<label class="flex items-center justify-between h-[85%] relative">
			<input
				type="checkbox"
				class="hidden peer" />
			<div
				class="cursor-pointer select-none rounded-full border-2 border-red-950 border-solid overflow-hidden mr-4 aspect-square h-[100%]">
				<!-- Sử dụng ảnh đại diện từ cookie nếu có, nếu không có sẽ dùng ảnh mặc định -->
				<img
					:src="user && user.avatar ? user.avatar : '/imgs/p1.jpg'"
					alt="Avatar"
					class="w-[100%]" />
			</div>
			<div
				class="peer-checked:block hidden absolute bottom-0 right-0 translate-y-[100%] px-[5px] mr-4 py-1 w-[200px] bg-slate-300">
				<div
					class="user-menu flex flex-col justify-center items-start gap-1">
					<RouterLink
						to="/profile"
						class="um-item w-full bg-slate-200"
						>Profile</RouterLink
					>
					<RouterLink
						to="/login"
						class="um-item w-full bg-slate-200"
						>Đăng xuất</RouterLink
					>
				</div>
			</div>
		</label>
	</div>
</template>

<script>
import { useCookies } from '@vueuse/integrations/useCookies';

export default {
	inject: ['pTitle'],
	props: {
		toggleNavbar: { type: Function, required: true },
	},
	data() {
		return {
			user: null, // Lưu thông tin người dùng
		};
	},
	mounted() {
		// Lấy thông tin người dùng từ cookie
		const cookies = useCookies();
		this.user = cookies.get('user'); // Giả sử thông tin người dùng lưu trong cookie có tên 'user'
	},
};
</script>

<style></style>
