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
        <h1>Land It</h1>
        <h2>Your go-to job app tracker</h2>
        <button>
          <Link to="login">Login</Link>
        </button>
      </div>
    </div>
  );
}
