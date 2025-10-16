import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchStartingNumbers } from "@/services/startingNumbers";
import StartingNumberCard from "@/components/starting-number/starting-number-card";
import CreateStartingNumberForm from "@/components/starting-number/create-starting-number-form";
import type { IStartingNumber } from "@/types";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";

const StartingNumbers = () => {
  const [startingNumbers, setStartingNumbers] = useState<IStartingNumber[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const { isAuthenticated } = useAuth();

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetchStartingNumbers();
      setStartingNumbers(response.data || []);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "An unknown error occurred while fetching starting numbers."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  const handleFormSuccess = () => {
    setDialogOpen(false);
    fetchData(); // Refresh the list
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  if (loading) {
    return (
      <div className="w-full flex flex-col min-h-svh p-4 gap-4 max-w-6xl mx-auto">
        {/* Header skeleton */}
        <div className="flex justify-end">
          <Skeleton className="h-10 w-48" />
        </div>

        {/* Starting number cards skeleton */}
        {Array.from({ length: 3 }, (_, index) => (
          <div
            key={index}
            className="shadow-xl border rounded-xl overflow-hidden"
          >
            {/* Main number area skeleton */}
            <div className="p-4 w-full h-[70svh] flex items-center justify-center">
              <Skeleton className="h-20 w-40" />
            </div>

            {/* Footer area skeleton */}
            <div className="flex justify-between items-center border-y p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="size-6 rounded-full" />
                  <Skeleton className="h-4 w-24" />
                </div>
                <div className="flex items-center gap-2">
                  <Skeleton className="size-4 rounded-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
              <div className="flex gap-2">
                <Skeleton className="h-10 w-10" />
                <Skeleton className="h-10 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="w-full flex flex-col min-h-svh p-4 gap-4 max-w-6xl mx-auto">
      {isAuthenticated ? (
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="ml-auto">
              <Plus />
              Create Starting Number
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <CreateStartingNumberForm onSuccess={handleFormSuccess} />
          </DialogContent>
        </Dialog>
      ) : null}
      {startingNumbers.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center h-96 text-center">
          <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Plus className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No Starting Numbers Yet
          </h3>
          <p className="text-gray-500 mb-6">
            Create your first starting number to begin building calculation
            trees.
          </p>
          {isAuthenticated && (
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                <Button size="lg">
                  <Plus className="mr-2" />
                  Create Your First Number
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <CreateStartingNumberForm onSuccess={handleFormSuccess} />
              </DialogContent>
            </Dialog>
          )}
        </div>
      ) : (
        startingNumbers.map((number) => (
          <StartingNumberCard
            key={number._id}
            number={number}
            refresh={fetchData}
          />
        ))
      )}
    </div>
  );
};

export default StartingNumbers;
