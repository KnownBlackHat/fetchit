<script lang="ts">
    import ShopTypeCard from "$lib/components/custom/shopTypeCard.svelte";
    import ShopCard from "$lib/components/custom/shopCard.svelte";
    import * as InputGroup from "$lib/components/ui/input-group/index.js";
    import SearchIcon from "@lucide/svelte/icons/search";

    const mock_restaurant_data = [{
            title: "Monet Lounge and Bar",
            rating: 4.2,
            rating_count: 110,
            address: "CG 105, Ground Floor, Ansal Plaza",
            total_seat: 100,
            available_seat: 54,
            img_url: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D"
        },
        {
            title: "The Gourmet Kitchen",
            rating: 4.5,
            rating_count: 200,
            address: "123 Foodie St, Culinary City",
            total_seat: 80,
            available_seat: 30,
            img_url: "https://plus.unsplash.com/premium_photo-1661883237884-263e8de8869b?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D"
        },
        {
            title: "Café Delight",
            rating: 4.0,
            rating_count: 150,
            address: "456 Brew Ave, Coffee Town",
            total_seat: 60,
            available_seat: 20,
            img_url: "https://images.unsplash.com/photo-1498654896293-37aacf113fd9?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8Y2FmZSUyMHJlc3RhdXJhbnR8ZW58MHx8MHx8"
        },
        {
            title: "Bistro Bliss",
            rating: 4.3,
            rating_count: 180,
            address: "789 Gourmet Rd, Flavorville",
            total_seat: 90,
            available_seat: 40,
            img_url: "https://images.unsplash.com/photo-1525610553991-2bede1a236e2?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cmVzdGF1cmFudHxlbnwwfHwwfHx8MA%3D%3D"
        },
        {
            title: "Sushi Haven",
            rating: 4.6,
            rating_count: 220,
            address: "321 Ocean Blvd, Sashimi City",
            total_seat: 70,
            available_seat: 25,
            img_url: "https://images.unsplash.com/photo-1553621042-f6e147245754?fm=jpg&q=60&w=3000&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3VzaGklMjByZXN0YXVyYW50fGVufDB8fDB8fDA%3D"
        }
        ]

</script>

<div class="flex items-center justify-center flex-col mx-auto">
    <div>
        <div class="text-center font-bold">
            Chaos to,
        </div>
        <div class="text-center font-extrabold text-green-800 italic text-xl mb-10">
            Convenience!
        </div>
    </div>

<div class="flex space-x-6">
    <ShopTypeCard shopType="Den"/>
    <ShopTypeCard shopType="Canteen"/>
</div>
<div class="flex space-x-6 mt-4">
    <ShopTypeCard shopType="Ration"/>
    <ShopTypeCard shopType="Essential"/>
</div>

  <InputGroup.Root class="mt-2 bg-white text-black p-2 py-6">
    <InputGroup.Input placeholder="Search for anything" class="placeholder:text-gray-400"/>
    <InputGroup.Addon>
      <SearchIcon />
    </InputGroup.Addon>
    <InputGroup.Addon align="inline-end">12 results</InputGroup.Addon>
  </InputGroup.Root>

</div>
<div class="font-bold text-2xl tracking-wide ml-2 mt-4 md:text-center">
    Top restaurants to explore
</div>

<div class="mx-4 mt-6 space-y-4 md:mx-auto">
    {#each mock_restaurant_data as rest}
        <ShopCard 
            title={rest.title}
            rating={rest.rating}
            rating_count={rest.rating_count}
            address={rest.address}
            total_seat={rest.total_seat}
            available_seat={rest.available_seat}
            img_url={rest.img_url}
        />
    {/each}
</div>
