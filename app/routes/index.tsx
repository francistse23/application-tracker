import { Link } from "@remix-run/react";
import type { LinksFunction } from "@remix-run/node";
import stylesUrl from "~/styles/index.css";

export const links: LinksFunction = () => {
  return [{ rel: "stylesheet", href: stylesUrl }];
};

export default function Index() {
  return (
    <div className="container">
      <div className="content">
        <h1>Welcome to Land It</h1>
        <h2>Your one stop job board</h2>
        <Link to="boards/1">Go to your board</Link>
        <Link to="login">Login</Link>
      </div>
    </div>
  );
}
