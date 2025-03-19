import axios from "axios";
import { registerUserRoute } from "@/lib/apiRoutes";
export async function registerUser(params: any) {
  const { username, email, password } = params;
  const url = registerUserRoute;
  try {
    const res = await axios.post(url, { username, email, password });
  } catch (error) {
    console.error(error);
  }
}
