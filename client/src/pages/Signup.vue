<template>
	<div
		id="authorized"
		class="w-full flex h-screen bg-indigo-700">
		<div class="w-full max-w-xl m-auto bg-indigo-100 rounded p-5">
			<header>
				<h2
					class="text-bold text-indigo-700 font-bold text-2xl text-center mb-4">
					Đăng ký
				</h2>
			</header>
			<form @submit="login">
				<div class="form-group">
					<label
						class="block mb-2 text-black"
						for="lastname"
						>Họ</label
					>
					<input
						type="text"
						class="form-control w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-gray-300"
						id="lastname"
						v-model="lastname"
						required />
				</div>
				<div class="form-group">
					<label
						class="block mb-2 text-black"
						for="firstname"
						>Tên đệm và tên</label
					>
					<input
						type="text"
						class="form-control w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-gray-300"
						id="firstname"
						v-model="firstname"
						required />
				</div>
				<div class="form-group">
					<label
						class="block mb-2 text-black"
						for="nickname"
						>Biệt danh (sẽ sử dụng để hiển thị trong trận
						đấu)</label
					>
					<input
						type="text"
						class="form-control w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-gray-300"
						id="nickname"
						v-model="nickname"
						required />
				</div>
				<div class="form-group">
					<label
						class="block mb-2 text-black"
						for="email"
						>E-Mail</label
					>
					<input
						type="mail"
						class="form-control w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-gray-300"
						id="email"
						v-model="email"
						required />
				</div>

				<div class="form-group">
					<label
						class="block mb-2 text-black"
						for="username"
						>Tên tài khoản</label
					>
					<input
						type="text"
						class="form-control w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-gray-300"
						id="username"
						v-model="username"
						required />
				</div>
				<div class="form-group">
					<label
						class="block mb-2 text-black"
						for="password"
						>Mật khẩu</label
					>
					<input
						type="password"
						class="form-control w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-gray-300"
						id="password"
						v-model="password"
						required />
				</div>
				<div class="form-group">
					<label
						class="block mb-2 text-black"
						for="password"
						>Nhập lại mật khẩu</label
					>
					<input
						type="password"
						class="form-control w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-gray-300"
						id="rpassword"
						v-model="rpassword"
						required />
				</div>
				<div
					class="message"
					v-if="message != null && message != ''">
					{{ message }}
				</div>
				<button
					type="submit"
					class="w-full bg-indigo-700 hover:bg-pink-700 text-white font-bold py-2 px-4 mb-6 rounded">
					Đăng ký
				</button>
			</form>
			<footer>
				<span class="text-sm">Đã có tài khoản?</span>
				<RouterLink
					to="/login"
					class="text-indigo-700 hover:text-pink-700 text-sm">
					Đăng nhập
				</RouterLink>
			</footer>
		</div>
		<LoadingTransition v-if="inLoad" />
	</div>
</template>

<script>
	import { useCookies } from '@vueuse/integrations/useCookies';
	import { jwtDecode } from 'jwt-decode';
	export default {
		components: {},
		data() {
			return {
				username: '',
				password: '',
				inLoad: false,
				message: '',
				isVerified: false,
			};
		},
		setup() {
			const cookies = useCookies();
			return { cookies };
		},
		methods: {
			async login(event) {
				event.preventDefault();
				this.inLoad = true;

				const loginData = {
					username: this.username,
					password: this.password,
				};

				await fetch(`${this.serverUrl}/api/auth/login`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(loginData),
					credentials: 'include',
				})
					.then((response) => response.json())
					.then((data) => {
						this.inLoad = false;
						if (data.status === 200) {
							console.log('Đăng nhập thành công!');
						} else throw new Error(data.message);
						this.cookies.set('accessToken', data.accessToken, {
							path: '/admin',
							expires: new Date(
								new Date().getTime() + 60 * 60 * 1000
							), // 1 hour
						});
						this.cookies.set('refreshToken', data.refreshToken, {
							path: '/admin',
							expires: new Date(
								new Date().getTime() + 60 * 60 * 1000 * 24 * 7
							),
						});

						const accessToken = this.cookies.get('accessToken');

						const decodedToken = jwtDecode(accessToken);
						const user = {
							uid: decodedToken.uid,
							username: decodedToken.username,
							permissions: decodedToken.permissions,
						};
						this.cookies.set('user', JSON.stringify(user), {
							path: '/admin',
							expires: new Date(
								new Date().getTime() + 60 * 60 * 1000 * 24 * 7
							),
						});

						const refreshToken = this.cookies.get('refreshToken');

						if (!accessToken || !refreshToken) {
							throw new Error(
								'Lỗi đăng nhập, không nhận được token!'
							);
						}
						this.isVerified = true;
						this.$emit('login-success', username);
						console.log(
							'Đăng nhập thành công và token đã được lưu trong cookies'
						);
					})
					.catch((error) => {
						// Handle any errors
						this.message = error;
						console.error(error);
					});
			},
		},
	};
</script>

<style scoped>
	.container {
		max-width: 400px;
		margin: 0 auto;
		padding: 20px;
	}
</style>
