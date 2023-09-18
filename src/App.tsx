import { RouterProvider, createBrowserRouter } from "react-router-dom";
import SignUp from "./routes/sign-up";
import Dashboard from "./routes/dashboard";

const router = createBrowserRouter([
  { path: "/", element: <Dashboard /> },
  { path: "/sign-up", element: <SignUp /> },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
