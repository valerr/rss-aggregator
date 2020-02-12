install:
	npm install
develop:
	npx webpack-dev-server
build:
	npm run build
publish:
	npm publish --dry-run
lint:
	npx eslint .


