
import { Button } from "@/components/ui/button";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import PasswordDashboard from "@/components/PasswordManager/PasswordDashboard";

const Index = () => {
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 flex flex-col">
      <header className="container mx-auto p-6 flex justify-between items-center">
        <h1 className="text-xl font-bold">Graphical Password Auth</h1>
        <nav>
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              <span className="text-muted-foreground">
                Welcome, {user?.username}
              </span>
              <Button variant="outline" onClick={logout}>
                Sign out
              </Button>
            </div>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" asChild>
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link to="/register">Sign up</Link>
              </Button>
            </div>
          )}
        </nav>
      </header>

      <main className="flex-1 container mx-auto flex flex-col p-6">
        {isAuthenticated ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="w-full"
          >
            <PasswordDashboard />
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto text-center"
          >
            <h1 className="text-4xl font-bold tracking-tight mb-4">
              Secure authentication with Graphical Passwords
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              A more intuitive and secure way to protect your account using visual memory instead of text-based passwords.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="bg-card p-6 rounded-lg shadow-md"
              >
                <h3 className="text-lg font-medium mb-2">More Secure</h3>
                <p className="text-muted-foreground">
                  Graphical passwords are resistant to common threats like keyloggers and dictionary attacks.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="bg-card p-6 rounded-lg shadow-md"
              >
                <h3 className="text-lg font-medium mb-2">Easy to Remember</h3>
                <p className="text-muted-foreground">
                  Humans are better at remembering visual cues than complex text strings.
                </p>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="bg-card p-6 rounded-lg shadow-md"
              >
                <h3 className="text-lg font-medium mb-2">User Friendly</h3>
                <p className="text-muted-foreground">
                  Intuitive selection process with visual feedback and multi-image sequences.
                </p>
              </motion.div>
            </div>

            <div className="flex gap-4 justify-center">
              <Button size="lg" asChild>
                <Link to="/register">Get Started</Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link to="/login">Sign In</Link>
              </Button>
            </div>
          </motion.div>
        )}
      </main>

      <footer className="container mx-auto p-6 border-t border-border">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Graphical Password Authentication System © {new Date().getFullYear()}
          </p>
          <div className="flex gap-4">
            <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">
              Home
            </Link>
            <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground">
              About
            </Link>
            <Link to="/privacy" className="text-sm text-muted-foreground hover:text-foreground">
              Privacy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
