import { Button } from "../shadcn/ui/button";
import { ScrollArea } from "../shadcn/ui/scroll-area";
import { Separator } from "../shadcn/ui/separator";
const tags = Array.from({ length: 50 }).map(
  (_, i, a) => `v1.2.0-beta.${a.length - i}`,
);
const MainPage = () => {
  return (
    <>
      <div className="container mx-auto px-10 py-6">
        <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
          DuckDNS-UI
        </h1>
        <Separator className="mt-4" />
        <div className="flex justify-end px-4 py-4">
          <Button>+ Add </Button>
        </div>

        <ScrollArea className="h-[70vh] rounded-md border">
          <div className="p-4">
            {tags.map((tag) => (
              <>
                <div key={tag} className="text-sm">
                  {tag}
                </div>
                <Separator className="my-2" />
              </>
            ))}
          </div>
        </ScrollArea>
      </div>
      <footer className="fixed bottom-0 py-6 w-screen px-10 2xl:px-[24%]">
        <Separator className="my-4" />
        <div className="text-muted-foreground text-sm text-gray-600">
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
    </>
  );
};

export default MainPage;
