<template>
	<div>
		Profile
		<Heatmap />
		{{ user }}
		{{ demo.name }}
		<input
			type="text"
			name=""
			id=""
			v-model="demo.name" />
	</div>
</template>

<script>
	import Heatmap from '@/components/Heatmap/Index.vue';
	import { useCookies } from '@vueuse/integrations/useCookies';
	import axios from 'axios';
	export default {
		components: { Heatmap },
		inject: ['pTitle'],
		data() {
			return {
				user: this.cookies.get('user'),
				demo: {
					name: 'haha',
					age: 20,
				},
			};
		},
		watch: {},
		methods: {
			async fetchUserdata() {
				await axios
					.get(`http://localhost:3000/api/user/${this.user.id}`)
					.then((response) => response.data)
					.then((data) => {
						this.user = { ...this.user, ...data };
					});
			},
		},
		async mounted() {
			await this.fetchUserdata();
			this.pTitle = 'Trang cá nhân';
		},
		setup() {
			const cookies = useCookies();
			return { cookies };
		},
	};
</script>

<style></style>
