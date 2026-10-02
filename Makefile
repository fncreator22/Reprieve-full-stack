.PHONY: up down seed test lint eval smoke reset web

up:            ## FalkorDB + API
	docker compose up -d --build
down:
	docker compose down
seed:          ## regenerate the deterministic sample bundle
	python3 scripts/generate_seed.py
test:          ## unit + graph + contract tests (needs FalkorDB on :6379)
	cd backend && uv run pytest -q
lint:
	cd backend && uv run ruff check . && uv run mypy
eval:          ## recall / false positives / calibration → eval/report.md
	cd backend && uv run python ../eval/run_eval.py
smoke:         ## end-to-end smoke against a running API
	cd backend && uv run python ../scripts/smoke.py
reset:         ## drop all dev_ graphs
	cd backend && uv run python ../scripts/reset_graphs.py
web:
	cd frontend && pnpm dev
