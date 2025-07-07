export function Logo() {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M24 6L4 19.5V42H44V19.5L24 6Z"
        className="fill-primary/20 stroke-primary"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M34 42V24H14V42"
        className="fill-background stroke-primary"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <rect
        x="20" y="29" width="8" height="3" rx="1.5"
        className="fill-primary"
      />
      <rect
        x="20" y="34" width="8" height="3" rx="1.5"
        className="fill-primary"
      />
    </svg>
  );
}
