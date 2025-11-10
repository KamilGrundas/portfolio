import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'portfolio/:user_url',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: () => Promise.resolve([{ user_url: 'johndoe' }]),
  },
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];