<script lang="ts">
    let {name, price, rating, rate_count, pcs = $bindable(), img_url} =  $props();
    import Minus from "@lucide/svelte/icons/minus";
    import Plus from "@lucide/svelte/icons/plus";
    import { Button } from "$lib/components/ui/button/index.js";
    import * as ButtonGroup from "$lib/components/ui/button-group/index.js";

    function increment() {
        if (pcs >=20) return;
        pcs = Number(pcs) + 1;
        }

    function decrement() {
        if (pcs <=0) return;
        pcs = Number(pcs) - 1;
        }


</script>


<div class="flex w-full items-center mx-2">
    <div class="w-2/3">
        <img src={img_url} alt={name}  class="object-cover rounded-3xl h-28 w-40"/>
    </div>
    <div class="w-full pl-4 text-sm"> 
        <div class="text-xl font-bold"> {name} </div>
        <div class="text-xs mt-1"> ♥️ {rating} ({rate_count}) </div>
        <div class="text-sm mt-1">Pcs: {pcs} </div>
        <div class="mt-1 text-xl font-bold">₹{price}</div>

    </div >

        <ButtonGroup.Root
          orientation="vertical"
          aria-label="Media controls"
          class="h-fit w-1/3">
              <Button variant="outline" size="icon" onclick={increment}>
                <Plus />
              </Button>
              <Button variant="outline" size="icon" onclick={decrement}>
                <Minus />
              </Button>
        </ButtonGroup.Root>

</div>
