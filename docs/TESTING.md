# Тестирование AutoChoice

В текущем ZIP файлы тестов находятся в autochoice-backend/tests/, логирование — в autochoice-backend/app/observability.py.

Запуск тестов в каталоге бэкенда:

```bash
pip install -r requirements.txt
python -m pytest tests -q
```

Некоторые интеграционные тесты требуют PostgreSQL. GitLab pipeline #27666 успешно выполнил задание тестирования и деплой. Полный набор и процент покрытия всего текущего приложения отдельно здесь не измерены.

## Логи

JSON-логи FastAPI выводятся в stdout.

```bash
cd ~/app
sudo docker compose logs --tail=100 app
```

Сбор этих логов в Sage/Grafana ещё нужно проверить отдельно.

- GitLab pipeline: https://gitlab.t-education.com/hack-ovb-04/machinka/-/pipelines/27666
- Sage Search: https://sage.spirit.t-education.com/search