import UserContext from "@/context/UserContext";
import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Spinner from "@/components/ui/spinner";
import ChangePasswordDialog from "@/components/settings/change-password-dialog";
import UpdateAccountDetailsDialog from "@/components/settings/update-account-details-dialog";

export default function Settings() {
  const { user, loading } = useContext(UserContext);
  const navigate = useNavigate();
  useEffect(() => {
    if (!user && !loading) navigate("/login");
  }, [user, loading, navigate]);
  if (loading)
    return (
      <div className="p-8 text-lg gap-4 flex justify-center items-center">
        Loading data... <Spinner />
      </div>
    );
  if (!user) return null;

  return (
    <div className="p-8 max-w-[680px] mx-auto">
      <h1 className="text-4xl font-bold mb-6 md:mb-11">Settings</h1>

      <div className="border-b mb-6 md:mb-11" />

      <div className="flex flex-col gap-8">
        <UpdateAccountDetailsDialog user={user} />
        <ChangePasswordDialog email={user.email} />
      </div>
    </div>
  );
}
