<script lang="ts">
	import './layout.css';

	let { children } = $props();
</script>

<div class="app">
<div class="min-h-screen, min-w-screen flex items-center justify-center bg-black">
    <container class="min-h-screen min-w-screen md:min-w-svh bg-[#D9D9D9] flex items-center justify-center">
	{@render children()}
    </container>
</div>

</div>

