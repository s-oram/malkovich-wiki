export const apiEndpoint = process.env.NODE_ENV === 'development'
    ? 'http://localhost:4001'
    : ''; // window.location.protocol + '//' + window.location.host;

export default {
    isDev: window.location.hostname.includes('localhost'),

    // Persist application state when refreshing the page. (Useful when tweaking CSS.)
    persistApplicationState: true,
}