<script lang="ts">
    import { Skeleton } from "$lib/components/ui/skeleton/index.js";
    let {title, rating, rating_count, address, img_url, total_seat, available_seat} = $props()
</script>

{#if title}
    <div class="flex w-full items-center">
        <div class="w-2/3">
            <img src={img_url} alt={title}  class="object-cover rounded-3xl h-28 w-40"/>
        </div>
        <div class="w-full pl-4 text-sm"> 
            <div class="text-xl font-bold"> {title} </div>
            <div class="text-xs mt-1"> ♥️ {rating} ({rating_count}) </div>
            <div class="mt-1">{address}</div>
            <div class="mt-1">Available Seat: {available_seat}/{total_seat}  </div>
        </div>
    </div>
{:else}
    <div class="flex w-full items-center">
        <div class="w-2/3">
            <Skeleton class="object-cover rounded-3xl h-28 w-40"/>
        </div>
        <div class="w-full pl-4 text-sm"> 
            <Skeleton class="text-xl font-bold w-[95%] h-7"/>
            <Skeleton class="text-xl font-bold w-[27%] h-4 mt-1"/>
            <Skeleton class="text-xl font-bold w-[80%] h-4 mt-1"/>
            <Skeleton class="text-xl font-bold w-[65%] h-4 mt-1"/>
            
        </div>
    </div>
{/if}
