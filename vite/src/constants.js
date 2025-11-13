// ...existing code...
let ENDPOINT = 'http://localhost:8085';

if (import.meta.env.PROD) {
  ENDPOINT = 'https://caps-003-nwqv-gwy4ood8h-shivanshtiwariss-projects.vercel.app';
} else if (import.meta.env.MODE === 'development') {
  ENDPOINT = 'http://localhost:8085';
}

export default ENDPOINT;