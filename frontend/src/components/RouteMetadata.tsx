import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const brandTitle = 'CollabNote — Think. Write. Collaborate.';
const publicDescription = 'Capture ideas, organize your thoughts, and collaborate on notes in real time with CollabNote.';
const publicUrl = 'https://collabnote-seven.vercel.app/';

export default function RouteMetadata() {
  const { pathname } = useLocation();

  useEffect(() => {
    // The existing sign-in screen at / is also the public entry page.
    // Never derive metadata from note data, user identity, search params or tokens.
    const isPublicEntry = pathname === '/';
    const title = isPublicEntry ? brandTitle
      : pathname === '/register' ? 'Create an account — CollabNote'
      : pathname === '/dashboard' ? 'Dashboard — CollabNote'
      : pathname.startsWith('/notes/') ? 'Note editor — CollabNote'
      : pathname.startsWith('/join/') ? 'Invitation — CollabNote'
      : 'Page not found — CollabNote';

    document.title = title;
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (description) description.content = isPublicEntry ? publicDescription : 'Your private workspace for notes and collaboration. Sign in to continue.';
    const robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]');
    if (robots) robots.content = isPublicEntry ? 'index, follow' : 'noindex, nofollow';

    let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (isPublicEntry) {
      if (!canonical) {
        canonical = document.createElement('link');
        canonical.rel = 'canonical';
        document.head.append(canonical);
      }
      canonical.href = publicUrl;
    } else canonical?.remove();
    // OG and Twitter tags intentionally stay generic and point to the public root.
    // Static crawlers also receive safe branding from index.html.
  }, [pathname]);

  return null;
}
