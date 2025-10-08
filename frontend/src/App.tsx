import React, { useEffect, useState } from "react";

export default function App() {
    const [out, setOut] = useState("…");

    useEffect(() => {
        (async () => {
            try {
                const res = await fetch("/api/health");
                const text = await res.text();
                try {
                    setOut(JSON.stringify(JSON.parse(text), null, 2));
                } catch {
                    setOut(text);
                }
            } catch (e: any) {
                setOut(e?.message || "Erreur");
            }
        })();
    }, []);

    return (
        <div style={{ maxWidth: 720, margin: "24px auto", fontFamily: "system-ui, sans-serif" }}>
            <h1>Health</h1>
            <pre style={{ background: "#f5f5f5", padding: 12, borderRadius: 8, whiteSpace: "pre-wrap" }}>{out}</pre>
        </div>
    );
}