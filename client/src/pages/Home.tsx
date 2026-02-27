import { getErrorMessage } from "@/api/client";
import sessionApi from "@/api/sessionApi";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useSessions } from "@/hooks/useSessions";
import {
  ArrowRight,
  InfoIcon,
  Microscope,
  NotebookText,
  UploadIcon,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
// SESSION CARD
function SessionCard({
  createdAt,
  filename,
  chars,
  id,
}: {
  id: number;
  createdAt: string;
  filename: string;
  chars: string;
}) {
  const date = new Date(createdAt).toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "2-digit",
    year: "2-digit",
  });
  const minutes = Math.ceil(chars.length / (300 * 5));

  const readTime = minutes <= 10 ? minutes : Math.round(minutes / 5) * 5;
  const navigate = useNavigate();
  return (
    <Card
      className="w-full flex flex-row justify-between items-center group hover:border-primary/40 border-2 cursor-pointer group"
      onClick={() => {
        navigate(`/session/${id}/chat`);
      }}
    >
      <p
        className="ml-4 p-2 rounded-md 
       group-hover:bg-iconBg group-hover:text-primary bg-hover"
      >
        <NotebookText />
      </p>
      <CardHeader className="flex-1 p-0">
        <CardTitle className="group-hover:text-primary">{filename}</CardTitle>
        <CardDescription>Created on {date}</CardDescription>
      </CardHeader>

      <CardFooter>
        <p className="group-hover:text-primary text-muted-foreground text-sm">
          {readTime} min Read
        </p>
      </CardFooter>
    </Card>
  );
}

// HOME PAGE

function Home() {
  const navigate = useNavigate();
  const [uploading, setUploading] = useState<boolean>(false);
  const [alert, setAlert] = useState<string | null>(null);
  const sessions = useSessions();
  const inputRef = useRef<HTMLInputElement>(null);
  const handleFile = async (file: File) => {
    try {
      setUploading(true);
      const data = await sessionApi.uploadFile(file);
      setUploading(false);
      console.log(data.session.id);
      navigate(`/session/${data.session.id}/chat`);
    } catch (err) {
      setAlert(getErrorMessage(err));
      setUploading(false);
    }
  };
  useEffect(() => {
    const timeout = setTimeout(() => {
      setAlert(null);
    }, 2000);
    return () => {
      clearTimeout(timeout);
    };
  }, [alert]);
  return (
    <div className="max-w-7xl mt-3 flex flex-col items-center mx-auto">
      {alert && (
        <Alert className="absolute max-w-md top-[5vh] right-[2vw] bg-accent text-primary-foreground">
          <InfoIcon />
          <AlertTitle className="font-bold text-sm">Alert</AlertTitle>
          <AlertDescription className="text-primary-foreground">
            {alert}
          </AlertDescription>
        </Alert>
      )}
      <main className="pt-4 flex flex-col gap-6 w-full ">
        <div className="max-w-2xs md:max-w-full text-xl md:text-3xl  mx-auto ">
          <div className="flex flex-row items-center select-none gap-2 mb-4 justify-center ">
            <p className="bg-iconBg p-2 rounded-md ">
              <Microscope
                className=" shrink-0  group-data-[collapsible=icon]:mt-2  text-primary "
                size={24}
              />
            </p>
            <p className=" font-semibold font-sans leading-loose text-foreground tracking-tight">
              PaperWise
            </p>
          </div>
          <h1 className="font-bold text-4xl md:text-6xl text-primary font-sans tracking-tight text-center ">
            Research made simple.
          </h1>
          <p className="text-muted-foreground/60 text-base md:text-lg mt-2 text-center">
            Upload a paper to get insights and summary instantly.
            <br className="hidden md:block" /> Focus on understanding, not just
            reading
          </p>
        </div>
        <div className="w-full px-5 md:px-0 hover:-translate-y-0.5 transition-all duration-150 ease-in-out">
          {/* FILE UPLOAD CARD */}
          <input
            ref={inputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => {
              if (e.currentTarget.files) {
                handleFile(e.currentTarget.files[0]);
              } else {
                setAlert("File not Uploaded");
              }
            }}
          />
          <Card
            className="border-2 select-none cursor-pointer border-primary/10 bg-background hover:bg-[#eef5ff]/40 hover:dark:bg-[#0b1f3a]/20 shadow-none flex flex-col group items-center max-w-lg md:max-w-2xl mx-auto"
            onClick={() => {
              if (!uploading) {
                inputRef.current?.click();
              }
            }}
          >
            <CardHeader className="flex justify-center group-hover:scale-110">
              <CardTitle className="bg-[#eef5ff] dark:bg-[#0b1f3a] p-4 rounded-full">
                <UploadIcon size={30} className="text-primary" />
              </CardTitle>
            </CardHeader>

            <CardContent className="text-center flex-1">
              {!uploading ? (
                <>
                  {" "}
                  <h2 className="text-2xl ">Upload New Paper</h2>
                  <p className=" text-muted-foreground mt-px">
                    Drag & drop a PDF here to start analyzing or click to browse
                    your files.
                  </p>
                </>
              ) : (
                <h1 className="text-2xl font-semibold">Uploading...</h1>
              )}
            </CardContent>
            <CardFooter>
              <Button className="scale-115 font-bold cursor-pointer ">
                {!uploading ? "Start Session" : "Please Wait"}
                {uploading === false && (
                  <ArrowRight className="group-hover:-rotate-45 transition-all duration-200 ease-in-out" />
                )}
              </Button>
            </CardFooter>
          </Card>
        </div>
        <div className="w-full px-[8vw] mt-4">
          <div className="flex justify-between ">
            <p className="text-lg">Recent Sessions</p>
            <p className="text-muted-foreground hover:text-primary cursor-pointer">
              View All
            </p>
          </div>
          {sessions.length !== 0 ? (
            <div className="my-4 flex flex-col gap-4 ">
              {sessions.slice(0, 2).map((session) => {
                return (
                  <SessionCard
                    filename={session.document.filename}
                    key={session.id}
                    createdAt={session.createdAt}
                    chars={session.document.content}
                    id={session.id}
                  />
                );
              })}
            </div>
          ) : (
            <div className="mt-6">
              <h1 className="text-center text-2xl text-muted-foreground/50 ">
                No Recent Sessions Available
              </h1>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default Home;
