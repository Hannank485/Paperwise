import sessionApi from "@/api/sessionApi";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, Bot, InfoIcon, SendHorizontal, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import type { Session, Message } from "@/hooks/useSessions";
import { Button } from "@/components/ui/button";
import { getErrorMessage } from "@/api/client";
import Markdown from "react-markdown";

function Chat() {
  const messageBottomView = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [session, setSession] = useState<Session>();
  const [alert, setAlert] = useState<string | null>(null);
  const [question, setQuestion] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const params = useParams();
  const id = Number(params.id);
  useEffect(() => {
    async function getSession(id: number) {
      const data: Session = await sessionApi.getSingleSession(id);
      setSession(data);
      setMessages(data.messages);
      if (!data?.document.isValid) {
        setAlert(
          "The PDF FAILED Credibility Check, the Assistant may not work as intended!",
        );
      }
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
  useEffect(() => {
    messageBottomView.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const initialMessages = messages;
    const optimisticMessage = {
      id: Date.now(), // temp id
      role: "user",
      content: question,
      createdAt: new Date().toISOString(),
    };
    if (!session || !question) {
      setAlert("Please type a message before sending");
      return;
    }
    setMessages((prev) => [...prev, optimisticMessage]);
    try {
      const data = await sessionApi.sendQuestion(session.id, question);
      setMessages((prev) => [...prev, data.response]);
      setQuestion("");
    } catch (err) {
      setAlert(getErrorMessage(err));
      setMessages(initialMessages);
    }
  };
  return (
    <main className="flex flex-col h-[calc(100dvh-60px)] bg-sidebar overflow-hidden">
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
      <div className="flex flex-col justify-between h-full max-w-3xl mx-auto w-full overflow-hidden ">
        <div className="bg-sidebar flex-1 flex flex-col h-full pt-4 gap-4 overflow-y-auto messages-container px-2">
          {messages.map((msg) => {
            return (
              <div
                key={msg.id}
                className="flex flex-row gap-4 items-center"
                style={{
                  alignSelf: msg.role === "user" ? "flex-end" : "flex-start",
                  flexDirection: msg.role === "user" ? "row-reverse" : "row",
                }}
              >
                <Avatar size="default">
                  <AvatarFallback>
                    {msg.role === "user" ? <User /> : <Bot />}
                  </AvatarFallback>
                </Avatar>
                <div key={msg.id} className=" bg-iconBg p-4 rounded-md">
                  <Markdown>{msg.content}</Markdown>
                </div>
                <div ref={messageBottomView}></div>
              </div>
            );
          })}
        </div>

        <form
          className="bg-sidebar py-10 px-4 flex items-center justify-center"
          onSubmit={(e) => {
            handleSubmit(e);
          }}
        >
          <div className="sticky bg-background  max-w-3xl w-full   rounded-2xl  border-2  ">
            <Textarea
              placeholder="Ask a Question"
              className="text-base! pr-14  resize-none pt-5"
              required
              maxLength={1500}
              value={question}
              onChange={(e) => {
                setQuestion(e.target.value);
              }}
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
