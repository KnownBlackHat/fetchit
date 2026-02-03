<script lang="ts">
    import BottomNav from '@/components/custom/bottomNav.svelte';
    import * as Avatar from "$lib/components/ui/avatar/index.js";
    const { data, children } = $props();

</script>

<div class="w-full ">
<header class="flex justify-around items-center">
    <img src="/logo.png" alt="logo"/> 
    <div class="text-xs font-bold">
        <div>Address</div>
        <div class="font-extrabold">{data.line_1?? "Not Set"}</div>
    </div>
    <Avatar.Root class="size-12 rounded-full">
         <Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
         <Avatar.Fallback>CN</Avatar.Fallback>
    </Avatar.Root>
</header>

<main class="overflow-x-hidden overflow-y-scroll min-h-screen flex flex-col relative">
    {@render children()}
</main>
    <BottomNav/>
</div>
