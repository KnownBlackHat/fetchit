import { browser } from "$app/environment";
import { redirect } from "@sveltejs/kit";

export function load() {
  if (browser) {
    if (!localStorage.getItem("token")) {
      throw redirect(401, "/login");
    }
  } else {
    console.error("No error found");
  }
}
