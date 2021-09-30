exec_test:
	docker-compose -f docker-compose.test.yml down
	sudo rm -rf test_db
	docker-compose -f docker-compose.test.yml up -d
	npm run seed
	npm test
	docker-compose -f docker-compose.test.yml down
exec_clear:
	sudo rm -rf data
	rm -rf dist
	rm -rf files
	docker-compose up -d
	npm run seed
	docker-compose down