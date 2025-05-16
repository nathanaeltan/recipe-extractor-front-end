
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { signup } from "@/services/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { UtensilsCrossed, Mail, LockKeyhole, User } from "lucide-react";

const SignupForm = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await signup({ name, email, password });
      navigate("/login");
    } catch (error) {
      console.error("Signup failed:", error);
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
          Create a new account
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <div className="flex items-center">
              <User className="mr-2 h-5 w-5 text-muted-foreground" />
              <label htmlFor="name" className="text-lg font-medium">Name</label>
            </div>
            <Input
              id="name"
              type="text"
              placeholder="Your Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full h-12 px-4 text-lg"
            />
          </div>

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
            {isLoading ? "Creating Account..." : "Sign Up"}
          </Button>
        </form>
      </CardContent>

      <CardFooter>
        <div className="w-full text-center">
          <p>
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

export default SignupForm;