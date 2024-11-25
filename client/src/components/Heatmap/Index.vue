<script>
	export default {
		data() {
			return {
				heatmapData: this.generateHeatmapData(),
				rotatedHeatmapData: [],
			};
		},
		methods: {
			generateHeatmapData() {
				const heatmapData = Array.from({ length: 10 }, () =>
					Array.from({ length: 7 }, () => ({
						value: 0,
						date: '',
					}))
				);

				const currentDate = new Date();
				const currentDay = currentDate.getDay();
				const daysToMonday = currentDay === 0 ? 6 : currentDay - 1;
				const startOfWeek = new Date(currentDate);
				startOfWeek.setDate(currentDate.getDate() - daysToMonday);

				for (let col = 9; col >= 0; col--) {
					for (let row = 0; row < 7; row++) {
						const date = new Date(startOfWeek);
						date.setDate(
							startOfWeek.getDate() - (9 - col) * 7 + row
						);
						heatmapData[col][row].date = date.toLocaleDateString(
							'vi-VN',
							{
								day: '2-digit',
								month: 'long',
								year: 'numeric',
							}
						);
					}
				}

				return heatmapData;
			},
			rotateHeatmapData(data) {
				const rows = 7;
				const cols = 10;
				const rotatedData = Array.from({ length: rows }, () =>
					Array(cols).fill({ value: 0 })
				);

				for (let i = 0; i < rows; i++) {
					for (let j = 0; j < cols; j++) {
						rotatedData[i][j] = data[j][i];
					}
				}

				return rotatedData;
			},
			isToday(dateString) {
				const today = new Date().toLocaleDateString('vi-VN', {
					day: '2-digit',
					month: 'long',
					year: 'numeric',
				});
				return dateString === today;
			},
		},
		mounted() {
			this.heatmapData[9][2].value = 4;
			this.rotatedHeatmapData = this.rotateHeatmapData(this.heatmapData);
		},
	};
</script>

<template>
	<div
		id="heatmap"
		class="border border-black rounded bg-yellow-100 w-max">
		<table>
			<tbody>
				<tr
					v-for="(row, rowIndex) in rotatedHeatmapData"
					:key="rowIndex">
					<td
						v-for="(cell, colIndex) in row"
						:key="colIndex"
						:class="[
							'heatmap-cell w-[20px] h-[20px] border',
							isToday(cell.date)
								? 'border-black bg-blue-700'
								: 'border-yellow-100',
						]"
						:title="`${cell.date}: ${cell.value} trận`">
						<div
							class="flex items-center justify-center heatmap-cell-inner w-[20px] h-[20px] m-[1px]"
							:class="{
								'bg-green-600': cell.value >= 5,
								'bg-green-400':
									cell.value <= 4 && cell.value >= 2,
								'bg-green-300': cell.value === 1,
								'bg-gray-500': cell.value === 0,
							}"></div>
					</td>
				</tr>
			</tbody>
		</table>
	</div>
</template>

<style lang="scss" scope></style>
