import { Moon, Sun } from "lucide-react";
function Navbar({ dark, setDark }: { dark: boolean; setDark: () => void }) {
  return (
    <nav className="flex justify-end py-3 px-6 md:px-12">
      <p
        className="hover:bg-accent hover:text-white p-2 rounded-2xl cursor-pointer"
        onClick={() => setDark()}
      >
        {dark ? <Sun /> : <Moon />}
      </p>
    </nav>
  );
}

export default Navbar;
