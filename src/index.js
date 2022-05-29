import React from "react";
import ReactDOM from "react-dom/client";
import axios from "axios";

import "./index.css";
import App from "./App";
import AuthContextProvider from "./context/auth-context";

axios.defaults.baseURL =
  "https://react-hooks-example-945a5-default-rtdb.firebaseio.com";

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <AuthContextProvider>
    <App />
  </AuthContextProvider>
);
