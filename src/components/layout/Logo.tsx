export function Logo() {
  return (
    <div className="bg-primary rounded-md h-8 w-8 flex items-center justify-center p-1.5">
      <svg
        className="w-full h-full text-primary-foreground"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 21V9.78C4 9.21 4.25 8.68 4.68 8.32L10.68 3.32C11.45 2.67 12.55 2.67 13.32 3.32L19.32 8.32C19.75 8.68 20 9.21 20 9.78V21H4Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeMiterlimit="10"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <rect
          x="8"
          y="12"
          width="8"
          height="5"
          rx="1"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M10.5 15.5H13.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
