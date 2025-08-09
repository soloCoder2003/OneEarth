import { Leaf } from 'lucide-react';

export function Footer() {
  return (
    <footer className="w-full border-t bg-background py-6">
      <div className="container flex flex-col items-center gap-4 md:flex-row md:justify-between">
        <div className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-green-600" />
          <span className="text-md font-semibold">OneEarth</span>
        </div>
        <p className="text-sm text-muted-foreground">
          © {new Date().getFullYear()} MOONWALKERS404 - IEEE Hackathon Project
        </p>
        <div className="flex items-center gap-4">
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Privacy
          </a>
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Terms
          </a>
          <a
            href="#"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Contact
          </a>
        </div>
      </div>
    </footer>
  );
}