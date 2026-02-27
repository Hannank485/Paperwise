import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Card,
  CardFooter,
  CardHeader,
  CardTitle,
  CardAction,
  CardDescription,
} from "@/components/ui/card";
import { useSessions } from "@/hooks/useSessions";
import { EllipsisVertical, FileXCorner, NotebookText } from "lucide-react";
import sessionApi from "@/api/sessionApi";
import { useNavigate } from "react-router";
function SessionCard({
  createdAt,
  filename,

  chars,
  valid,
  id,
}: {
  id: number;
  createdAt: string;
  filename: string;
  chars: string;
  valid: boolean;
}) {
  const handleDelete = async () => {
    await sessionApi.deleteSession(id);
  };
  const date = new Date(createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
  const minutes = Math.ceil(chars.length / (300 * 5));
  const navigate = useNavigate();
  const readTime = minutes <= 10 ? minutes : Math.round(minutes / 5) * 5;
  return (
    <Card
      className="min-w-0 w-xs md:w-sm group hover:border-primary/40 border-2 cursor-pointer group"
      onClick={() => {
        navigate(`/session/${id}/chat`);
      }}
    >
      <CardHeader>
        <p
          className=" p-2 rounded-md w-fit
       group-hover:bg-iconBg group-hover:text-primary bg-hover"
        >
          <NotebookText size={30} />
        </p>
        <CardTitle className="group-hover:text-primary">{filename}</CardTitle>
        <CardDescription>Created on {date}</CardDescription>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <CardAction
              className="hover:bg-hover p-2 rounded-md"
              onClick={(e) => {
                e.stopPropagation();
                console.log("hello2");
              }}
            >
              <EllipsisVertical />
            </CardAction>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-40" align="start">
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer hover:bg-destructive! hover:text-background!"
                onClick={() => {
                  handleDelete();
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardFooter className="flex flex-col w-full items-start gap-2">
        <p className="group-hover:text-primary text-muted-foreground text-sm">
          {readTime} min Read
        </p>
        <p
          className="text-xs px-3 rounded-xl py-0.5 "
          style={{ backgroundColor: valid ? "#DCFCE7" : "#FEE2E2" }}
        >
          {valid ? "Valid" : "Not Valid"}
        </p>
      </CardFooter>
    </Card>
  );
}

function Sessions() {
  const session = useSessions();

  return (
    <div className="max-w-7xl pt-3 flex flex-col items-center h-full mx-auto">
      <main className="p-4 flex flex-col gap-6 w-full h-full ">
        <div>
          <h1 className="font-bold text-3xl md:text-5xl text-primary font-sans tracking-tight text-center">
            Your Sessions
          </h1>
          <p className="text-muted-foreground/60 text-base md:text-lg mt-2 text-center">
            Manage your research sessions and papers.
          </p>
        </div>
        {session.length > 0 ? (
          <div className="grid md:grid-cols-3 grid-cols-1 gap-8 justify-items-center">
            {session.map((session) => {
              return (
                <SessionCard
                  filename={session.document.filename}
                  key={session.id}
                  createdAt={session.createdAt}
                  chars={session.document.content}
                  valid={session.document.isValid}
                  id={session.id}
                />
              );
            })}
          </div>
        ) : (
          <div className=" h-full flex items-center justify-center flex-col text-muted-foreground/40">
            <FileXCorner size={40} />

            <h1 className=" text-xl md:text-4xl  text-center">
              No sessions created yet
              <br /> Create one by uploading PDF on Homepage
            </h1>
          </div>
        )}
      </main>
    </div>
  );
}

export default Sessions;
