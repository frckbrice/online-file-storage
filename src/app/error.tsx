"use client"

function Error({ statusCode }: { statusCode: number }) {
    const errorMessage = statusCode
        ? `An error ${statusCode} occurred on server`
        : 'An error occurred on client';

    return <p>{errorMessage}</p>;
}

Error.getInitialProps = ({ res, err }: { res?: any, err?: any }) => ({
    statusCode: res?.statusCode || err?.statusCode || 404
})

export default Error