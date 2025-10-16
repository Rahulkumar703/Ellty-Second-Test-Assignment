import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { Link } from "react-router-dom";

const HomePage = () => {
  return (
    <section className="flex flex-col gap-6 w-full max-w-6xl mx-auto flex-1 items-center justify-center p-4 relative">
      <h1 className="text-6xl font-medium leading-16 text-center tracking-wide [word-spacing:0.1em]">
        Welcome to the <br />
        World of <span className="text-blue-600">Numbers</span>
      </h1>
      <p className="text-center text-xl">
        Explore the fascinating world of numbers with us!
      </p>
      <Link to="/starting-numbers" className="w-fit">
        <Button>
          Explore Numbers
          <MoveRight />
        </Button>
      </Link>
    </section>
  );
};

export default HomePage;
