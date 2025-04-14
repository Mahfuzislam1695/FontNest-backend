export default () => ({
    database: {
        url: process.env.DATABASE_URL,
    },
    storage: {
        destination: process.env.STORAGE_DESTINATION || './uploads',
    },
    app: {
        port: parseInt(process.env.PORT, 10) || 3000,
        baseUrl: process.env.BASE_URL || 'http://localhost:3333', // Add this line
    },
});

