import mock from '../../MockConfig';
import { ConfigFile } from './../../db/config';

mock.onGet('/config-file').reply(200, ConfigFile);

mock.onPost('/config-file').reply(200);