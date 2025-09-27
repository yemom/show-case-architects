import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { AppProvider } from "./context/AppContext";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
	<AppProvider>
		<App />
		<Toaster position="top-right" />
	</AppProvider>
);
