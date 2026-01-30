<script lang="ts">
    import { goto } from '$app/navigation';
    import { page } from '$app/stores';
    import { Salad, Van, ShoppingBasket, Settings} from 'lucide-svelte';

    const navItem = [
        {name: "Food", element: Salad, href: "/app"},
        {name: "Orders", element: Van, href: "/app/orders"},
        {name: "Cart", element: ShoppingBasket, href: "/app/cart"},
        {name: "Cart", element: Settings, href: "/app/setting"},
    ]

    console.log($page.url.pathname === navItem[0].href)
</script>

<footer class="bg-white fixed bottom-0 right-0 left-0 max-w-svh space-x-10 mx-auto w-full py-2 text-xs flex justify-evenly items-center">
    {#each  navItem as itm}
        <button class={`flex flex-col items-center justify-center ${$page.url.pathname === itm.href ? "text-yellow-800" : ""}`} onclick={() => goto(itm.href)}>
        <svelte:component this={itm.element}/>
            {itm.name}
        </button>
    {/each}

</footer>

