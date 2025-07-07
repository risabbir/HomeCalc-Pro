import Image from 'next/image';

export function Logo() {
  return (
    <div className="bg-primary rounded-md h-8 w-8 flex items-center justify-center">
      <Image
        src="https://cdn-icons-png.flaticon.com/512/2825/2825684.png"
        alt="HomeCalc Pro Logo"
        width={20}
        height={20}
        className="h-5 w-5 invert"
      />
    </div>
  );
}
