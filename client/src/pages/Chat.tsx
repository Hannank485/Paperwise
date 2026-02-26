import { Input } from "@/components/ui/input";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router";

function Chat() {
  const navigate = useNavigate();
  return (
    <main className="flex flex-col h-full">
      <div className="w-full flex py-2 bg-sidebar border-b items-center px-2 justify-between">
        <p
          className="p-2 rounded-md hover:bg-hover cursor-pointer"
          onClick={() => {
            navigate("/session");
          }}
        >
          <ArrowLeft />
        </p>
        <p className="flex-1 text-center font-bold">Start Messaging</p>
      </div>
      <div className="bg-sidebar flex-1">hi </div>
      <div className="bg-background py-10 px-4 border-t">
        <Input placeholder="Ask a Question" className="border-2" />
      </div>
    </main>
  );
}

export default Chat;
