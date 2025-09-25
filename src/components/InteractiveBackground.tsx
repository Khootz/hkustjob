import { useEffect, useState } from 'react';

export const InteractiveBackground = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Calculate gradient position based on scroll
  const gradientOffset = Math.min(scrollY / 10, 100);
  const opacity = Math.min(scrollY / 500, 0.8) + 0.2;

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      {/* Primary animated gradient layer */}
      <div 
        className="absolute inset-0 transition-all duration-700 ease-out"
        style={{
          background: `
            radial-gradient(
              circle at ${50 + gradientOffset * 0.3}% ${30 + gradientOffset * 0.2}%, 
              hsl(195 100% 50% / ${opacity * 0.15}) 0%, 
              transparent 50%
            ),
            radial-gradient(
              circle at ${20 - gradientOffset * 0.2}% ${70 + gradientOffset * 0.1}%, 
              hsl(51 100% 60% / ${opacity * 0.12}) 0%, 
              transparent 40%
            ),
            radial-gradient(
              circle at ${80 + gradientOffset * 0.1}% ${20 - gradientOffset * 0.15}%, 
              hsl(220 70% 85% / ${opacity * 0.1}) 0%, 
              transparent 35%
            ),
            linear-gradient(
              ${135 + gradientOffset * 0.5}deg, 
              hsl(240 100% 99%) 0%,
              hsl(240 60% 98%) 50%,
              hsl(240 80% 97%) 100%
            )
          `
        }}
      />
      
      {/* Secondary floating orbs */}
      <div 
        className="absolute inset-0 transition-transform duration-1000 ease-out"
        style={{
          transform: `translateY(${scrollY * 0.3}px) rotate(${scrollY * 0.05}deg)`
        }}
      >
        {/* Large primary orb */}
        <div 
          className="absolute w-96 h-96 rounded-full opacity-20 blur-3xl animate-float"
          style={{
            top: '10%',
            right: '15%',
            background: 'radial-gradient(circle, hsl(195 100% 50% / 0.3), transparent 70%)',
            animationDelay: '0s',
            animationDuration: '8s'
          }}
        />
        
        {/* Medium secondary orb */}
        <div 
          className="absolute w-64 h-64 rounded-full opacity-15 blur-2xl animate-float"
          style={{
            bottom: '20%',
            left: '10%',
            background: 'radial-gradient(circle, hsl(51 100% 60% / 0.25), transparent 70%)',
            animationDelay: '2s',
            animationDuration: '10s'
          }}
        />
        
        {/* Small accent orb */}
        <div 
          className="absolute w-48 h-48 rounded-full opacity-10 blur-xl animate-float"
          style={{
            top: '60%',
            right: '40%',
            background: 'radial-gradient(circle, hsl(220 70% 85% / 0.2), transparent 70%)',
            animationDelay: '4s',
            animationDuration: '12s'
          }}
        />
      </div>

      {/* Mesh gradient overlay */}
      <div 
        className="absolute inset-0 opacity-40 transition-opacity duration-500"
        style={{
          background: `
            conic-gradient(
              from ${gradientOffset}deg at 25% 25%, 
              hsl(195 100% 50% / 0.03), 
              hsl(51 100% 60% / 0.02), 
              hsl(220 70% 85% / 0.03), 
              hsl(195 100% 50% / 0.03)
            )
          `
        }}
      />
    </div>
  );
};