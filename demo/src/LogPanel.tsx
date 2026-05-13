import {useEffect, useState} from "react";

const TYPE_COLORS: Record<string, string> = {
  error: "#e74c3c",
  resourceError: "#e67e22",
  unhandledrejection: "#9b59b6",
  custom_error: "#2980b9",
  LOCATION_CHANGE: "#27ae60",
};

export default function LogPanel() {
  const [logs, setLogs] = useState<any[]>([]);

  useEffect(() => {
    const update = () => setLogs([...window.__sentryLogs]);
    window.addEventListener("sentry:log", update);
    return () => window.removeEventListener("sentry:log", update);
  }, []);

  return (
    <div style={{marginTop: 24}}>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 12,
          marginBottom: 8,
        }}
      >
        <strong>捕获日志</strong>
        <span style={{color: "#999", fontSize: 12}}>{logs.length} 条</span>
        <button
          onClick={() => {
            window.__sentryLogs.length = 0;
            setLogs([]);
          }}
          style={{marginLeft: "auto", fontSize: 12, cursor: "pointer"}}
        >
          清空
        </button>
      </div>

      {logs.length === 0 && (
        <div style={{color: "#999", fontSize: 13, padding: "16px 0"}}>
          暂无日志，点击上方按钮触发错误
        </div>
      )}

      {logs.map((log, i) => {
        const color = TYPE_COLORS[log.type] || "#555";
        return (
          <div
            key={i}
            style={{
              marginBottom: 8,
              padding: 12,
              background: "#f8f9fa",
              borderRadius: 6,
              borderLeft: `4px solid ${color}`,
              fontFamily: "monospace",
              fontSize: 12,
            }}
          >
            <div
              style={{
                marginBottom: 6,
                display: "flex",
                gap: 8,
                alignItems: "center",
              }}
            >
              <span
                style={{
                  background: color,
                  color: "#fff",
                  padding: "2px 6px",
                  borderRadius: 4,
                  fontSize: 11,
                }}
              >
                {log.type}
              </span>
              <span style={{color: "#999"}}>{log.timestamp}</span>
              {log.message && (
                <span style={{color: "#333"}}>{log.message}</span>
              )}
            </div>
            <details>
              <summary style={{cursor: "pointer", color: "#666"}}>
                查看完整数据
              </summary>
              <pre style={{marginTop: 8, overflow: "auto", maxHeight: 200}}>
                {JSON.stringify(log, null, 2)}
              </pre>
            </details>
          </div>
        );
      })}
    </div>
  );
}
