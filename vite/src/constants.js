let ENDPOINT="";

// eslint-disable-next-line no-undef
if(process.env.NODE_ENV==="production"){
    ENDPOINT='https://caps-3-2xfo-llbeiqc7h-shivanshtiwariss-projects.vercel.app';
}
// eslint-disable-next-line no-undef
else if(process.env.NODE_ENV==="development"){
    ENDPOINT='http://localhost:3001';
}

export default ENDPOINT;