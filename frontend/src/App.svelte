<script lang="ts">
    import { Input } from "$lib/components/ui/input/index.js";
    import * as Field from "$lib/components/ui/field/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
</script>

<div class="min-h-screen, min-w-screen flex items-center justify-center bg-black">
    <container class="min-h-screen min-w-screen md:min-w-svh bg-[#D9D9D9] flex items-center justify-center">
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
            <Field.Group class="">
              <Field.Field class="relative">
                <Field.Label class="text-md font-semibold absolute inset-0 bottom-6 left-1" for="username">Username</Field.Label>
                <Input id="username" type="text" class="mt-12"/>
              </Field.Field>
              <Field.Field class="relative">
                <Field.Label class="text-md font-semibold absolute inset-0 bottom-8 left-1" for="password">Password</Field.Label>
                <Input id="password" type="password"  class="mt-8"/> 
              </Field.Field>
            </Field.Group>
  </Field.Set>

      <div class="mt-4 text-sm font-bold text-right">Forgot Password? </div>
      <div class="text-center mt-4"><Button variant="brown">Login</Button> </div>
      <div class="mt-4 text-sm font-bold text-center">Don't have an account? <span class="text-[#8C6D03] font-bold">Signup</span></div>
         </div>
    </container>
</div>
