<script lang="ts">
import ShopCard from "$lib/components/custom/shopCard.svelte";
</script>

<div class="flex items-center justify-center flex-col">
    <div>
        <div class="text-center font-bold">
            Chaos to,
        </div>
        <div class="text-center font-extrabold text-green-900 italic text-xl mb-10">
            Convenience!
        </div>
    </div>

<div class="flex space-x-6">
    <ShopCard shopType="Den"/>
    <ShopCard shopType="Canteen"/>
</div>
<div class="flex space-x-6 mt-4">
    <ShopCard shopType="Ration"/>
    <ShopCard shopType="Essential"/>
</div>
</div>
