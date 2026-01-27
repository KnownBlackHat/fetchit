<script lang="ts">
const { data } = $props();
</script>

<div class="w-full">
<header class="flex justify-around items-center">
    <img src="./logo.png" alt="logo"/> 
    <div class="text-xs font-bold">
        <div>Address</div>
        <div>{data.line_1?? "Not Set"}</div>
    </div>
    <img class="size-12 rounded-full" alt="avatar" src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQaZnF8ElwCzCgHGTNVnaElToLnw3zE4AgEVQ&s" />
</header>

<main>
    i m main
</main>

<footer>
    i m footer
</footer>
</div>
