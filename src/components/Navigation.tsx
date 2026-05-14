import Link from 'next/link';
import { useRouter } from 'next/router';
import { Home, ShoppingCart, Calendar, Wrench } from 'lucide-react';

export function Navigation() {
  const router = useRouter();
  
  const links = [
    { href: '/', label: 'Dashboard', icon: Home },
    { href: '/supplies', label: 'Supplies', icon: ShoppingCart },
    { href: '/declutter', label: '30-Day Challenge', icon: Calendar },
    { href: '/repairs', label: 'Repairs', icon: Wrench },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card border-t-2 border-primary z-40 md:top-0 md:bottom-auto md:border-t-0 md:border-b-2">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around md:justify-center md:gap-8 py-3">
          {links.map(({ href, label, icon: Icon }) => {
            const isActive = router.pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`
                  flex flex-col md:flex-row items-center gap-1 md:gap-2 px-3 py-2 rounded-lg
                  transition-all duration-300 font-bold
                  ${isActive 
                    ? 'text-neon-pink' 
                    : 'text-muted-foreground hover:text-neon-cyan'
                  }
                `}
              >
                <Icon className="w-5 h-5" />
                <span className="text-xs md:text-base">{label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}