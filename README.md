# AutoChoice

Интерактивный подбор автомобилей: анкета → слепые дуэли → объяснимые рекомендации.

## Актуальная версия (22.11.2026)

- **Сайт с FastAPI:** http://51.250.44.9/
- **Swagger:** http://51.250.44.9/docs
- **Healthcheck:** http://51.250.44.9/health
- **GitLab с текущей сборкой:** https://gitlab.t-education.com/hack-ovb-04/machinka
- **GitHub Pages:** https://raa903004-ops.github.io/sgugit/ — ведёт на сервер с рабочей версией.

## Почему GitHub Pages перенаправляет на сервер

Последняя версия AutoChoice использует FastAPI, PostgreSQL и API /api/v1. GitHub Pages поддерживает лишь статические сайты и не может исполнять Python. Прежняя версия в docs/ была устаревшей статической сборкой, поэтому точка входа перенаправляет на актуальный работающий сервис.

## Исходный проект

Последний ZIP: AutoChoice_NEW_tests_logs_presentation.zip. Внутри:
- autochoice-backend/web/ — фронтенд и изображения;
- autochoice-backend/app/ — API, алгоритмы и JSON-логирование;
- autochoice-backend/data/ — каталог и фотографии;
- autochoice-backend/tests/ — тесты;
- autochoice-backend/docs/AutoChoice_with_tests.pdf — презентация.

**Полные исходники новой FastAPI-версии ещё не синхронизированы в этот GitHub-репозиторий.** Сборка и деплой выполняются через GitLab.

## Тесты и мониторинг

Pipeline GitLab #27666 завершился успешно. Точный процент покрытия всего приложения для этой версии не подтверждён. JSON-логи выводятся в stdout; поступление в Sage отдельно не подтверждено.

- [Тестирование](docs/TESTING.md)
- [Архитектура](docs/ARCHITECTURE.md)
## Логи браузера

[Инструкция по логам в Console](docs/CONSOLE_LOGS.md). Последний подготовленный ZIP содержит события анкеты, дуэлей и выдачи рекомендаций, но его успешный деплой на VM требует отдельной проверки.
