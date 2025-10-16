import { Link } from "react-router-dom";
import { Button } from "./ui/button";
import { useAuth } from "@/hooks/useAuth";
import { LogOut, User } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

const Header = () => {
  const { user, isAuthenticated, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  if (isLoading) {
    return (
      <header className="sticky top-0 z-10 bg-background flex w-full items-center justify-between p-6 shadow">
        <nav>
          <ul className="flex items-center gap-6">
            <li>
              <Skeleton className="w-20 h-8" />
            </li>
            <li>
              <Skeleton className="w-16 h-10 rounded-md" />
            </li>
          </ul>
        </nav>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-10 bg-background flex w-full items-center justify-between p-6 shadow">
      <Link
        to="/"
        className="font-black p-4 rounded-xl shadow-md border hover:shadow-sm transition hover:text-blue-600"
      >
        Num
      </Link>
      <nav>
        <ul className="flex items-center gap-6">
          {isAuthenticated ? (
            <>
              <li className="flex items-center gap-2">
                <User className="w-4 h-4" />
                <span className="text-sm">{user?.username}</span>
              </li>
              <li>
                <Button
                  onClick={handleLogout}
                  variant={"destructive"}
                  size={"icon"}
                  className="cursor-pointer"
                >
                  <LogOut />
                </Button>
              </li>
            </>
          ) : (
            <>
              <li>
                <Link to="/login">
                  <Button
                    variant={"ghost"}
                    size={"lg"}
                    className="cursor-pointer"
                  >
                    Login
                  </Button>
                </Link>
              </li>
              <li>
                <Link to="/signup">
                  <Button
                    size={"lg"}
                    variant={"default"}
                    className="cursor-pointer"
                  >
                    Sign Up
                  </Button>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

export default Header;
