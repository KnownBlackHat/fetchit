import { PUBLIC_DOMAIN } from "$env/static/public";
import { handleStatusCode } from "../helper";

const SHOP_ENDPOINT = `${PUBLIC_DOMAIN}/api/v1/shop/resturant`;

type RestaurantResponse = {
  restaurants: Restaurant[];
};

type Restaurant = {
  title: string;
  rating: number;
  rating_count: number;
  address: string;
  total_seat: number;
  available_seat: number;
  img_url: string;
};

// TODO: Limit the response in order to avoid mem leak
export async function getRestaurant() {
  let req = await fetch(SHOP_ENDPOINT, {
    headers: {
      authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
  handleStatusCode(req);
  const res: RestaurantResponse = await req.json();
  if (res.restaurants.length === 0) {
    return null;
  }
  return res.restaurants;
}
