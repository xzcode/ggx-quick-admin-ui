import ConfigDev from './config.dev';
import ConfigTest from './config.test';
import ConfigProd from './config.prod';

export function isDevEnv() {
    return (
        process.env.NODE_ENV === 'dev' ||
        process.env.NODE_ENV === 'development' ||
        process.env.NODE_ENV === undefined
    );
}
export function isTestEnv() {
    return process.env.NODE_ENV === 'test';
}
export function isProdEnv() {
    return (
        process.env.NODE_ENV === 'prod' || process.env.NODE_ENV === 'production'
    );
}

let exportConfig = ConfigDev;
if (isTestEnv()) {
    exportConfig = ConfigTest;
} else if (isProdEnv()) {
    exportConfig = ConfigProd;
}

export default exportConfig;
