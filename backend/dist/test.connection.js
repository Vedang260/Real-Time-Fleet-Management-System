"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const ormconfig_1 = require("./config/ormconfig");
const ds = new typeorm_1.DataSource(ormconfig_1.typeOrmConfig);
ds.initialize()
    .then(() => console.log('✅ Successfully connected to DB!'))
    .catch((err) => {
    console.error('❌ Failed to connect to DB!');
    console.error(err);
});
