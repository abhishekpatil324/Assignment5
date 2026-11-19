const createApp = require('./app');
const PORT = process.env.PORT || 3000;
createApp().listen(PORT, '0.0.0.0', () => console.log(`Student Information Portal running on port ${PORT}`));
