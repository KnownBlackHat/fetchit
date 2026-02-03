<script>
    import { Trash2Icon } from "lucide-svelte";
    import ItemCard from "@/components/custom/itemCard.svelte";
    import Bill from "@/components/custom/bill.svelte";
    import Button from "@/components/ui/button/button.svelte";

    let mock_items = $state([
                {
                    name: "Classic Chicken Burger",
                    price: 250.00,
                    rating: 4.2,
                    rate_count: 251,
                    pcs: 1,
                    img_url: "https://media.istockphoto.com/id/1309352410/photo/cheeseburger-with-tomato-and-lettuce-on-wooden-board.jpg?s=612x612&w=0&k=20&c=lfsA0dHDMQdam2M1yvva0_RXfjAyp4gyLtx4YUJmXgg="
                },
                {
                    name: "Veggie Delight Pizza",
                    price: 300.00,
                    rating: 4.5,
                    rate_count: 180,
                    pcs: 2,
                    img_url: "https://media.istockphoto.com/id/1309352410/photo/cheeseburger-with-tomato-and-lettuce-on-wooden-board.jpg?s=612x612&w=0&k=20&c=lfsA0dHDMQdam2M1yvva0_RXfjAyp4gyLtx4YUJmXgg="
                },
                {
                    name: "Spaghetti Bolognese",
                    price: 220.00,
                    rating: 4.3,
                    rate_count: 300,
                    pcs: 1,
                    img_url: "https://media.istockphoto.com/id/1309352410/photo/cheeseburger-with-tomato-and-lettuce-on-wooden-board.jpg?s=612x612&w=0&k=20&c=lfsA0dHDMQdam2M1yvva0_RXfjAyp4gyLtx4YUJmXgg="
                },
                ]);

    let product_price = $derived(mock_items.reduce((total_price, itm) => total_price + (itm.price * itm.pcs), 0));
    let itemCount = $derived(mock_items.reduce((acc, itm) => acc + itm.pcs, 0))


</script>
<div class="bg-white flex justify-between px-4 h-10 items-center text-sm font-bold">
    <div>
        Cart ({itemCount} items)
    </div>
    <div class="text-[#FF0000] flex items-center">
        <Trash2Icon class='h-5'/>
        Clear Cart
    </div>
</div>

<div class="mt-6 space-y-4">
    {#each mock_items as item}
        <ItemCard 
            name={item.name}
            price={item.price}
            rating={item.rating}
            rate_count={item.rate_count}
            bind:pcs={item.pcs}
            img_url={item.img_url}
        />
    {/each}
    <hr/>
</div>

<Bill {product_price} delivery_charge=20 convenience_fee=10/>
<div class="text-center">
    <Button variant="outline" size="lg" class="font-bold mt-6 w-[80%] rounded-3xl" >Proceed To Checkout</Button>
</div>
