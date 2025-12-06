import { getUserSession } from "@/actions/auth";
import { redirect } from "next/navigation";

interface AdminAuthGuardProps {
  children: React.ReactNode;
}

export default async function AdminAuthGuard({
  children,
}: AdminAuthGuardProps) {
  const session = await getUserSession();

  if (!session || session.user.role !== "admin") {
    redirect("/unauthorized");
  }

  // useEffect(() => {
  //   const checkAdminAccess = async () => {
  //     try {
  //       const { data: session } = await authClient.getSession();
  //
  //       if (!session) {
  //         router.push("/unauthorized");
  //         return;
  //       }
  //
  //       // Check if user has admin role
  //       // @ts-expect-error - role is a custom field not in the default type
  //       if (session.user.role !== "admin") {
  //         router.push("/unauthorized");
  //         return;
  //       }
  //
  //       setIsAuthorized(true);
  //     } catch (error) {
  //       console.error("Error checking admin access:", error);
  //       router.push("/unauthorized");
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //
  //   checkAdminAccess();
  // }, [router]);
  //
  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen flex items-center justify-center">
  //       <div className="text-lg">Loading...</div>
  //     </div>
  //   );
  // }

  // if (!isAuthorized) {
  //   return null;
  // }

  return <>{children}</>;
}
