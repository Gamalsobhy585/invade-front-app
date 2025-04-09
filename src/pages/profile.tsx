import UserForm from "@/features/user/userForm";
import { Helmet } from "react-helmet";

function Profile() {
  return (
    <>
      <Helmet>
        <title>Profile</title>
      </Helmet>
      <div className="bg-white p-3 rounded-lg">
        <UserForm />
      </div>
    </>
  );
}

export default Profile;
