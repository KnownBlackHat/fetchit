<script lang="ts">
	import './layout.css';
    import { Toaster } from "$lib/components/ui/sonner/index";

	let { children } = $props();
</script>

<Toaster position="top-center"/>
<div class="app">
<div class="min-h-screen, min-w-screen flex items-center justify-center bg-black">
    <container class="min-h-screen min-w-screen md:min-w-svh bg-[#D9D9D9] flex ">
	{@render children()}
    </container>
</div>

</div>

