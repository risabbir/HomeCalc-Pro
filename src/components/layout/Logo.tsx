export function Logo() {
  return (
    <div className="bg-primary text-primary-foreground p-1.5 rounded-lg">
      <svg
        className="h-6 w-6"
        viewBox="0 0 512 512"
        fill="currentColor"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M501.2,206.5L265.8,16.2c-6.2-5-15.1-5-21.3,0L10.8,206.5c-5.5,4.4-8.8,11.3-8.8,18.4v266.3c0,8.7,7.1,15.8,15.8,15.8h468.4c8.7,0,15.8-7.1,15.8-15.8V224.9C510,217.8,506.7,210.9,501.2,206.5z M478.4,475.4H33.6V227.6l220.8-177.2l224,179.2V475.4z"/>
        <path d="M256,161c-74.4,0-135,60.6-135,135s60.6,135,135,135s135-60.6,135-135S330.4,161,256,161z M320,304h-56v56h-16v-56h-56v-16h56v-56h16v56h56V304z"/>
      </svg>
    </div>
  );
}
