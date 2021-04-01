import mock from '../../MockConfig';
import MyAppsDB from 'services/my-apps/mocks/db';
// Define some mocks of my-apps
mock.onGet('/my-apps/tokens').reply(200, MyAppsDB.tokens);

mock.onGet('/my-apps/kits').reply(200, MyAppsDB.kits);

mock.onGet('/my-apps/kits/:kit_address').reply(200, MyAppsDB.kits[Math.ceil(Math.random()*(MyAppsDB.kits.length))]);
