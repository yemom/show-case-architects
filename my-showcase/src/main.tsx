import { createRoot } from "react-dom/client";
import logoPng from "./assets/logo.png";
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

// Dynamically set favicon to the bundled PNG; falls back to /public/favicon.svg if this fails
try {
	const link = document.querySelector<HTMLLinkElement>("link[rel='icon']");
	if (link && logoPng) {
		link.type = "image/png";
		link.href = logoPng;
	}
} catch {
	// no-op: keep default favicon
}
