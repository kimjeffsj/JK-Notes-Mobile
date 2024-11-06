import { useAppSelector } from "@/shared/hooks/useRedux";
import { Redirect } from "expo-router";
import Dashboard from "./(app)/dashboard";

export default function Index() {
  const { user } = useAppSelector((state) => state.auth);

  return <Dashboard></Dashboard>;

  // <Redirect href={user ? "/(app)/dashboard" : "/(auth)/login"} />;
}
