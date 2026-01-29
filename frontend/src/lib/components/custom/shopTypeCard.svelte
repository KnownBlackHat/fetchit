<script lang="ts">
    let {shopType} = $props()
</script>

<div class="border-2 rounded-2xl h-[11vh] w-[20vh] text-center items-center justify-center flex flex-col bg-[#F8F8F8] text-md font-bold">
    <img src="./den.png" alt="shop_type" class="pb-1"/>
    {shopType}
</div>
