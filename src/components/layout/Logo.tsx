import Image from 'next/image';

export function Logo() {
  return (
    <Image
      src="https://cdn-icons-png.flaticon.com/512/2825/2825684.png"
      alt="HomeCalc Pro Logo"
      width={32}
      height={32}
      className="h-8 w-8"
    />
  );
}
