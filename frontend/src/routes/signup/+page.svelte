<script lang="ts">
    import { Input } from "$lib/components/ui/input/index";
    import * as Field from "$lib/components/ui/field/index";
    import { Button } from "$lib/components/ui/button/index";
    import * as Select from "$lib/components/ui/select/index";
    let value: "admin"| "user" | "delivery" | "vendor"  = $state("user");
    const roles = {
    user: [ {name: "phone_no", dtype: "number"}, {name: "full_name", dtype: "text"}, {name: "img_url", dtype: "text"}, {name: "mail_id", dtype: "text"},  {name: "gender", dtype: "text"} ],
    admin: [ {name: "phone_no", dtype: "number"} ],
    vendor: [ {name: "shop_name", dtype: "text"}, {name: "address", dtype: "text"}, {name: "rating", dtype: "text"}, {name: "rating_count", dtype: "text"}, {name: "phone_no", dtype: "number"}, {name: "img_url", dtype: "text"} ],
    delivery: [ {name: "phone_no", dtype: "number"}, {name: "img_url", dtype: "text"} ],
    };
</script>

<div class="w-[80%] md:w-1/3 bg-[#FFFFFF] p-4 rounded-4xl relative pt-20 pb-6">

     <div class="flex w-full font-extrabold uppercase tracking-wider text-md">
     <img src="logo.png" alt="logo" class="absolute inset-0 top-6 left-1"/>
         <div class="w-1/2 flex items-center">
             <div class="bg-black border-1 border-black w-4/5">
             </div>
         </div>
         SignUp
         <div class="w-1/2 flex items-center justify-end">
             <div class="bg-black border-1 border-black w-4/5">
             </div>
         </div>
     </div>

     <Field.Set>
        <Field.Group >

          <Field.Field>
              <div class="flex items-center space-x-2 justify-end mt-4 z-10">
              <div class="text-sm">Role</div>
              <Select.Root type="single" name="role" bind:value>
                  <Select.Trigger id="role" size="sm">
                  <span class="capitalize">{value}</span>
                  </Select.Trigger>
                  <Select.Content>
                      <Select.Item value="user">User</Select.Item>
                      <Select.Item value="vendor">Vendor</Select.Item>
                      <Select.Item value="delivery">Delivery</Select.Item>
                      <Select.Item value="admin">Admin</Select.Item>
                  </Select.Content>
              </Select.Root>
              </div>
          </Field.Field>
        <div class="overflow-y-scroll overflow-x-hidden h-[30vh]" >
          <Field.Field class="relative">
            <Field.Label class="text-md font-semibold absolute inset-0 bottom-10 left-1" for="username">Username</Field.Label>
            <Input id="username" type="text" class="mt-6"/>
          </Field.Field>
                      {#each  roles[value] as ent }
                          <Field.Field class="relative">
                            <Field.Label class="text-md font-semibold absolute inset-0 bottom-8 left-1 capitalize" for={ent.name}>{ent.name.replace("_", " ")}</Field.Label>
                            <Input id={ent.name} type={ent.dtype}  class="mt-8"/> 
                          </Field.Field>
                      {/each}
          <Field.Field class="relative">
            <Field.Label class="text-md font-semibold absolute inset-0 bottom-8 left-1" for="password">Password</Field.Label>
            <Input id="password" type="password"  class="mt-8"/> 
          </Field.Field>
          <Field.Field class="relative">
            <Field.Label class="text-md font-semibold absolute inset-0 bottom-8 left-1" for="confirm_password">Confirm Password</Field.Label>
            <Input id="confirm_password" type="password"  class="mt-8"/> 
          </Field.Field>
          </div>
        </Field.Group>
      </Field.Set>

      <div class="text-center mt-4"><Button variant="brown">Create Account</Button> </div>
      <div class="mt-4 text-sm font-bold text-center">Have an account? <a class="text-[#8C6D03] font-bold" href="/login">Login</a></div>
 </div>


