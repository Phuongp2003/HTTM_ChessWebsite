<template>
	<div class="profile-container">
		<h1 class="profile-title">Trang cá nhân</h1>

		<!-- Hiển thị thông tin người dùng nếu có -->
		<div
			v-if="user"
			class="profile-card">
			<!-- Hiển thị và chọn avatar -->
			<div class="profile-avatar">
				<img
					:src="previewAvatar || user.avatar || defaultAvatar"
					alt="Avatar"
					class="avatar-image" />
			</div>

			<!-- Thông tin người dùng -->
			<div class="profile-details">
				<p>
					<strong>Họ và tên:</strong>
					{{
						user.firstName && user.lastName
							? user.lastName + ' ' + user.firstName
							: 'Chưa có thông tin'
					}}
				</p>
				<p>
					<strong>NickName:</strong>
					{{ user.nickname || 'Chưa có thông tin' }}
				</p>
				<p><strong>Elo:</strong> {{ user.elo }}</p>
			</div>
			<RouterLink to="/profile/update" class="button">Cập nhật thông tin người dùng</RouterLink>
		</div>

		<!-- Nếu chưa có dữ liệu người dùng, hiển thị thông báo -->
		<div v-else>
			<p>Đang tải thông tin người dùng...</p>
		</div>
	</div>
</template>
<script>
	import { useCookies } from '@vueuse/integrations/useCookies';

	export default {
		data() {
			return {
				user: null, // Chưa có thông tin người dùng ban đầu
			};
		},
		async mounted() {
			this.user = this.cookies.get('user');
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
