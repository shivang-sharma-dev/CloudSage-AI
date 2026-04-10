# Monitoring Stack
#
# grafana/
#   dashboards/     — Pre-built Grafana dashboard JSONs
#                     (FastAPI latency, DB connections, cost analysis metrics)
# prometheus/
#   prometheus.yml  — Scrape config targeting backend + postgres exporter
# loki/
#   loki-config.yml — Log aggregation for all 3 containers
#
# Stack: Prometheus + Grafana + Loki (standard PLG stack)
# Deploy with: docker compose -f docker-compose.monitoring.yml up -d
