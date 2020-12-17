clean:
	-make stop
	-rm -rf ./client/node_modules
	-rm -rf ./node_modules
	-rm -rf ./client/build
	-rm -rf ./package-lock.json
	-rm -rf ./client/package-lock.json
start-frontend-dev:
	-cd client && npm i && npm start
start-backend-prod:
	-cd client && npm i && npm run start
start-prod:
	make start-frontend-prod
build:
	npm i
	cd client && npm i && npm run build
	mkdir -p logs
start:
	make build
	npm run start:dev
status:
	npx forever list
stop:
	-npx forever stop hapi-app
