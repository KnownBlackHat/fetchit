<script lang="ts">
    import SettingCard from "@/components/custom/settingCard.svelte";
    import Button from "@/components/ui/button/button.svelte";
    import { BookMarked, Headset, HeartIcon, History, LocationEdit,  LogOutIcon,  MessageCircleQuestionMark,  User, Wallet2 } from "lucide-svelte";
</script>
<div class="bg-white flex justify-between px-4 h-10 items-center text-sm font-bold">
    <div>
        Settings & Privacy
    </div>
</div>

<div class="mt-4 mx-2 space-y-8">
<SettingCard title="Your Information" items={[
    {title: "Edit Profile", icon: User, description: "Update your personal information"},
    {title: "Manage Addresses", icon: LocationEdit, description: "Update your delivery addresses"},
    {title: "Your favourites", icon: HeartIcon, description: "Your liked restaurants and dishes"},
    ]}/>

<SettingCard title="Orders" items={[
    {title: "History", icon: History, description: "View your past orders"},
    {title: "Wishlist", icon: BookMarked, description: "Your saved items for later"},
    ]}/>

<SettingCard title="Help & Support" items={[
    {title: "FAQs", icon: MessageCircleQuestionMark, description: "Some frequently asked questions"},
    {title: "Custom Support", icon: Headset, description: "24/7 Support for any issue"},
    ]}/>
</div>


<div class="text-center w-">
    <Button variant="destructive" size="lg" class="font-bold mt-6 w-[95%] rounded-3xl" ><LogOutIcon/> Logout</Button>
</div>
