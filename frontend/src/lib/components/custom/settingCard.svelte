<script lang="ts">
    import { ArrowRightIcon, User } from "lucide-svelte";

    let {title, items} = $props();
</script>

<div class="border-1 border-slate-300 rounded-2xl bg-white">
    <div class="border-b-1 px-4 py-2 text-lg font-bold">
        {title}
    </div>
    <div class="text-sm">
        {#each items as item}
            <div class="border-b-1 flex justify-between py-2 mx-4 items-center">
                <div class="flex w-full">
                    <div class="text-amber-300 border-1 rounded-full flex items-center w-[10%] text-center justify-center">
                        <item.icon/>
                    </div>
                    <div class="mx-4">
                        {item.title}
                        <div class="text-xs">
                        {item.description}
                        </div>
                    </div>
                </div>
                <div class="text-slate-400">
                    <ArrowRightIcon/>
                </div>
            </div>
        {/each}
    </div>
</div>
