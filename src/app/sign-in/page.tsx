import SignIn from "@/components/Auth/Login";
import DefaultAuthLayout from "@/components/Auth/authLayout";

export default async function SignInPage() {
  return (
    <DefaultAuthLayout>
      <SignIn />
    </DefaultAuthLayout>
  );
}
