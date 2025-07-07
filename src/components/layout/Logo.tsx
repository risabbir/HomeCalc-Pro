export function Logo() {
  return (
    <svg className="h-8 w-8" viewBox="0 0 472.614 472.614" xmlns="http://www.w3.org/2000/svg">
      <circle cx="236.307" cy="236.307" r="236.307" fill="hsl(var(--primary))"/>
      <path 
        d="M363.307,235.409l-127-90.714l-127,90.714v115h254V235.409z" 
        fill="hsl(var(--primary-foreground))"
      />
      {/* Plus Sign */}
      <rect x="221.307" y="260" width="30" height="60" fill="hsl(var(--primary))"/>
      <rect x="206.307" y="275" width="60" height="30" fill="hsl(var(--primary))"/>
    </svg>
  );
}
