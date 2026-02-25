import { Home, LogOut, Microscope, NotebookText } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
} from "@/components/ui/sidebar";
import authApi from "@/api/authApi";
import type { SetStateAction } from "react";
import { NavLink } from "react-router";
function SidebarComp({
  setAuth,
}: {
  setAuth: React.Dispatch<SetStateAction<boolean | null>>;
}) {
  const navlinkClass =
    "flex flex-row items-center gap-4 hover:text-foreground p-3 rounded-md hover:bg-hover group-data-[collapsible=icon]:p-1  transition-all duration-200 ease-in-out";
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex flex-row items-center select-none text-primary">
        <Microscope className=" shrink-0  group-data-[collapsible=icon]:mt-2 " />
        <p className=" font-bold font-sans text-xl leading-loose tracking-tight group-data-[collapsible=icon]:hidden">
          PaperWise
        </p>
      </SidebarHeader>
      <SidebarContent className="overflow-x-hidden! text-muted-foreground">
        <SidebarGroup className="flex flex-col gap-4 mt-4">
          <NavLink to="/" className={navlinkClass}>
            <Home className="shrink-0 group-data-[collapsible=icon]:size-5" />
            <p className=" group-data-[collapsible=icon]:hidden">Home</p>
          </NavLink>
          <NavLink to="/session" className={navlinkClass}>
            <NotebookText className="shrink-0 group-data-[collapsible=icon]:size-5" />
            <p className=" group-data-[collapsible=icon]:hidden whitespace-nowrap">
              My Papers
            </p>
          </NavLink>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div
          className="cursor-pointer group hover:text-destructive transition-colors duration-150 flex items-center gap-4  mb-2 "
          onClick={async () => {
            await authApi.logout();
            setAuth(false);
          }}
        >
          <LogOut className="shrink-0" />
          <p className="font-mono group-data-[collapsible=icon]:hidden whitespace-nowrap">
            Log Out
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}

export default SidebarComp;
