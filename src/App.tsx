import { RouterProvider, createBrowserRouter } from "react-router-dom";
import SignUp from "./routes/sign-up";
import Dashboard from "./routes/dashboard";
import Header from "./components/section/Header";
import { Toaster } from "@/components/ui/sonner";
import UserContext from "./context/UserContext";
import useUser from "./hooks/useUser";

const router = createBrowserRouter([
  { path: "/", element: <Dashboard /> },
  { path: "/sign-up", element: <SignUp /> },
]);

function App() {
  const { user, loading } = useUser();

  return (
    <div>
      <UserContext.Provider value={{ user, loading }}>
        <Header />
        <RouterProvider router={router} />
      </UserContext.Provider>

      <Toaster />
    </div>
  );
}

export default App;
