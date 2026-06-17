import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { CartProvider } from "./contexts/CartContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartSidebar from "./components/CartSidebar";
import Home from "./pages/Home";
import Catalog from "./pages/Catalog";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import About from "./pages/About";
import Collections from "./pages/Collections";
import Delivery from "./pages/Delivery";
import Contacts from "./pages/Contacts";
import SizeGuide from "./pages/SizeGuide";
import Returns from "./pages/Returns";
import Privacy from "./pages/Privacy";
import Search from "./pages/Search";
import Care from "./pages/Care";
import PaymentReturn from "./pages/PaymentReturn";

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'transparent' }}>
      <Header />
      <div className="flex-1">
        {children}
      </div>
      <Footer />
      <CartSidebar />
    </div>
  );
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={() => <Layout><Home /></Layout>} />
      <Route path="/catalog" component={() => <Layout><Catalog /></Layout>} />
      <Route path="/product/:id" component={() => <Layout><ProductDetail /></Layout>} />
      <Route path="/checkout" component={() => <Layout><Checkout /></Layout>} />
      <Route path="/about" component={() => <Layout><About /></Layout>} />
      <Route path="/collections" component={() => <Layout><Collections /></Layout>} />
      <Route path="/collections/:id" component={() => <Layout><Collections /></Layout>} />
      <Route path="/delivery" component={() => <Layout><Delivery /></Layout>} />
      <Route path="/contacts" component={() => <Layout><Contacts /></Layout>} />
      <Route path="/size-guide" component={() => <Layout><SizeGuide /></Layout>} />
      <Route path="/returns" component={() => <Layout><Returns /></Layout>} />
      <Route path="/privacy" component={() => <Layout><Privacy /></Layout>} />
      <Route path="/search" component={() => <Layout><Search /></Layout>} />
      <Route path="/care" component={() => <Layout><Care /></Layout>} />
      <Route path="/payment/return" component={() => <Layout><PaymentReturn /></Layout>} />
      <Route path="/terms" component={() => <Layout><Privacy /></Layout>} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <CartProvider>
          <TooltipProvider>
            <Toaster position="bottom-right" />
            <Router />
          </TooltipProvider>
        </CartProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
