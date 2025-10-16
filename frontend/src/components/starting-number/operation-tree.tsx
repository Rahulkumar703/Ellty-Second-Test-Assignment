import type { IOperationsTree } from "@/types";
import OperationInput from "./operation-input";
import { useState } from "react";
import { UserCircle2, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  operations: IOperationsTree[];
  refresh: () => void;
}

const OperationTree = ({ operations, refresh }: Props) => (
  <div className="ml-4 border-l pl-4 space-y-4">
    {operations.map((op) => (
      <OperationNode key={op._id} operation={op} refresh={refresh} />
    ))}
  </div>
);

const OperationNode = ({
  operation,
  refresh,
}: {
  operation: IOperationsTree;
  refresh: () => void;
}) => {
  const [showInput, setShowInput] = useState(false);

  const handleRefresh = () => {
    refresh();
    setShowInput(false);
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <p className="font-bold">
          {operation.operator} {operation.value} = {operation.result}
        </p>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <UserCircle2 className="size-4" />
          <span className="font-bold capitalize">
            {operation.author.username}
          </span>
        </div>
      </div>

      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowInput((prev) => !prev)}
        >
          <MessageCircle className="mr-1 size-4" />
          Comment
        </Button>
      </div>

      {showInput && (
        <div className="mt-2 group">
          <OperationInput
            parentId={operation._id}
            parentType="Operation"
            refresh={handleRefresh}
          />
        </div>
      )}

      {operation.children?.length > 0 && (
        <OperationTree operations={operation.children} refresh={refresh} />
      )}
    </div>
  );
};

export default OperationTree;
