import { useAppSelector } from "@/shared/hooks/useRedux";
import { Redirect } from "expo-router";

export default function Index() {
  const { user } = useAppSelector((state) => state.auth);

  if (user) {
    return <Redirect href="/(app)/dashboard" />;
  }

  return <Redirect href="/(public)/welcome" />;
}
