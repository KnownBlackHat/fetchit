<script lang="ts">
const { data, children } = $props();
import { Salad, Van, ShoppingBasket, House, Settings} from 'lucide-svelte';
</script>

<div class="w-full relative">
<header class="flex justify-around items-center">
    <img src="./logo.png" alt="logo"/> 
    <div class="text-xs font-bold">
        <div>Address</div>
        <div class="font-extrabold">{data.line_1?? "Not Set"}</div>
    </div>
    <img class="size-12 rounded-full" alt="avatar" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaZnF8ElwCzCgHGTNVnaElToLnw3zE4AgEVQ&s" />
</header>

<main class="overflow-x-hidden overflow-y-scroll min-h-screen">
    {@render children()}
</main>

<footer class="bg-white fixed bottom-0 w-full py-2 text-xs flex justify-evenly items-center">
    <div>
        <Salad/>
        Food
    </div>
    <div>
        <Van/>
        Orders
    </div>
    <div>
        <House/>
        Home
    </div>
    <div>
        <ShoppingBasket/>
        Cart
    </div>
    <div>
        <Settings/>
        Setting
    </div>
</footer>

</div>
