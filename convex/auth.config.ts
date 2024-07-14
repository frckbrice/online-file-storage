export default {
    //this tell clerk how to fone home when we authenticate. this is to validate the logged in user

    providers: [
        {
            domain: "https://top-kid-17.clerk.accounts.dev",
            applicationID: "convex",
        },
    ]
};