import { Button } from "@/components/ui/button";

const LoginPage = () => {
  return (
    <>
      <h2 className="text-3xl ">Login Page</h2>
      <div className="flex gap-2 p-3">
        <Button variant="outline">Click me</Button>
        <Button variant="secondary">Click me</Button>
        <Button variant="link">Click me</Button>
        <Button variant="destructive">Click me</Button>
        <Button variant="default">Click me</Button>
        <Button variant="ghost">Click me</Button>
      </div>
    </>
  );
};

export default LoginPage;
