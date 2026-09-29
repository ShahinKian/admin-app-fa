"use client";
// import { Inter } from "next/font/google";
import { useThemeStore } from "@/store";
import { ThemeProvider } from "next-themes";
import { cn } from "@/lib/utils";
import { Toaster as ReactToaster } from "@/components/ui/toaster";
import { Toaster } from "react-hot-toast";
import { SonnToaster } from "@/components/ui/sonner";
import { usePathname } from "next/navigation";

// const inter = Inter({ subsets: ["latin"] });

const Providers = ({ children }: { children: React.ReactNode }) => {
  const { theme, radius } = useThemeStore();
  const location = usePathname();

  // اگر در صفحه اصلی هستیم
  if (location === "/") {
    return (
      <ThemeProvider
        attribute="class"
        enableSystem={false}
        defaultTheme="light"
      >
        <div className={cn("h-full container mx-auto px-4")}>
          {children}
          <ReactToaster />
        </div>
        <Toaster />
        <SonnToaster />
      </ThemeProvider>
    );
  }

  // برای سایر صفحات
  return (
    <ThemeProvider
      attribute="class"
      enableSystem={false}
      defaultTheme="light"
    >
      <div
        className={cn("dash-tail-app", "theme-" + theme)}
        style={{
          "--radius": `${radius}rem`,
        } as React.CSSProperties}
      >
        <div className={cn("h-full")}>
          {children}
          <ReactToaster />
        </div>
        <Toaster />
        <SonnToaster />
      </div>
    </ThemeProvider>
  );
};

export default Providers;