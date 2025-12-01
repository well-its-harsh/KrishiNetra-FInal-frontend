import { Search, User, Menu } from "lucide-react";
import { Button } from "@/components/ui/consumer/button";
import { Input } from "@/components/ui/consumer/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/consumer/sheet";
import { useState } from "react";
import { Link } from "react-router-dom";
import { CartDrawer } from "@/components/consumer/CartDrawer";

export const Navigation = () => {
  const [cartCount] = useState(0);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-4 px-4 md:px-6">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <span className="text-lg font-bold text-primary-foreground">M</span>
          </div>
          <span className="hidden text-lg font-semibold md:inline-block">MilletMarket</span>
        </Link>

        {/* Desktop Search */}
        <div className="hidden flex-1 max-w-xl md:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search millets, recipes, or sellers..."
              className="pl-10"
            />
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-2 md:flex">
          <Button variant="ghost" size="sm">
            Categories
          </Button>
          <Button variant="ghost" size="sm">
            Recipes
          </Button>
          <Button variant="ghost" size="sm" asChild>
            <Link to="/dashboard">Dashboard</Link>
          </Button>
          <CartDrawer />
          <Button variant="ghost" size="sm">
            <User className="h-5 w-5" />
          </Button>
        </nav>

        {/* Mobile Menu */}
        <div className="flex items-center gap-2 md:hidden">
          <CartDrawer />
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="sm">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <nav className="flex flex-col gap-4 pt-8">
                <Input type="search" placeholder="Search..." className="mb-4" />
                <Button variant="ghost" className="justify-start">Categories</Button>
                <Button variant="ghost" className="justify-start">Recipes</Button>
                <Button variant="ghost" className="justify-start" asChild>
                  <Link to="/dashboard">Dashboard</Link>
                </Button>
                <Button variant="ghost" className="justify-start">Profile</Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};
