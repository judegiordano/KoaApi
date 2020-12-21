# requires typeorm-model-generator and eslint installed globally
typeorm-model-generator -h localhost -d Users -u sa -x password -e mssql -o ../src/models --noConfig true -a;
npm run prebuild;