import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { createOperation } from "@/services/operations";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useAuth } from "@/hooks/useAuth";

interface Props {
  parentId: string;
  parentType: "StartingNumber" | "Operation";
  className?: string;
  refresh?: () => void;
}
const OperationInput = ({
  parentId,
  parentType,
  className,
  refresh,
}: Props) => {
  const [value, setValue] = useState<number | "">("");
  const [operator, setOperator] = useState<"+" | "-" | "*" | "/">("+");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { isAuthenticated } = useAuth();

  const handleSubmit = async () => {
    if (!isAuthenticated) {
      return toast.info("You must be logged in to add an operation");
    }
    if (isNaN(value as number) || value === "")
      return toast.error("Please enter a valid number");

    try {
      setIsSubmitting(true);
      await createOperation({
        parentId,
        parentType,
        value: Number(value),
        operator,
      });
      toast.success("Operation added");
      setValue("");
      if (refresh) refresh();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to add operation"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={`flex gap-2 items-center px-4 ${className || ""}`}>
      <Select
        value={operator}
        onValueChange={(value) => setOperator(value as "+" | "-" | "*" | "/")}
      >
        <SelectTrigger className="w-16">
          <SelectValue placeholder="Operator" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="+">+</SelectItem>
          <SelectItem value="-">-</SelectItem>
          <SelectItem value="*">*</SelectItem>
          <SelectItem value="/">/</SelectItem>
        </SelectContent>
      </Select>
      <Input
        type="number"
        disabled={!isAuthenticated || isSubmitting}
        placeholder="Enter value"
        value={value}
        onChange={(e) =>
          setValue(e.target.value === "" ? "" : Number(e.target.value))
        }
      />
      <Button
        onClick={handleSubmit}
        disabled={!isAuthenticated || isSubmitting}
      >
        <Send />
        {isSubmitting && <span className="ml-1">...</span>}
      </Button>
    </div>
  );
};

export default OperationInput;
