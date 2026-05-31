import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./app/app";

import "./styles/global.css";
import "./styles/shared.css";

createRoot(document.getElementById("root")!).render(
	<>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</>,
);
