import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
  DrawerFooter,
  DrawerClose,
} from "@/components/ui/drawer";
import { Calendar, MessageCircle, Trash, UserCircle2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import OperationTree from "./operation-tree";
import OperationInput from "./operation-input";
import type { IStartingNumber } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { deleteStartingNumber } from "@/services/startingNumbers";
import { toast } from "sonner";
import { useState } from "react";

interface Props {
  number: IStartingNumber;
  refresh: () => void;
}

const StartingNumberCard = ({ number, refresh }: Props) => {
  const { user } = useAuth();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      const res = await deleteStartingNumber(number._id);
      toast[res.type](res.message);
      refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred while deleting the starting number."
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="shadow-xl border rounded-xl overflow-hidden">
      <article className="group p-4 w-full h-[70svh] flex items-center justify-center">
        <p className="font-bold text-7xl text-foreground/80 group-hover:text-foreground transition-colors">
          {number.value}
        </p>
      </article>
      <div className="flex justify-between items-center border-y p-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <UserCircle2 className="size-6" />
            <span className="font-bold capitalize">
              {number.author?.username || "Unknown"}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="size-4" />
            <span className="font-bold capitalize">
              {new Date(number.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>
        {user?._id && user._id === number.author?._id && (
          <Button
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
            className="ml-auto mr-2"
          >
            <Trash />
            {isDeleting && <span>...</span>}
          </Button>
        )}
        <Drawer activeSnapPoint={80}>
          <DrawerTrigger asChild>
            <Button variant="outline">
              <MessageCircle /> {number.operations.length}
            </Button>
          </DrawerTrigger>
          <DrawerContent className="max-w-4xl">
            <DrawerHeader>
              <DrawerTitle>Operations of {number.value}</DrawerTitle>
              <DrawerDescription className="capitalize">
                Created by: {number.author?.username || "Unknown"} | Created at:{" "}
                {new Date(number.createdAt).toLocaleDateString()}
              </DrawerDescription>
            </DrawerHeader>
            <ScrollArea className="h-[40svh] w-full p-4">
              {number.operations.length ? (
                <OperationTree
                  operations={number.operations}
                  refresh={refresh}
                />
              ) : (
                <p className="text-muted-foreground/40 text-center">
                  No operations yet.
                </p>
              )}
            </ScrollArea>
            <OperationInput
              parentId={number._id}
              parentType="StartingNumber"
              refresh={refresh}
            />
            <DrawerFooter>
              <DrawerClose asChild>
                <Button>Close</Button>
              </DrawerClose>
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};

export default StartingNumberCard;
