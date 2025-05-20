import React from 'react';

export default function AppDownloadCTA() {
  return (
    <div className="bg-[#690d89] text-white rounded-2xl py-10 px-6 flex flex-col items-center w-full">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-6">
        Get the Kudo eSIM app
      </h2>
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
        <a href="https://apps.apple.com/app/idYourAppId" target="_blank" rel="noopener noreferrer">
          <img src="/kudo_apple.svg" alt="Download on the App Store" className="h-12" />
        </a>
        <a href="https://play.google.com/store/apps/details?id=your.app.id" target="_blank" rel="noopener noreferrer">
          <img src="/kudo_android.svg" alt="Get it on Google Play" className="h-12" />
        </a>
      </div>
    </div>
  );
}
