# Браузерные логи AutoChoice

В последнем подготовленном архиве `AutoChoice_BROWSER_CONSOLE_LOGS.zip` добавлено логирование в браузере.

## Где смотреть

1. Откройте актуальный сайт: http://51.250.44.9/
2. Нажмите **F12 → Console**.
3. В поле Filter введите `AutoChoice`.
4. Пройдите анкету и слепую дуэль.

Записи могут включать:

- `survey_started` — анкета запущена;
- `survey_question_completed` — вопрос пройден;
- `survey_completed` — фильтрация машин завершена;
- `duel_candidates_selected` — количество кандидатов для дуэли;
- `duel_vote_submitted` — выбор в раунде;
- `duel_finished` — дуэль завершена;
- `recommendations_calculated` — выданы рекомендации;
- `api_request` — время и статус запроса;
- `ui_error` — ошибка интерфейса.

## Важно

Факт успешной публикации именно ZIP с браузерными логами **не подтверждён**: ранее GitLab Merge Request завершался ошибкой `COPY AutoChoice_BROWSER_CONSOLE_LOGS.zip: no such file or directory`.

Если HTTP API отдаёт 404 при `GET /api/v1/sessions/{id}/...`, это отдельная проблема маршрута или данных, которую нужно отладить на FastAPI; GitHub Pages не запускает его.

**GitHub Pages в этом репозитории — переход на сайт Spirit VM, а не самостоятельная копия FastAPI.**
