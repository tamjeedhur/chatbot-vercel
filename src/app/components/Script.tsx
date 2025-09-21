import Script from 'next/script';

export default function Home() {
  const username = 'zohaib'; 


  return (
    <div>
      <Script
        src="https://zohaibwebdev.github.io/chatbot-widget/chatbot1.min.js"
        data-username={username}
      />
    </div>
  );
}
