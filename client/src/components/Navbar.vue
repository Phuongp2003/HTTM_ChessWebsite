<script lang="ts"></script>

<template>
	<div
		id="navbar"
		class="overflow-x-hidden">
		<div
			class="flex items-center md:text-center justify-center h-16 bg-gray-900 min-w-[100%]">
			<slot />
			<span
				class="text-white flex-1 mt-[1%] font-bold uppercase text-nowrap"
				>PTD21 Chess</span
			>
		</div>
		<div class="flex flex-col flex-1 overflow-y-auto">
			<nav class="flex-1 px-2 py-4 bg-gray-800">
				<RouterLink
					to="/"
					class="flex items-center px-4 py-2 text-gray-100 hover:bg-gray-700">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						x="0px"
						y="0px"
						class="h-6 w-6 mr-2"
						viewBox="0,0,300,300">
						<g
							fill="#ffffff"
							fill-rule="nonzero"
							stroke="none"
							stroke-width="1"
							stroke-linecap="butt"
							stroke-linejoin="miter"
							stroke-miterlimit="10"
							stroke-dasharray=""
							stroke-dashoffset="0"
							font-family="none"
							font-weight="none"
							font-size="none"
							text-anchor="none"
							style="mix-blend-mode: normal">
							<g transform="scale(16,16)">
								<path
									d="M8,1.32031l-7.33984,6.8125l0.67969,0.73438l0.66016,-0.61328v5.74609h5v-5h2v5h5v-5.74609l0.66016,0.61328l0.67969,-0.73437zM8,2.67969l5,4.64844v5.67188h-3v-5h-4v5h-3v-5.67187z"></path>
							</g>
						</g>
					</svg>
					<div
						class="content overflow-hidden text-ellipsis whitespace-nowrap">
						Trang chủ
					</div>
				</RouterLink>
				<RouterLink
					to="/chess"
					class="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700">
					<svg
						class="h-6 w-6 mr-2 ml-[-1%]"
						fill="#FFF"
						version="1.1"
						id="_x32_"
						xmlns="http://www.w3.org/2000/svg"
						xmlns:xlink="http://www.w3.org/1999/xlink"
						viewBox="0 0 512 512"
						xml:space="preserve">
						<g>
							<path
								class="st0"
								d="M115.177,431.387h281.647c0,0,19.259-3.795,19.259-22.736c0-28.422-26.138-38.79-38.519-54.953
							c-52.275-65.603-48.468-225.342-48.468-225.342H182.904c0,0,3.809,159.739-48.492,225.342
							c-12.358,16.164-38.495,26.532-38.495,54.953C95.917,427.592,115.177,431.387,115.177,431.387z" />
							<polygon
								class="st0"
								points="329.096,108.397 374.714,79.863 374.714,0 320.178,0 320.178,43.359 281.659,43.359 281.659,0 
							230.317,0 230.317,43.359 191.822,43.359 191.822,0 137.261,0 137.261,79.863 182.904,108.397 	" />
							<polygon
								class="st0"
								points="115.177,451.348 99.479,477.78 99.479,512 412.521,512 412.521,477.78 396.824,451.348 	" />
						</g>
					</svg>
					<div
						class="content overflow-hidden text-ellipsis whitespace-nowrap">
						Đánh cờ vua
					</div>
				</RouterLink>
				<RouterLink
					to="/training"
					class="flex items-center px-4 py-2 mt-2 text-gray-100 hover:bg-gray-700">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						width="16"
						height="16"
						fill="currentColor"
						class="bi bi-lightbulb-fill w-6 h-6 mr-2"
						viewBox="0 0 16 16">
						<path
							d="M2 6a6 6 0 1 1 10.174 4.31c-.203.196-.359.4-.453.619l-.762 1.769A.5.5 0 0 1 10.5 13h-5a.5.5 0 0 1-.46-.302l-.761-1.77a2 2 0 0 0-.453-.618A5.98 5.98 0 0 1 2 6m3 8.5a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1l-.224.447a1 1 0 0 1-.894.553H6.618a1 1 0 0 1-.894-.553L5.5 15a.5.5 0 0 1-.5-.5" />
					</svg>
					<div
						class="content overflow-hidden text-ellipsis whitespace-nowrap">
						Luyện tập
					</div>
				</RouterLink>
			</nav>
			<RouterLink
				to="/learning"
				class="flex items-center px-6 py-4 mt-2 mb-2 text-gray-100 hover:bg-gray-700">
				<svg
					xmlns="http://www.w3.org/2000/svg"
					class="h-6 w-6 mr-2 bi bi-mortarboard"
					fill="currentColor"
					viewBox="0 0 16 16">
					<path
						d="M8.211 2.047a.5.5 0 0 0-.422 0l-7.5 3.5a.5.5 0 0 0 .025.917l7.5 3a.5.5 0 0 0 .372 0L14 7.14V13a1 1 0 0 0-1 1v2h3v-2a1 1 0 0 0-1-1V6.739l.686-.275a.5.5 0 0 0 .025-.917zM8 8.46 1.758 5.965 8 3.052l6.242 2.913z" />
					<path
						d="M4.176 9.032a.5.5 0 0 0-.656.327l-.5 1.7a.5.5 0 0 0 .294.605l4.5 1.8a.5.5 0 0 0 .372 0l4.5-1.8a.5.5 0 0 0 .294-.605l-.5-1.7a.5.5 0 0 0-.656-.327L8 10.466zm-.068 1.873.22-.748 3.496 1.311a.5.5 0 0 0 .352 0l3.496-1.311.22.748L8 12.46z" />
				</svg>
				<div
					class="content overflow-hidden text-ellipsis whitespace-nowrap">
					Làm quen với cờ vua
				</div>
			</RouterLink>
		</div>
	</div>
</template>

<style scoped lang="scss"></style>
