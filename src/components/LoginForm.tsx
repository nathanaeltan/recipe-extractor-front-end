
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "@/services/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { UtensilsCrossed, Mail, LockKeyhole } from "lucide-react";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login({ username: email, password });
      navigate("/");
    } catch (error) {
      console.error("Login failed:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg backdrop-blur-sm bg-white/90 border-0">
      <CardHeader className="space-y-1 text-center">
        <div className="w-16 h-16 mx-auto mb-2 bg-primary rounded-full flex items-center justify-center">
          <UtensilsCrossed className="h-10 w-10 text-primary-foreground" />
        </div>
        <CardTitle className="text-3xl font-bold">DishCover</CardTitle>
        <CardDescription className="text-lg">
          Sign in to your account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-center">
              <Mail className="mr-2 h-5 w-5 text-muted-foreground" />
              <label htmlFor="email" className="text-lg font-medium">Email</label>
            </div>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full h-12 px-4 text-lg"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center">
              <LockKeyhole className="mr-2 h-5 w-5 text-muted-foreground" />
              <label htmlFor="password" className="text-lg font-medium">Password</label>
            </div>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full h-12 px-4 text-lg"
            />
          </div>

          <Button
            type="submit"
            className="w-full h-12 text-lg font-medium hover:bg-primary/80 transition-colors"
            disabled={isLoading}
          >
            {isLoading ? "Logging in..." : "Log In"}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="flex flex-col space-y-4">
        <button className="text-muted-foreground hover:text-foreground transition-colors">
          Forgot password?
        </button>

        <div className="text-center">
          <p>
            Don't have an account?{" "}
            <Link to="/signup" className="text-primary font-medium hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;