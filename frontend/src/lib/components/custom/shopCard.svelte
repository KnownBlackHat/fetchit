<script lang="ts">
    let {title, rating, rating_count, address, img_url, total_seat, available_seat} = $props()
</script>

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
