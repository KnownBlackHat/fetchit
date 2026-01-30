<script lang="ts">
    import { goto } from '$app/navigation';
const { data, children } = $props();
import { Salad, Van, ShoppingBasket, Settings} from 'lucide-svelte';
</script>

<div class="w-full ">
<header class="flex justify-around items-center">
    <img src="./logo.png" alt="logo"/> 
    <div class="text-xs font-bold">
        <div>Address</div>
        <div class="font-extrabold">{data.line_1?? "Not Set"}</div>
    </div>
    <img class="size-12 rounded-full" alt="avatar" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaZnF8ElwCzCgHGTNVnaElToLnw3zE4AgEVQ&s" />
</header>

<main class="overflow-x-hidden overflow-y-scroll min-h-screen flex flex-col relative">
    {@render children()}
</main>

<footer class="bg-white fixed bottom-0 right-0 left-0 max-w-svh space-x-10 mx-auto w-full py-2 text-xs flex justify-evenly items-center">
    <button class="flex flex-col items-center justify-center" onclick={() => goto('/app')}>
        <Salad/>
        Food
    </button>
    <button class="flex flex-col items-center justify-center" onclick={() => goto('/orders')}>
        <Van/>
        Orders
    </button>
    <button class="flex flex-col items-center justify-center" onclick={() => goto('/cart')}>
        <ShoppingBasket/>
        Cart
    </button>
    <button class="flex flex-col items-center justify-center" onclick={() => goto('/setting')}>
        <Settings/>
        Setting
    </button>
</footer>

</div>
