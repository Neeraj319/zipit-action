FROM python:3.10.13-bullseye

COPY . /source

WORKDIR /app

ENV PYTHONUNBUFFERED=1

COPY ./requirements.txt /app/
RUN apt update -y && apt install -y zip && pip install -U pip && pip install -r requirements.txt

COPY main.py ./

ENTRYPOINT ["python", "/app/main.py"]
