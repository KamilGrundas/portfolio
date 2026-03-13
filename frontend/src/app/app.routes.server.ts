import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
<<<<<<< HEAD
    path: 'portfolio/:user_url',
    renderMode: RenderMode.Server,
=======
    path: ':user_url',
    renderMode: RenderMode.Prerender,
    getPrerenderParams: () => Promise.resolve([{ user_url: 'john_doe' }]),
>>>>>>> d864fc8 (Frontend: Refactor routing paths to remove 'portfolio/' prefix and update title handling in login and portfolio components)
  },
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
