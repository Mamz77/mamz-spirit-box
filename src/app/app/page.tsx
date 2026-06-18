import type { Metadata } from 'next';
import { AppClient } from './AppClient';

export const metadata: Metadata = {
  title: 'Spirit Box — Investigation Mode | Mamz Spirit Box',
  description: 'Professional paranormal investigation tool. FM/AM sweep, EVP recording, spectrum analysis.',
};

export default function AppPage() {
  return <AppClient />;
}
