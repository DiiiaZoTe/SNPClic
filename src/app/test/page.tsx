import { Signup } from "./signup";

export default async function TestPage() {
  
  return (
    <div className="container">
      <h1>Test page</h1>
      <p>This is a test page</p>
      <Signup />
    </div>
  );
}