<script lang="ts">
	let isHammenu_open = $state(false);
	import { fly } from 'svelte/transition';
	import { cubicOut } from 'svelte/easing';
</script>

<button id="h_button"
	onclick={() => {
		isHammenu_open = !isHammenu_open;
	}}>
</button>

{#if isHammenu_open}
	<div id="overlay" onclick={() => isHammenu_open = false}></div>
	<div id="side_menu" transition:fly={{ x: 100, duration: 200, easing: cubicOut }}>
		
		<div id="header">
			<div style="font-size: 1.4rem;">설정</div>
			<button id="x_button"
				onclick={() => {
					isHammenu_open = !isHammenu_open;
				}}>
			</button>
		</div>


	</div>
{/if}


<style>
	#overlay{
		position: fixed;
		top: 0; left: 0;
		width: 100vw; height: 100vh;
	}
	button {
		width: auto; height: 100%;
		aspect-ratio: 1/1;
		background-position: center;
		background-size: 80%;
		background-repeat: no-repeat;
	}
	#h_button{
		background-image: url("../lib/assets/h_menu.svg");
	}
	#x_button{
		background-image: url("../lib/assets/back.svg");
		transform: rotate(180deg);		
	}


	#header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding: 0.5rem;
		height: 3rem;
		border-bottom: 0.2rem solid gray;
	}
	#side_menu {
		padding: 1rem;
		width: 30rem; height: 100dvh;
		backdrop-filter: blur(0.2rem);
		background-color: rgba(0, 0, 0, 0.65);
		position: fixed;
		z-index: 999;
		top: 0; right: 0;
	}
	@media (orientation: portrait) {
		#side_menu {
			width: 100dvw;
		}	
	}
</style>
