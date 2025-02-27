// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Dumbbell,
  History,
  BarChart,
  User,
  LogOut,
  Moon,
  Sun,
} from "lucide-react";
import { motion } from "framer-motion";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "@/components/tooltip";
import { Button } from "@/components/ui/Button";
import { useTheme } from "next-themes";

const MenuOption = ({
  href,
  icon: Icon,
  title,
  description,
}: {
  href: string;
  icon: React.ElementType;
  title: string;
  description: string;
}) => (
  <TooltipProvider>
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
          <Link
            href={href}
            className="bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg p-6 flex flex-col items-center justify-center transition-colors duration-300 h-full"
          >
            <Icon size={48} className="mb-4" />
            <span className="text-xl font-semibold text-center">{title}</span>
          </Link>
        </motion.div>
      </TooltipTrigger>
      <TooltipContent>
        <p>{description}</p>
      </TooltipContent>
    </Tooltip>
  </TooltipProvider>
);

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => setMounted(true), []);

  const handleLogout = () => {
    // Implement logout logic here
    console.log("Logging out...");
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="w-full bg-secondary p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Dumbbell size={32} className="text-primary" />
          <h1 className="text-2xl font-bold">Mi App de Fitness</h1>
        </div>
        <nav className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" /> Logout
          </Button>
        </nav>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center p-4">
        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-center">
          Welcome to Mi App de Fitness
        </h2>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 max-w-6xl w-full">
          <MenuOption
            href="/seleccion-grupo-muscular"
            icon={Dumbbell}
            title="Select Muscle Group"
            description="Start your workout by selecting a muscle group"
          />
          <MenuOption
            href="/dashboard/history"
            icon={History}
            title="Workout History"
            description="Review your past workouts and progress"
          />
          <MenuOption
            href="/dashboard/reports"
            icon={BarChart}
            title="View Reports"
            description="Analyze your fitness journey with detailed reports"
          />
          <MenuOption
            href="/perfil"
            icon={User}
            title="My Profile"
            description="Manage your account settings and preferences"
          />
        </div>
      </main>

      <footer className="w-full bg-secondary p-4 text-center">
        <p>&copy; 2023 Mi App de Fitness. All rights reserved.</p>
      </footer>
    </div>
  );
}
