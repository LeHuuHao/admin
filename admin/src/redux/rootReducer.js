import { combineReducers } from 'redux';
import { persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import orderReducer from './slices/sim/sim.order';
import operatorReducer from './slices/sim/sim.operator';
import priceConfigReducer from './slices/sim/sim.price-config';
import profitConfigReducer from './slices/sim/sim.profit-config';
import emailReducer from './slices/sim/sim.email';
import simReducer from './slices/sim/sim.sim';
import settingReducer from './slices/sim/sim.setting'
import categoryReducer from'./slices/sim/sim.category';
import mediaPrivilegeReducer from './slices/sim/sim.privilege';
import mediaRoleReducer from './slices/sim/sim.role';
import mediaUserReducer from './slices/sim/sim.user';
import mediaCacheReducer from './slices/sim/sim.cache';
import userOrderReducer from './slices/sim/sim.user-order';
import postCategoryReducer from './slices/sim/sim.postCategory';
import tagReducer from './slices/sim/sim.tag';
import postReducer from './slices/sim/sim.post';
import staffOrderReducer from './slices/sim/sim.staff-order';
import reportReducer from './slices/sim/sim.report';
// ----------------------------------------------------------------------

const rootPersistConfig = {
  key: 'root',
  storage,
  keyPrefix: 'redux-',
  blacklist: ['error'],
};

const rootReducer = combineReducers({
  order: persistReducer({ ...rootPersistConfig, key: 'sim-order' }, orderReducer),
  userOrder: persistReducer({ ...rootPersistConfig, key: 'sim-user-order' }, userOrderReducer),
  staffOrder: persistReducer({ ...rootPersistConfig, key: 'sim-staff-order' }, staffOrderReducer),
  operator: persistReducer({ ...rootPersistConfig, key: 'sim-operator' }, operatorReducer),
  priceConfig: persistReducer({ ...rootPersistConfig, key: 'sim-price-config' }, priceConfigReducer),
  profitConfig: persistReducer({ ...rootPersistConfig, key: 'sim-profit-config' }, profitConfigReducer),
  email: persistReducer({ ...rootPersistConfig, key: 'sim-email' }, emailReducer),
  sim: persistReducer({ ...rootPersistConfig, key: 'sim-sim' }, simReducer),
  setting: persistReducer({ ...rootPersistConfig, key: 'sim-setting' }, settingReducer),
  category: persistReducer({ ...rootPersistConfig, key: 'sim-category' }, categoryReducer),
  postCategory: persistReducer({ ...rootPersistConfig, key: 'sim-post-category' }, postCategoryReducer),
  tag: persistReducer({ ...rootPersistConfig, key: 'sim-tag' }, tagReducer),
  post: persistReducer({ ...rootPersistConfig, key: 'sim-post' }, postReducer),
  mediaUser: persistReducer({ ...rootPersistConfig, key: 'sim-user' }, mediaUserReducer),
  mediaRole: persistReducer({ ...rootPersistConfig, key: 'sim-role' }, mediaRoleReducer),
  mediaPrivilege: persistReducer({ ...rootPersistConfig, key: 'sim-privilege' }, mediaPrivilegeReducer),
  mediaCache: persistReducer({ ...rootPersistConfig, key: 'sim-cache' }, mediaCacheReducer),
  report: persistReducer({ ...rootPersistConfig, key: 'sim-report' }, reportReducer),
});
export { rootPersistConfig, rootReducer };
