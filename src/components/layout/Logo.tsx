export function Logo() {
  return (
    <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
      <svg
        className="h-6 w-6"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9z" />
        <polyline points="9 22 9 12 15 12 15 22" />
        <rect x="10" y="14" width="4" height="5" rx="0.5" ry="0.5" strokeWidth="1.5"/>
        <line x1="10.5" y1="16.5" x2="13.5" y2="16.5" strokeWidth="1.5" />
      </svg>
    </div>
  );
}
