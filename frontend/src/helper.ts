import { toast } from "svelte-sonner";

export function handleStatusCode(req: Response) {
  if (req.status === 401 || req.status === 403) {
    toast.error("Authenticate Again!!");
    localStorage.removeItem("token");
    window.location.reload();
  } else if (req.status === 400) {
    toast.warning("Bad Request");
  } else if (req.status === 409) {
    toast.info("Data already exsits");
  }
}
