FROM node:23-bookworm-slim AS node-build

WORKDIR /app

COPY ["package.json", "postcss.config.mjs", "webpack.config.js", "./"]
COPY assets ./assets/
RUN npm install
RUN npx webpack --mode production

FROM python:3.14.0a4-slim-bookworm

WORKDIR /app/source

COPY dashboard_app ./dashboard_app/
COPY dynamic_dashboard ./dynamic_dashboard/
COPY manage.py .
COPY users ./users/
COPY requirements.txt .
COPY .env .

COPY --from=node-build /app/dashboard_app/static/dashboard_app dashboard_app/static/dashboard_app

RUN apt-get update \
&& pip install -r requirements.txt

RUN python manage.py makemigrations \
&& python manage.py migrate \
&& python manage.py collectstatic

EXPOSE 8000

CMD ["python3", "manage.py", "runserver", "0:8000", "--insecure"]
