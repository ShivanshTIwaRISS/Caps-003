let ENDPOINT="";

// eslint-disable-next-line no-undef
if(process.env.NODE_ENV==="production"){
    ENDPOINT='https://caps-003-nwqv-gwy4ood8h-shivanshtiwariss-projects.vercel.app';
}
// eslint-disable-next-line no-undef
else if(process.env.NODE_ENV==="development"){
    ENDPOINT='http://localhost:8085';
}

export default ENDPOINT;