import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Menu, X, ShoppingCart, User, LayoutDashboard, LogOut, Package, Wheat } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { totalItems, setIsCartOpen } = useCart();
  const { user, isAdmin, signOut, loading } = useAuth();

  const navItems = [
    { name: "Home", href: "/#home" },
    { name: "About", href: "/#about" },
    { name: "Products", href: "/#products" },
    { name: "Process", href: "/#process" },
    { name: "Contact", href: "/#contact" },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Brand header */}
          <div className="flex items-start gap-3">
            <Wheat className="w-7 h-7 text-primary mt-1" />
            <div>
              <h1 className="text-xl md:text-2xl font-bold">
                <span className="text-primary">SLN</span> Rice Mill
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {loading ? (
              <div className="text-muted-foreground text-sm">Loading...</div>
            ) : isAdmin ? (
              <>
                <Button asChild variant="ghost">
                  <Link to="/admin/dashboard">
                    <LayoutDashboard className="h-4 w-4 mr-2" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="ghost" onClick={signOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                {navItems.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className="text-foreground hover:text-primary transition-colors font-medium"
                    style={{ fontFamily: "'Source Sans 3', sans-serif" }}
                  >
                    {item.name}
                  </a>
                ))}
                <button
                  onClick={() => setIsCartOpen(true)}
                  className="relative text-foreground hover:text-primary transition-colors"
                >
                  <ShoppingCart className="h-6 w-6" />
                  {totalItems > 0 && (
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                      {totalItems}
                    </span>
                  )}
                </button>
                {user ? (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="relative text-foreground hover:text-primary transition-colors focus:outline-none">
                        <Avatar className="h-9 w-9 border-2 border-primary/20 hover:border-primary/50 transition-colors">
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            <User className="h-5 w-5" />
                          </AvatarFallback>
                        </Avatar>
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      <DropdownMenuItem asChild>
                        <Link to="/profile" className="cursor-pointer">
                          <User className="h-4 w-4 mr-2" />
                          My Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link to="/orders" className="cursor-pointer">
                          <Package className="h-4 w-4 mr-2" />
                          My Orders
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={signOut} className="cursor-pointer text-destructive focus:text-destructive">
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                ) : (
                  <Button variant="ghost" asChild>
                    <Link to="/login">
                      <User className="h-4 w-4 mr-2" />
                      Login
                    </Link>
                  </Button>
                )}
                <Button 
                  className="bg-primary hover:bg-primary/90 text-primary-foreground"
                  asChild
                >
                  <a href="/#contact">Get Quote</a>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-foreground" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isOpen && (
          <div className="md:hidden py-4 border-t border-border">
            <div className="flex flex-col space-y-4">
              {loading ? (
                <div className="text-muted-foreground text-sm text-center">Loading...</div>
              ) : isAdmin ? (
                <>
                  <Button asChild variant="ghost" className="w-full justify-start">
                    <Link to="/admin/dashboard" onClick={() => setIsOpen(false)}>
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Dashboard
                    </Link>
                  </Button>
                  <Button variant="ghost" className="w-full justify-start" onClick={() => { signOut(); setIsOpen(false); }}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </Button>
                </>
              ) : (
                <>
                  {navItems.map((item) => (
                    <a key={item.name} href={item.href} className="text-foreground hover:text-primary transition-colors font-medium" onClick={() => setIsOpen(false)}>
                      {item.name}
                    </a>
                  ))}
                  <button onClick={() => { setIsCartOpen(true); setIsOpen(false); }} className="flex items-center justify-between text-foreground hover:text-primary transition-colors font-medium">
                    <span>Cart</span>
                    {totalItems > 0 && (
                      <span className="bg-primary text-primary-foreground text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">{totalItems}</span>
                    )}
                  </button>
                  {user ? (
                    <>
                      <Button asChild variant="ghost" className="w-full justify-start">
                        <Link to="/profile" onClick={() => setIsOpen(false)}>
                          <User className="h-4 w-4 mr-2" />
                          My Profile
                        </Link>
                      </Button>
                      <Button asChild variant="ghost" className="w-full justify-start">
                        <Link to="/orders" onClick={() => setIsOpen(false)}>
                          <Package className="h-4 w-4 mr-2" />
                          My Orders
                        </Link>
                      </Button>
                      <Button variant="ghost" className="w-full justify-start text-destructive" onClick={() => { signOut(); setIsOpen(false); }}>
                        <LogOut className="h-4 w-4 mr-2" />
                        Logout
                      </Button>
                    </>
                  ) : (
                    <Button variant="ghost" className="w-full justify-start" asChild onClick={() => setIsOpen(false)}>
                      <Link to="/login">
                        <User className="h-4 w-4 mr-2" />
                        Login
                      </Link>
                    </Button>
                  )}
                  <Button 
                    className="bg-primary hover:bg-primary/90 text-primary-foreground w-full"
                    asChild
                    onClick={() => setIsOpen(false)}
                  >
                    <a href="/#contact">Get Quote</a>
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
