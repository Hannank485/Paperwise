import sessionApi from "@/api/sessionApi";
import { useEffect, useState } from "react";
type Message = {
  id: number;
  content: string;
  role: string;
  createdAt: string;
};
type Document = {
  id: number;
  filename: string;
  content: string;
  isValid: boolean;
};
export type Session = {
  id: number;
  userId: number;
  createdAt: string;
  isActive: boolean;
  messages: Message[];
  document: Document;
};
export function useSessions() {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    const fetchSessions = async () => {
      const data = await sessionApi.getSessions();
      setSessions(data.sessions);
    };
    fetchSessions();
  }, []);

  return sessions;
}
