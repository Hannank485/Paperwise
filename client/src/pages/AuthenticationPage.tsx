import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { InfoIcon } from "lucide-react";
import authApi from "@/api/authApi";
import { Microscope } from "lucide-react";
import { getErrorMessage } from "@/api/client";
function AuthenticationPage({
  setAuth,
}: {
  setAuth: React.Dispatch<React.SetStateAction<boolean | null>>;
}) {
  const [login, setLogin] = useState<boolean>(true);
  const [alertOpen, setAlertOpen] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const handleChange = (
    stateHandler: React.Dispatch<React.SetStateAction<string>>,
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    stateHandler(e.target.value);
  };
  useEffect(() => {
    if (alertOpen) {
      const timeout = setTimeout(() => {
        setAlertOpen(false);
      }, 2000);
      return () => {
        clearTimeout(timeout);
      };
    }
  }, [alertOpen]);
  const handleSubmit = async (
    e: React.SubmitEvent,
    username: string,
    password: string,
  ) => {
    e.preventDefault();
    if (login == false) {
      try {
        await authApi.regsiter(username, password);
        setAlertOpen(true);
        e.target.reset();

        setLogin(true);
      } catch (err) {
        setError(getErrorMessage(err));
      }
    } else {
      try {
        setError(null);
        await authApi.login(username, password);
        e.target.reset();

        setAuth(true);
      } catch (err) {
        setError(getErrorMessage(err));
      }
    }
  };
  return (
    <div className="flex items-center justify-center h-full  w-full">
      {alertOpen && (
        <Alert className="absolute max-w-md top-[5vh] right-[2vw] bg-accent text-primary-foreground">
          <InfoIcon />
          <AlertTitle>Alert</AlertTitle>
          <AlertDescription className="text-primary-foreground">
            Registered Succesfully!
          </AlertDescription>
        </Alert>
      )}

      <Card className="max-w-xs md:max-w-md w-full pt-6 pb-0 overflow-hidden">
        <CardHeader>
          <div className="flex gap-2 items-center justify-center">
            <Microscope className="text-primary" />
            <p className="text-center font-bold font-sans text-3xl text-primary tracking-tight">
              PaperWise
            </p>
          </div>
          <CardTitle className="text-center text-xl mt-2">
            {login ? "Login" : "Register"}
          </CardTitle>
        </CardHeader>
        <form
          onSubmit={(e) => {
            handleSubmit(e, username, password);
          }}
        >
          <CardContent className="flex flex-col gap-2">
            <Label className="text-xs md:text-sm">Username</Label>
            <Input
              placeholder="Enter Your Username"
              type="text"
              name="name"
              onChange={(e) => handleChange(setUsername, e)}
              required
            ></Input>
            <Label className="text-xs md:text-sm">Password</Label>
            <Input
              placeholder="Enter Your Password"
              type="password"
              onChange={(e) => handleChange(setPassword, e)}
              required
              minLength={8}
              maxLength={15}
            ></Input>
            {error && (
              <p className="text-destructive text-sm mt-2 -mb-2">{error}</p>
            )}
          </CardContent>
          <CardFooter className="bg-card border-t-accent mt-4  py-6 flex flex-col gap-2">
            <Button className="w-full cursor-pointer" type="submit">
              {login ? "Login" : "Register"}
            </Button>
            <p
              className="text-sm cursor-pointer text-primary hover:underline select-none"
              onClick={() => {
                setError(null);
                setLogin((prev) => !prev);
              }}
            >
              {login
                ? "Don't have an account? Register Here"
                : "Already have an account? Login Here"}
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default AuthenticationPage;
