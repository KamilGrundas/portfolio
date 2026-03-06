FROM python:3.12-slim

WORKDIR /app

# Instalacja zależności systemowych
RUN apt-get update && apt-get install -y netcat-openbsd && rm -rf /var/lib/apt/lists/*

# Instalacja zależności Pythona
COPY pyproject.toml uv.lock ./
RUN pip install --upgrade pip && pip install uv && uv pip install --system -r pyproject.toml

# Kopiowanie kodu aplikacji
COPY . .

# Kopiowanie i przygotowanie skryptu prestart
COPY prestart.sh /app/prestart.sh
RUN sed -i 's/\r$//' /app/prestart.sh && chmod +x /app/prestart.sh

# Uruchomienie aplikacji
CMD ["/bin/bash", "/app/prestart.sh"]