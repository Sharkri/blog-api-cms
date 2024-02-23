import { User } from "@/types/User";
import axios from "axios";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";

export default function useUser() {
  const token = Cookies.get("token");
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<null | User>(null);

  useEffect(() => {
    const getUserByToken = async () => {
      setLoading(true);
      if (token) {
        const { VITE_API_URL } = import.meta.env;

        try {
          const res = await axios.get(`${VITE_API_URL}/api/users`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data);
        } catch (error) {
          console.error(error);
        }
      }

      setLoading(false);
    };

    getUserByToken();
  }, [token]);

  return { loading, user };
}
