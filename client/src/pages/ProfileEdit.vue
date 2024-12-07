<template>
	<form
		v-if="user"
		@submit.prevent="submitChange"
		class="profile-card">
		<div class="profile-avatar form-group">
			<img
				:src="nUser.avatar || user.avatar"
				alt="Avatar"
				class="avatar-image" />
			<label
				for="avatar-upload"
				class="avatar-upload-label">
				Thay đổi Avatar
			</label>
			<input
				type="file"
				class="form-control w-full p-2 mb-6 text-indigo-700 border-b-2 border-indigo-500 outline-none focus:bg-gray-300"
				id="avatar-upload"
				@change="previewAvatar"
				accept="image/*"
				style="display: none" />
		</div>
		<div class="profile-details">
			<p>
				<strong>Họ và tên:</strong>
			</p>
			<div class="form-group">
				<label for="lastName">Họ:</label>
				<input
					type="text"
					id="lastName"
					v-model="nUser.lastName"
					placeholder="Nhập họ của bạn" />
			</div>
			<div class="form-group">
				<label for="firstName">Tên:</label>
				<input
					type="text"
					id="firstName"
					v-model="nUser.firstName"
					placeholder="Nhập tên của bạn" />
			</div>
			<div class="form-group">
				<label for="nickname">
					<p>
						<strong>NickName:</strong>
					</p>
				</label>
				<input
					type="text"
					id="nickname"
					v-model="nUser.nickname"
					placeholder="Biệt danh" />
			</div>
			<p><strong>Elo:</strong> {{ user.elo }}</p>
		</div>
		<button
			type="submit"
			class="button">
			Cập nhật thông tin người dùng
		</button>
	</form>
</template>

<script>
	import { useCookies } from '@vueuse/integrations/useCookies';
	import axios from 'axios';

	export default {
		data() {
			return {
				user: null, // Current user data
				nUser: {}, // New user data
				avatar: null, // Avatar file
				message: '',
				inLoad: false,
			};
		},
		methods: {
			previewAvatar(event) {
				const file = event.target.files[0];
				if (file) {
					this.avatar = file;
					const reader = new FileReader();
					reader.onload = (e) => {
						this.nUser.avatar = e.target.result;
					};
					reader.readAsDataURL(file);
				}
			},
			async submitChange() {
				// Compare nUser and user to find changes
				// Handle avatar upload if it has changed
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
						this.nUser.avatar = avatarUrl;
					} catch (error) {
						console.error('🚀 ~ submitChange ~ error:', error);
						this.message = 'Failed to upload avatar';
						this.inLoad = false;
						return;
					}
				}
				let changes = {};
				for (const key in this.nUser) {
					console.log(key);
					if (this.nUser[key] !== this.user[key]) {
						changes = { ...changes, [key]: this.nUser[key] };
					}
				}
				try {
					this.inLoad = true;
					await axios
						.put(
							`http://localhost:3000/api/user/${this.user.uid}`,
							changes
						)
						.then((res) => {
							this.cookies.remove('accessToken');
							this.cookies.remove('user');
							this.cookies.remove('refreshToken');
							window.location.href = '/login';
						});
					this.message = 'User information updated successfully';
					this.inLoad = false;
				} catch (error) {
					this.message = 'Failed to update user information';
					this.inLoad = false;
				}
			},
		},
		async mounted() {
			// Fetch user data and initialize nUser
			try {
				this.user = this.cookies.get('user');
				this.nUser = { ...this.user };
			} catch (error) {
				console.error('🚀 ~ mounted ~ error:', error);
				this.message = 'Failed to load user information';
			}
		},
		setup() {
			const cookies = useCookies();
			return { cookies };
		},
	};
</script>
<style scoped>
	.profile-container {
		padding: 20px;
		max-width: 800px;
		margin: 0 auto;
		background-color: #f9f9f9;
		border-radius: 8px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}

	.profile-title {
		text-align: center;
		font-size: 2rem;
		color: #333;
		margin-bottom: 20px;
	}

	.profile-card {
		padding: 20px;
		background-color: white;
		border-radius: 8px;
		box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
	}

	.profile-avatar {
		display: flex;
		flex-direction: column;
		align-items: center; /* Căn giữa theo chiều ngang */
		justify-content: center; /* Căn giữa theo chiều dọc */
		margin-bottom: 20px;
	}

	.avatar-image {
		width: 120px; /* Kích thước avatar lớn hơn */
		height: 120px; /* Kích thước avatar lớn hơn */
		border-radius: 50%; /* Đảm bảo ảnh vuông với góc bo tròn */
		object-fit: cover; /* Giữ tỷ lệ khung hình của ảnh */
	}

	.avatar-upload-label {
		margin-top: 10px;
		cursor: pointer;
		font-size: 16px;
		color: #007bff;
		text-decoration: underline;
	}

	.avatar-upload-input {
		display: none; /* Ẩn input file */
	}

	.profile-details {
		font-size: 1.1rem;
		margin-bottom: 20px;
	}

	.profile-edit {
		margin-top: 20px;
	}

	.form-group {
		margin-bottom: 15px;
	}

	.form-group label {
		font-size: 1rem;
		display: block;
		color: #333;
	}

	.form-group input {
		width: 100%;
		padding: 10px;
		border: 1px solid #ccc;
		border-radius: 5px;
		font-size: 1rem;
	}

	.btn-change-password {
		background-color: #f0ad4e;
		color: white;
		border: none;
		padding: 8px 12px;
		border-radius: 5px;
		cursor: pointer;
	}

	.btn-change-password:hover {
		background-color: #ec971f;
	}

	.btn-update {
		background-color: #5bc0de;
		color: white;
		border: none;
		padding: 10px 15px;
		border-radius: 5px;
		cursor: pointer;
	}

	.btn-update:disabled {
		background-color: #ccc;
		cursor: not-allowed;
	}

	/* Thêm các style cho mobile */
	@media (max-width: 768px) {
		.profile-container {
			padding: 10px;
		}
		.profile-title {
			font-size: 1.5rem;
		}
		.profile-card {
			padding: 15px;
		}
	}
</style>
