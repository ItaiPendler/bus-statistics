import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "use-http";
import App from "./App";

const globalOptions = {
  interceptors: {
    response: ({ response }: any) => {
      return response;
    },
  },
};
ReactDOM.render(
  <React.StrictMode>
    <Provider>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);
