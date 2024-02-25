import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import SignUp from "./routes/sign-up";
import Dashboard from "./routes/dashboard";
import Header from "./components/section/header";
import { Toaster } from "@/components/ui/sonner";
import UserContext from "./context/UserContext";
import useUser from "./hooks/useUser";
import Login from "./routes/login";
import BlogEdit from "./routes/blog-edit";
import BlogCreate from "./routes/blog-create";

const router = createBrowserRouter(
  [
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
        { path: "/posts/create", element: <BlogCreate /> },
        { path: "/posts/:postId/edit", element: <BlogEdit /> },
      ],
    },
  ],
  { basename: "/blog-api-cms" }
);

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
