import { browser } from "$app/environment";
import { redirect } from "@sveltejs/kit";
import { PUBLIC_DOMAIN } from "$env/static/public";

export async function load() {
  if (browser) {
    if (!localStorage.getItem("token")) {
      throw redirect(401, "/login");
    }
    const res = await fetch(`${PUBLIC_DOMAIN}/api/v1/user/address`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("token") || "",
      },
    });
    const address = await res.json();
    return address;
  }
}
