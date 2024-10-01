const {getDefaultConfig, mergeConfig} = require('@react-native/metro-config');
const {BASE_URL} = require('./socket/SocketClient');

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
  host: BASE_URL, // Replace this with your computer's IP address
  port: 8081,
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
