export default () => ({
    database: {
        url: process.env.DATABASE_URL,
    },
    storage: {
        destination: process.env.UPLOAD_DESTINATION || './uploads',
    },
    app: {
        port: parseInt(process.env.PORT, 10) || 3000,
    },
});