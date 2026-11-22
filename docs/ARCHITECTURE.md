# Архитектура AutoChoice

```mermaid
flowchart TD
    B[Браузер: анкета, дуэли, результат] --> F[FastAPI: сайт и /api/v1]
    F --> R[Алгоритм фильтрации и ранжирования]
    F --> P[(PostgreSQL)]
    F --> C[Каталог и фотографии]
    F --> L[JSON-логи stdout]
    L -. через сборщик .-> S[Sage]
    G[GitLab CI/CD] --> D[Docker на Spirit VM]
    D --> F
```

## Компоненты

- web/ — HTML, CSS, JavaScript и изображения;
- app/main.py — сервер FastAPI, Swagger, маршруты и API;
- app/ — правила подбора и работа с данными;
- data/ — каталог 30 автомобилей и кадры слепых дуэлей;
- PostgreSQL — хранилище данных;
- Docker — развёртывание на Spirit VM;
- GitLab CI/CD — тестирование, сборка образа, деплой;
- app/observability.py — журналирование запросов в JSON.

GitHub Pages работает лишь со статическими файлами, поэтому он ведёт на запущенный на VM сайт с Python API.