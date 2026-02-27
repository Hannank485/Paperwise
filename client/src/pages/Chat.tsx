import sessionApi from "@/api/sessionApi";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Bot, InfoIcon, SendHorizontal, User } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Session } from "@/hooks/useSessions";
import { Button } from "@/components/ui/button";
function Chat() {
  const navigate = useNavigate();
  const [session, setSession] = useState<Session>();
  const [alert, setAlert] = useState<string | null>(null);
  const params = useParams();
  const id = Number(params.id);
  useEffect(() => {
    async function getSession(id: number) {
      const data = await sessionApi.getSingleSession(id);
      setSession(data);
      if (!data?.document.isValid) {
        setAlert(
          "The PDF FAILED Credibility Check, the Assistant may not work as intended!",
        );
      }
      console.log(data);
    }
    getSession(id);
  }, [id]);
  useEffect(() => {
    const timeout = setTimeout(() => {
      setAlert(null);
    }, 3000);
    return () => {
      clearTimeout(timeout);
    };
  }, [alert]);

  return (
    <main className="flex flex-col h-full bg-sidebar">
      {alert && (
        <Alert className="absolute max-w-sm top-[5vh] right-[2vw] bg-destructive text-primary-foreground">
          <InfoIcon />
          <AlertTitle className="font-bold text-sm">Alert</AlertTitle>
          <AlertDescription className="text-primary-foreground">
            {alert}
          </AlertDescription>
        </Alert>
      )}
      <div className="w-full flex py-2 bg-sidebar border-b items-center px-2 justify-between">
        <p
          className="p-2 rounded-md hover:bg-hover cursor-pointer"
          onClick={() => {
            navigate("/session");
          }}
        >
          <ArrowLeft />
        </p>
        <p className="flex-1 text-center font-bold ">
          {session ? session.document.filename : ""}
        </p>
      </div>
      <div className="flex flex-col justify-between h-full max-w-3xl mx-auto w-full">
        <div className="bg-sidebar flex-1 flex flex-col h-full pt-4">
          {session?.messages.map((msg, index) => {
            return (
              <div
                className="flex flex-row gap-4 items-center"
                style={{
                  alignSelf:
                    session.messages[index].role === "user"
                      ? "flex-end"
                      : "flex-start",
                  flexDirection:
                    session.messages[index].role === "user"
                      ? "row-reverse"
                      : "row",
                }}
              >
                <Avatar size="default">
                  <AvatarFallback>
                    {session.messages[index].role === "user" ? (
                      <User />
                    ) : (
                      <Bot />
                    )}
                  </AvatarFallback>
                </Avatar>
                <p key={msg.id} className=" bg-iconBg p-4 rounded-md">
                  {session.messages[index].content}
                </p>
              </div>
            );
          })}
        </div>
        <form
          className="bg-sidebar py-10 px-4 flex items-center justify-center"
          onSubmit={(e: React.SubmitEvent) => {
            e.preventDefault();
            e.target.reset();
          }}
        >
          <div className="relative max-w-3xl w-full   rounded-2xl  border-2  ">
            <Textarea
              placeholder="Ask a Question"
              className="text-base! pr-14  resize-none pt-5"
              required
              maxLength={1500}
            />
            <Button className="absolute right-6 top-1/2 -translate-y-1/2 cursor-pointer">
              <SendHorizontal />
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default Chat;
