import { Separator } from "../shadcn/ui/separator";

const MainFooter = () => {
  return (
    <footer className="fixed inset-x-0 bottom-0 mx-auto max-w-4xl py-6">
      <Separator className="my-4" />
      <div className="text-muted-foreground px-4 text-sm text-gray-600">
        2024 —{" "}
        <a
          href="https://github.com/akorzunin"
          target="_blank"
          rel="noopener noreferrer"
        >
          @akorzunin
        </a>
      </div>
    </footer>
  );
};

export default MainFooter;
