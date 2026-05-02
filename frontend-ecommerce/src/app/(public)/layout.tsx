import { CartProvider } from "@/components/cart/CartProvider";
import { Footer } from "@/components/layout/Footer";
import { FloatingWhatsApp } from "@/components/layout/FloatingWhatsApp";
import { Header } from "@/components/layout/Header";
import { PwaRegister } from "@/components/layout/PwaRegister";

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <PwaRegister />
      <CartProvider>
        <Header />
        <main>{children}</main>
        <Footer />
        <FloatingWhatsApp />
      </CartProvider>
    </>
  );
}
