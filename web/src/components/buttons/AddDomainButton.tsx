import { SquarePlus } from "lucide-react";
import { Button } from "../../shadcn/ui/button";

const AddDomainButton = () => {
  return (
    <Button className="flex gap-2">
      <SquarePlus strokeWidth={0.8}/>
      Add
    </Button>
  );
};

export default AddDomainButton;
