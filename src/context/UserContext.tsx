import { User } from "@/types/User";
import { createContext } from "react";

const UserContext = createContext<{ user: User | null; loading: boolean }>({
  user: null,
  loading: true,
});

export default UserContext;
