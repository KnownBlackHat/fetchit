export function handleStatusCode(req: Response) {
  if (req.status === 401 || req.status === 403) {
    localStorage.removeItem("token");
    window.location.reload();
  }
}
