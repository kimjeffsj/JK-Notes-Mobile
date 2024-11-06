import { useAppSelector } from "@/shared/hooks/useRedux";
import { Redirect } from "expo-router";

export default function Index() {
  const { user } = useAppSelector((state) => state.auth);

  return <Redirect href={user ? "/(app)/dashboard" : "/(auth)/login"} />;
}
