import { Link } from "@remix-run/react";

export default function Index() {
  return (
    <div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
      <h1>Welcome to Land It</h1>
      <h2>Your one stop job board</h2>
      <Link to="boards/1">Go to your board</Link>
      <Link to="login">Login</Link>
    </div>
  );
}
