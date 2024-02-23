import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import SignUp from "./routes/sign-up";
import Dashboard from "./routes/dashboard";
import Header from "./components/section/header";
import { Toaster } from "@/components/ui/sonner";
import UserContext from "./context/UserContext";
import useUser from "./hooks/useUser";
import Login from "./routes/login";

const router = createBrowserRouter([
  {
    element: (
      <>
        <Header />
        <Outlet />
      </>
    ),
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/sign-up", element: <SignUp /> },
      { path: "/login", element: <Login /> },
    ],
  },
]);

function App() {
  const { user, loading } = useUser();

  return (
    <div>
      <UserContext.Provider value={{ user, loading }}>
        <RouterProvider router={router} />
      </UserContext.Provider>

      <Toaster />
    </div>
  );
}

export default App;
