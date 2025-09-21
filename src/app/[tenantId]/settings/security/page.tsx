'use server'
import ClientSideSecurity from "./ClientSideSecurity";
import { getAPIkeys } from "@/app/actions/settings-actions";

const page =async () => {
  const apiKeys = await getAPIkeys();
  return <ClientSideSecurity apiKeysFromServer={apiKeys} />;
};

export default page;