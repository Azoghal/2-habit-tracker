import { Fragment } from "react";
import { Outlet, ScrollRestoration } from "react-router-dom";
import "./sass/main.scss";

export default function App() {
  return (
    <Fragment>
      <Outlet />
      <ScrollRestoration />
    </Fragment>
  );
}
