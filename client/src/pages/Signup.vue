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
				<div class="form-group">
					<label
						class="block mb-2 text-black"
						for="avatar"
						>Ảnh đại diện</label
					>
					<input
						type="file"
						class="form-control w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-gray-300"
						id="avatar"
						@change="previewAvatar"
						accept="image/*" />
					<div
						v-if="avatar"
						class="mt-4">
						<img
							:src="avatar"
							alt="Avatar Preview"
							class="w-32 h-32 object-cover rounded-full mx-auto" />
					</div>
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
	import axios from 'axios';
	export default {
		components: {},
		data() {
			return {
				lastname: '',
				firstname: '',
				nickname: '',
				email: '',
				username: '',
				password: '',
				avatar: '',
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
				if (this.password !== this.rpassword) {
					this.message = 'Mật khẩu nhập lại không trùng khớp!';
					return false;
				}
				this.inLoad = true;
				let avatarUrl = '';
				if (this.avatar) {
					const formData = new FormData();
					formData.append('file', this.avatar);
					formData.append('upload_preset', 'upload_f');
					formData.append(
						'asset_folder',
						process.env.VITE_CLOUDINARY_FOLDER
					);

					try {
						const response = await axios.post(
							`https://api.cloudinary.com/v1_1/${
								import.meta.env.VITE_CLOUDINARY_NAME
							}/image/upload?upload_preset=upload_f`,
							formData
						);
						avatarUrl = response.data.secure_url;
					} catch (error) {
						console.error('🚀 ~ login ~ error:', error);
						this.message = 'Failed to upload avatar';
						this.inLoad = false;
						return;
					}
				}

				const signupInfo = {
					lastName: this.lastname,
					firstName: this.firstname,
					nickname: this.nickname,
					email: this.email,
					username: this.username,
					password: this.password,
					avatar: avatarUrl,
				};

				await fetch(`http://localhost:3000/api/auth/register`, {
					method: 'POST',
					headers: {
						'Content-Type': 'application/json',
					},
					body: JSON.stringify(signupInfo),
					credentials: 'include',
				})
					.then((response) => response.json())
					.then((data) => {
						this.inLoad = false;
						console.log('Đăng ký thành công!');
						this.$router.push('/login');
					})
					.catch((error) => {
						// Handle any errors
						this.message = error;
						console.error(error);
					});
			},
			previewAvatar(event) {
				const file = event.target.files[0];
				if (file) {
					const reader = new FileReader();
					reader.onload = (e) => {
						this.avatar = e.target.result;
					};
					reader.readAsDataURL(file);
				}
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
