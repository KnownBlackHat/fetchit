<script lang="ts">
    import { Input } from "$lib/components/ui/input/index";
    import * as Field from "$lib/components/ui/field/index";
    import { Button } from "$lib/components/ui/button/index";
    import * as Select from "$lib/components/ui/select/index";
    import { PUBLIC_DOMAIN } from "$env/static/public";
    import type { AuthResponse } from "../types";
    import { toast } from "svelte-sonner";
    import { goto } from "$app/navigation";
    let role: "admin"| "user" | "delivery" | "vendor"  = $state("user");

    let username = $state<string>();
    let password = $state<string>();
    let phone_no = $state<number>();
    let full_name = $state<string>();
    let img_url = $state<string>();
    let mail_id = $state<string>();
    let shop_name = $state<string>();
    let address = $state<string>();
    let rating = $state<number>();
    let rating_count = $state<number>();
    let gender = $state<'Male'| 'Female'>("Male");



    const roles = {
    user: [ {name:  "phone_no" , dtype: "number", state: phone_no}, {name:  "full_name" , dtype: "text", state: full_name}, {name:  "img_url" , dtype: "text", state: img_url}, {name:  "mail_id" , dtype: "text", state: mail_id},  {name:  "gender" , dtype: "text", state: gender} ],
    admin: [ {name:  "phone_no" , dtype: "number", state: phone_no} ],
    vendor: [ {name:  "shop_name" , dtype: "text", state: shop_name}, {name:  "address" , dtype: "text", state: address}, {name:  "rating" , dtype: "number", state: rating}, {name:  "rating_count" , dtype: "number", state: rating_count}, {name:  "phone_no" , dtype: "number", state: phone_no}, {name:  "img_url" , dtype: "text", state: img_url} ],
    delivery: [ {name:  "phone_no" , dtype: "number", state: phone_no}, {name:  "img_url" , dtype: "text", state: img_url} ],
    };

    async function signup() {
        toast.promise<AuthResponse>(
        async () => {
            const response: Record<string, unknown>= {}
            for (const item of roles[role] ) {
                    response[item.name] = item.state
                };
                response["role"] = role
                response["username"] = username
                response["password"] = password

            const res = await fetch(`${PUBLIC_DOMAIN}/api/v1/signup`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                      },
                    body: JSON.stringify(response)
                })

            if (res.status === 409) {
                throw new Error("User Already Exsists");
            }
            else if (res.status === 401) {
                throw new Error("Invalid Credentials");
            }
            else if (res.status !== 200) {
                throw new Error("Failed To Create Account");
            }

            const body = res.json();
            return body
            },
       {
           loading: "Creating Account...",
           success: (body) => {
               localStorage.setItem("token", body.token);
               setTimeout(() => goto("/") ,1000)
               return "Account Created Successfully!"
           },
           error: (e) =>  {
                if (e instanceof Error) {
                        return e.message
                    }
                    return "Unexpected error occurred"
                }
        } 
        )}



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
              <Select.Root type="single" name="role" bind:value={role}>
                  <Select.Trigger id="role" size="sm">
                  <span class="capitalize">{role}</span>
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
            <Input id="username" type="text" class="mt-6" required bind:value={username}/>
          </Field.Field>
                      {#each  roles[role] as ent }
                          <Field.Field class="relative">
                            <Field.Label class="text-md font-semibold absolute inset-0 bottom-8 left-1 capitalize" for={ent.name}>{ent.name.replace("_", " ")}</Field.Label>
                            <Input id={ent.name} type={ent.dtype}  class="mt-8" bind:value={ent.state} required/> 
                          </Field.Field>
                      {/each}
          <Field.Field class="relative">
            <Field.Label class="text-md font-semibold absolute inset-0 bottom-8 left-1" for="password">Password</Field.Label>
            <Input id="password" type="password"  class="mt-8" required bind:value={password} /> 
          </Field.Field>
          </div>
        </Field.Group>
      </Field.Set>

      <div class="text-center mt-4"><Button onclick={signup} variant="brown">Create Account</Button> </div>
      <div class="mt-4 text-sm font-bold text-center">Have an account? <a class="text-[#8C6D03] font-bold" href="/login">Login</a></div>
 </div>


