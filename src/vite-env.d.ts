/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SITE_NAME: string;
  readonly VITE_SITE_DESCRIPTION: string;
  readonly VITE_SITE_URL: string;
  readonly VITE_MARKET_ADDRESS: string;
  readonly VITE_MARKET_PHONE: string;
  readonly VITE_FACEBOOK_URL: string;
  readonly VITE_INSTAGRAM_URL: string;
  readonly VITE_TWITTER_URL: string;
  readonly VITE_GOOGLE_ANALYTICS_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

