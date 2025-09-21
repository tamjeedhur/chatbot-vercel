
import SignUp from '../../components/Auth/SignUp';
import DefaultAuthLayout from '@/components/Auth/authLayout';

export default async function SignUpPage() {
  return (
    <DefaultAuthLayout>
      <SignUp />
    </DefaultAuthLayout>
  );
}

export const dynamic = "force-dynamic";
