FROM node:23-bookworm-slim AS node-build
RUN mkdir /app
WORKDIR /app

COPY ["package.json", "postcss.config.mjs", "webpack.config.js", "tailwind.config.js", "./"]
COPY assets ./assets/
COPY dashboard_app ./dashboard_app/
RUN npm install
RUN npx webpack --mode production

FROM python:3.14.0a4-slim-bookworm

WORKDIR /app

COPY dashboard_app ./dashboard_app/
COPY dynamic_dashboard ./dynamic_dashboard/
COPY manage.py .
COPY users ./users/
COPY requirements.txt .

COPY --from=node-build /app/dashboard_app/static/dashboard_app dashboard_app/static/dashboard_app


COPY start.sh ./start.sh
RUN apt-get update \
  && pip install -r requirements.txt \
  && pip3 install --no-cache-dir gunicorn


RUN mkdir /data
RUN chmod +x ./start.sh



CMD ["./start.sh"]
