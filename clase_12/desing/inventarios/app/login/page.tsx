"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGitHubLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await signIn("github", { callbackUrl: "/" });
      if (result?.error) {
        setError("Error al iniciar sesión con GitHub");
        setLoading(false);
      }
    } catch {
      setError("Error al conectar con GitHub");
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await signIn("google", { callbackUrl: "/" });
      if (result?.error) {
        setError("Google no está configurado aún");
        setLoading(false);
      }
    } catch {
      setError("Google no está configurado aún");
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Credenciales incorrectas");
        setLoading(false);
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      setError("Error al iniciar sesión");
      setLoading(false);
    }
  };

  return (
    <main
      className="flex flex-col w-full min-h-screen items-center justify-center relative overflow-hidden"
      style={{
        backgroundColor: "#fdf8f8",
        padding: "24px",
      }}
    >
      {/* Background blobs */}
      <div className="absolute inset-0 w-full h-full pointer-events-none" style={{ opacity: 0.2 }}>
        <div
          className="absolute rounded-full"
          style={{
            top: "25%",
            left: "25%",
            width: "500px",
            height: "500px",
            backgroundColor: "#c6c5cf",
            filter: "blur(100px)",
            mixBlendMode: "multiply",
            animation: "pulse 8s ease-in-out infinite",
          }}
        />
        <div
          className="absolute rounded-full"
          style={{
            bottom: "25%",
            right: "25%",
            width: "400px",
            height: "400px",
            backgroundColor: "#c8c5ca",
            filter: "blur(80px)",
            mixBlendMode: "multiply",
            animation: "pulse 10s ease-in-out infinite 2s",
          }}
        />
      </div>

      {/* Card */}
      <div
        className="w-full flex flex-col relative z-10"
        style={{
          maxWidth: "448px",
          backgroundColor: "#ffffff",
          boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.05)",
          borderRadius: "16px",
          padding: "32px",
        }}
      >
        {/* Logo + Title */}
        <div className="flex flex-col items-center" style={{ marginBottom: "32px" }}>
          <div
            className="flex items-center justify-center"
            style={{
              width: "48px",
              height: "48px",
              backgroundColor: "#000000",
              borderRadius: "12px",
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
              marginBottom: "8px",
            }}
          >
            <span
              className="material-symbols-outlined"
              style={{
                color: "#ffffff",
                fontSize: "28px",
              }}
            >
              inventory_2
            </span>
          </div>
          <h1
            style={{
              fontFamily: '"Geist", system-ui, sans-serif',
              fontSize: "30px",
              lineHeight: "38px",
              fontWeight: 600,
              letterSpacing: "-0.02em",
              color: "#1c1b1c",
              margin: 0,
            }}
          >
            Monolithic
          </h1>
        </div>

        {/* Subtitle */}
        <div className="text-center" style={{ marginBottom: "32px" }}>
          <h2
            style={{
              fontFamily: '"Geist", system-ui, sans-serif',
              fontSize: "20px",
              lineHeight: "28px",
              fontWeight: 600,
              letterSpacing: "-0.01em",
              color: "#1c1b1c",
              margin: "0 0 4px 0",
            }}
          >
            Bienvenido de nuevo
          </h2>
          <p
            style={{
              fontFamily: '"Geist", system-ui, sans-serif',
              fontSize: "14px",
              lineHeight: "20px",
              fontWeight: 400,
              color: "#47464b",
              margin: 0,
            }}
          >
            Ingresa a tu cuenta para gestionar tu inventario
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div
            style={{
              backgroundColor: "#ffdad6",
              color: "#93000a",
              padding: "12px 16px",
              borderRadius: "8px",
              fontSize: "14px",
              marginBottom: "16px",
              textAlign: "center",
            }}
          >
            {error}
          </div>
        )}

        {/* Social buttons */}
        <div className="flex flex-col" style={{ gap: "8px", marginBottom: "24px" }}>
          <button
            className="flex items-center justify-center w-full"
            onClick={handleGitHubLogin}
            disabled={loading}
            style={{
              gap: "8px",
              backgroundColor: "#f7f3f2",
              padding: "8px 16px",
              borderRadius: "8px",
              color: "#1c1b1c",
              fontFamily: '"Geist", system-ui, sans-serif',
              fontSize: "14px",
              lineHeight: "20px",
              fontWeight: 500,
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = "#f1eded";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#f7f3f2";
            }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" fillRule="evenodd" />
            </svg>
            {loading ? "Conectando..." : "Continuar con GitHub"}
          </button>
          <button
            className="flex items-center justify-center w-full"
            onClick={handleGoogleLogin}
            disabled={loading}
            style={{
              gap: "8px",
              backgroundColor: "#f7f3f2",
              padding: "8px 16px",
              borderRadius: "8px",
              color: "#1c1b1c",
              fontFamily: '"Geist", system-ui, sans-serif',
              fontSize: "14px",
              lineHeight: "20px",
              fontWeight: 500,
              boxShadow: "0 1px 2px 0 rgba(0, 0, 0, 0.05)",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              if (!loading) e.currentTarget.style.backgroundColor = "#f1eded";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#f7f3f2";
            }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            {loading ? "Conectando..." : "Continuar con Google"}
          </button>
        </div>

        {/* Divider */}
        <div className="flex items-center" style={{ gap: "8px", marginBottom: "24px" }}>
          <div style={{ height: "1px", backgroundColor: "#c8c5cb", flex: 1 }} />
          <span
            style={{
              fontFamily: '"Geist", system-ui, sans-serif',
              fontSize: "12px",
              lineHeight: "16px",
              fontWeight: 500,
              letterSpacing: "0.02em",
              color: "#47464b",
              textTransform: "uppercase",
              padding: "0 8px",
              backgroundColor: "#ffffff",
              whiteSpace: "nowrap",
            }}
          >
            O continuar con correo
          </span>
          <div style={{ height: "1px", backgroundColor: "#c8c5cb", flex: 1 }} />
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col" style={{ gap: "16px" }}>
          {/* Email */}
          <div className="flex flex-col" style={{ gap: "4px" }}>
            <label
              htmlFor="email"
              style={{
                fontFamily: '"Geist", system-ui, sans-serif',
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: 500,
                color: "#1c1b1c",
              }}
            >
              Correo electrónico
            </label>
            <div className="relative group">
              <span
                className="material-symbols-outlined absolute"
                style={{
                  left: "8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "20px",
                  color: "#77767b",
                  transition: "color 0.2s",
                }}
              >
                mail
              </span>
              <input
                className="w-full"
                id="email"
                placeholder="correo@ejemplo.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  backgroundColor: "#ffffff",
                  padding: "8px 16px 8px 40px",
                  borderRadius: "8px",
                  color: "#1c1b1c",
                  fontFamily: '"Geist", system-ui, sans-serif',
                  fontSize: "16px",
                  lineHeight: "24px",
                  outline: "none",
                  boxShadow: "0 0 0 1px #c8c5cb",
                  transition: "box-shadow 0.2s",
                }}
                onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 2px #000000")}
                onBlur={(e) => (e.currentTarget.style.boxShadow = "0 0 0 1px #c8c5cb")}
              />
            </div>
          </div>

          {/* Password */}
          <div className="flex flex-col" style={{ gap: "4px" }}>
            <div className="flex justify-between items-center">
              <label
                htmlFor="password"
                style={{
                  fontFamily: '"Geist", system-ui, sans-serif',
                  fontSize: "14px",
                  lineHeight: "20px",
                  fontWeight: 500,
                  color: "#1c1b1c",
                }}
              >
                Contraseña
              </label>
              <a
                href="#"
                style={{
                  fontFamily: '"Geist", system-ui, sans-serif',
                  fontSize: "12px",
                  lineHeight: "16px",
                  fontWeight: 500,
                  color: "#000000",
                  textDecoration: "none",
                }}
                onMouseEnter={(e) => (e.currentTarget.style.textDecoration = "underline")}
                onMouseLeave={(e) => (e.currentTarget.style.textDecoration = "none")}
              >
                Olvidé mi contraseña
              </a>
            </div>
            <div className="relative group">
              <span
                className="material-symbols-outlined absolute"
                style={{
                  left: "8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  fontSize: "20px",
                  color: "#77767b",
                  transition: "color 0.2s",
                }}
              >
                lock
              </span>
              <input
                className="w-full"
                id="password"
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  backgroundColor: "#ffffff",
                  padding: "8px 40px 8px 40px",
                  borderRadius: "8px",
                  color: "#1c1b1c",
                  fontFamily: '"Geist", system-ui, sans-serif',
                  fontSize: "16px",
                  lineHeight: "24px",
                  outline: "none",
                  boxShadow: "0 0 0 1px #c8c5cb",
                  transition: "box-shadow 0.2s",
                }}
                onFocus={(e) => (e.currentTarget.style.boxShadow = "0 0 0 2px #000000")}
                onBlur={(e) => (e.currentTarget.style.boxShadow = "0 0 0 1px #c8c5cb")}
              />
              <button
                className="absolute"
                style={{
                  right: "8px",
                  top: "50%",
                  transform: "translateY(-50%)",
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                onClick={() => setShowPassword(!showPassword)}
                type="button"
              >
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "20px",
                    color: "#77767b",
                    transition: "color 0.2s",
                  }}
                >
                  {showPassword ? "visibility_off" : "visibility"}
                </span>
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            className="flex items-center justify-center w-full"
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: "#000000",
              color: "#ffffff",
              fontFamily: '"Geist", system-ui, sans-serif',
              fontSize: "14px",
              lineHeight: "20px",
              fontWeight: 500,
              padding: "8px 16px",
              borderRadius: "8px",
              marginTop: "8px",
              border: "none",
              cursor: loading ? "not-allowed" : "pointer",
              opacity: loading ? 0.7 : 1,
              boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)",
              transition: "all 0.2s",
              gap: "4px",
            }}
          >
            {loading ? (
              <span
                className="material-symbols-outlined"
                style={{
                  fontSize: "18px",
                  animation: "spin 1s linear infinite",
                }}
              >
                progress_activity
              </span>
            ) : (
              <>
                Iniciar Sesión
                <span
                  className="material-symbols-outlined"
                  style={{
                    fontSize: "18px",
                    transition: "transform 0.2s",
                  }}
                >
                  arrow_forward
                </span>
              </>
            )}
          </button>
        </form>

        {/* Footer */}
        <div className="text-center" style={{ marginTop: "32px" }}>
          <p
            style={{
              fontFamily: '"Geist", system-ui, sans-serif',
              fontSize: "14px",
              lineHeight: "20px",
              fontWeight: 400,
              color: "#47464b",
              margin: 0,
            }}
          >
            ¿No tienes una cuenta?{" "}
            <a
              href="#"
              style={{
                fontFamily: '"Geist", system-ui, sans-serif',
                fontSize: "14px",
                lineHeight: "20px",
                fontWeight: 500,
                color: "#000000",
                textDecoration: "none",
                transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.textDecoration = "underline";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.textDecoration = "none";
              }}
            >
              Regístrate
            </a>
          </p>
        </div>
      </div>
    </main>
  );
}
