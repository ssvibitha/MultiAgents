// import Navbar from "@/components/Navbar";
import Footer from "@/components/layout/Footer";
import Navbar from "@/components/layout/Navbar";
export default function StoreShell({ children, title, subtitle }) {
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <Navbar />

      {(title || subtitle) && (
        <header className="max-w-7xl w-full mx-auto px-4 pt-10 pb-6">
          {title && (
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-gray-600 mt-2 max-w-2xl">{subtitle}</p>
          )}
        </header>
      )}

      <div className="flex-1 w-full max-w-7xl mx-auto px-4 pb-16">{children}</div>

      <Footer />
    </div>
  );
}
