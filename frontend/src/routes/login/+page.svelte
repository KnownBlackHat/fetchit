<script lang="ts">
    import { Input } from "$lib/components/ui/input/index";
    import * as Field from "$lib/components/ui/field/index";
    import { Button } from "$lib/components/ui/button/index";
    import * as Select from "$lib/components/ui/select/index";
    import { PUBLIC_DOMAIN } from '$env/static/public';
    import { toast } from "svelte-sonner";
    import type { AuthResponse } from "../types";
    import { goto } from "$app/navigation";

    let role = $state("user");
    let username = $state();
    let password = $state();

    function login() {
        toast.promise<AuthResponse>(
        async () => {

            const res = await fetch(`${PUBLIC_DOMAIN}/api/v1/signin`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                      },
                    body: JSON.stringify({
                            username,
                            password,
                            role
                        })
                });

            if (res.status === 401) {
                throw new Error("User Not Found");
            }

            else if (res.status !== 200) {
                throw new Error("Failed to login");
            }

            const body = res.json();
            
            return body

            },
            {
                loading: "Logging in...",
                success: (body) => {
                    localStorage.setItem("token", body.token);
                   setTimeout(() => goto("/") ,1000)
                    return "Logged In!"
                    },
                    error: (e) =>  {
                        if (e instanceof Error) {
                                return e.message
                            }
                            return "Unexpected error occurred"
                        }
                }
        );

        }

</script>

<div class="w-[80%] md:w-1/3 bg-[#FFFFFF] p-4 rounded-4xl relative pt-20 pb-6">

     <div class="flex w-full font-extrabold uppercase tracking-wider text-md">
     <img src="logo.png" alt="logo" class="absolute inset-0 top-6 left-1"/>
         <div class="w-1/2 flex items-center">
             <div class="bg-black border-1 border-black w-4/5">
             </div>
         </div>
         Login
         <div class="w-1/2 flex items-center justify-end">
             <div class="bg-black border-1 border-black w-4/5">
             </div>
         </div>
     </div>

     <Field.Set>
        <Field.Group class="relative">

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
                      <Select.Item value="delivery_agent">delivery_agent</Select.Item>
                  </Select.Content>
              </Select.Root>
              </div>
          </Field.Field>

          <Field.Field>
            <Field.Label class="text-md font-semibold absolute inset-0 bottom-16 left-1" for="username">Username</Field.Label>
            <Input id="username" type="text" class="mt-6" bind:value={username}/>
          </Field.Field>
          <Field.Field class="relative">
            <Field.Label class="text-md font-semibold absolute inset-0 bottom-8 left-1" for="password">Password</Field.Label>
            <Input id="password" type="password"  class="mt-8" bind:value={password}/>
          </Field.Field>
        </Field.Group>
      </Field.Set>

      <div class="mt-4 text-sm font-bold text-right">Forgot Password? </div>
      <div class="text-center mt-4"><Button onclick={login}  variant="brown">Login</Button> </div>
      <div class="mt-4 text-sm font-bold text-center">Don't have an account? <a class="text-[#8C6D03] font-bold" href="/signup">Signup</a></div>
 </div>

