<script lang="ts">
    let {product_price, delivery_charge, convenience_fee} = $props();

</script>

<div class="mx-4">
    <div class="font-bold text-1xl mt-4 mb-2">Bill Details</div>
    <div class="text-slate-600 text-sm">
        <div class="flex justify-between w-full"> 
            <div>Product Price</div>
            <div>₹{product_price}</div>
        </div>
        <div class="flex justify-between w-full"> 
            <div>Delivery Charge</div>
            <div>₹{delivery_charge}</div>
        </div>
        <div class="flex justify-between w-full"> 
            <div>Convenience Fee</div>
            <div>₹{convenience_fee}</div>
        </div>

    </div>
    <hr class="mt-3"/>
    <div class="font-bold text-1xl mt-2 flex justify-between"> 
        <div>Amount To Pay </div>
        <div>₹{Number(product_price) + Number(delivery_charge) + Number(convenience_fee)}</div>
    </div>
</div>
