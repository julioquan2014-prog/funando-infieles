import "./globals.css";

export const metadata = {
  title: "Funando Infieles | Exponiendo la traición",
  description: "La plataforma número uno para reportar y descubrir infidelidades de manera anónima y segura.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body style={{ position: 'relative', overflowX: 'hidden' }}>
        <div className="floating-bg" style={{ top: '10%', left: '10%' }}></div>
        <div className="floating-bg" style={{ bottom: '20%', right: '10%', animationDelay: '5s' }}></div>
        <main>{children}</main>
      </body>
    </html>
  );
}
