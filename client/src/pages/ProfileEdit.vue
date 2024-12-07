<template>
	<div class="profile-container">
		<h1 class="profile-title">Trang cá nhân</h1>

		<!-- Hiển thị thông tin người dùng nếu có -->
		<div v-if="user" class="profile-card">
			<!-- Hiển thị và chọn avatar -->
			<div class="profile-avatar">
				<img :src="previewAvatar || user.avatar || defaultAvatar" alt="Avatar" class="avatar-image" />
				<label for="avatar-upload" class="avatar-upload-label">Thay đổi Avatar</label>
				<input
					type="file"
					id="avatar-upload"
					@change="previewAvatarChange"
					class="avatar-upload-input"
				/>
			</div>

			<!-- Thông tin người dùng -->
			<div class="profile-details">
				<p><strong>Họ và tên:</strong> {{ (user.firstName && user.lastName) ? user.lastName + ' ' + user.firstName : 'Chưa có thông tin' }}</p>
				<p><strong>NickName:</strong> {{ user.nickname || 'Chưa có thông tin' }}</p>
				<p><strong>Elo:</strong> {{ user.elo || 'Chưa có thông tin' }}</p>
			</div>
		</div>

		<!-- Nếu chưa có dữ liệu người dùng, hiển thị thông báo -->
		<div v-else>
			<p>Đang tải thông tin người dùng...</p>
		</div>
	</div>
</template>
<script>
	import { useCookies } from '@vueuse/integrations/useCookies';
	import axios from 'axios';

	export default {
		data() {
			return {
				user: null, // Chưa có thông tin người dùng ban đầu
				newPassword: '', // Mật khẩu mới
				confirmPassword: '', // Xác nhận mật khẩu
				changePassword: false, // Biến kiểm tra người dùng có chọn đổi mật khẩu không
				previewAvatar: null, // Biến lưu ảnh đại diện đã chọn (chưa upload)
				defaultAvatar: 'default-avatar.png', // Đường dẫn ảnh đại diện mặc định
			};
		},
		computed: {
			// Kiểm tra xem form có hợp lệ không (khi đổi mật khẩu)
			isFormValid() {
				const isPasswordValid = !this.changePassword || (this.newPassword && this.newPassword === this.confirmPassword);
				return isPasswordValid && this.user.firstName;
			},
		},
		methods: {
			// Lấy dữ liệu người dùng từ API
			async fetchUserdata() {
				const userCookie = this.cookies.get('user');
				if (!userCookie || !userCookie.id) {
					console.error('Không tìm thấy thông tin người dùng trong cookie.');
					return;
				}
				try {
					// Gọi API để lấy thông tin người dùng
					const response = await axios.get(`http://localhost:3000/api/user/${userCookie.id}`);
					this.user = response.data; // Cập nhật thông tin người dùng
				} catch (error) {
					console.error('Lỗi khi lấy dữ liệu người dùng:', error);
				}
			},

			// Hàm cập nhật ảnh đại diện khi chọn ảnh
			previewAvatarChange(event) {
				const file = event.target.files[0];
				if (file) {
					const reader = new FileReader();
					reader.onloadend = () => {
						this.previewAvatar = reader.result; // Lưu ảnh đại diện đã chọn
					};
					reader.readAsDataURL(file); // Đọc ảnh dưới dạng base64
				}
			},

			// Hàm upload ảnh đại diện
			uploadAvatar() {
				if (this.previewAvatar) {
					const formData = new FormData();
					formData.append('avatar', this.previewAvatar);
					axios.post(`http://localhost:3000/api/upload-avatar`, formData)
						.then((response) => {
							this.user.avatar = response.data.avatar; // Cập nhật ảnh đại diện mới
						})
						.catch((error) => {
							console.error('Lỗi khi tải ảnh lên:', error);
						});
				}
			},

			// Hàm cập nhật thông tin người dùng
			async updateUserInfo() {
				// Kiểm tra mật khẩu mới và xác nhận mật khẩu có giống nhau không
				if (this.changePassword && this.newPassword !== this.confirmPassword) {
					alert('Mật khẩu mới và xác nhận mật khẩu không khớp!');
					return;
				}

				const userData = {
					firstName: this.user.firstName,
					lastName: this.user.lastName,
					password: this.changePassword ? this.newPassword : '', // Mật khẩu mới
				};

				try {
					// Cập nhật thông tin người dùng (bao gồm tên và mật khẩu)
					await axios.put(`http://localhost:3000/api/user/${this.user.id}`, userData);
					alert('Thông tin đã được cập nhật!');
					this.fetchUserdata(); // Lấy lại thông tin người dùng sau khi cập nhật
				} catch (error) {
					console.error('Lỗi khi cập nhật thông tin:', error);
				}
			},

			// Toggle việc thay đổi mật khẩu
			toggleChangePassword() {
				this.changePassword = !this.changePassword;
			},
		},
		async mounted() {
			await this.fetchUserdata(); // Lấy dữ liệu người dùng khi component được tải
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
