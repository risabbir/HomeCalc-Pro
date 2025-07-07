import Image from 'next/image';

export function Logo() {
  return (
    <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
      <Image
        src="https://static.thenounproject.com/png/3898205-200.png"
        alt="HomeCalc Pro Logo"
        width={24}
        height={24}
        className='filter brightness-0 invert'
      />
    </div>
  );
}
