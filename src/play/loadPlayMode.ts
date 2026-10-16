/**
 * The one entry point to the Play mode chunk. Shared by React.lazy and by the
 * toggle's hover prefetch, so both hit the same (cached) dynamic import.
 */
export const loadPlayMode = () => import('./PlayMode');
