Используя Star Wars API (https://swapi.dev/) в качестве источника данных, реализовать SPA приложение React и Typescript, состоящее из двух страниц. 
На главной странице отобразить список или карточки персонажей, к списку добавить возможность пагинации и поиска с использованием API. 
Реализовать страницу с подробной информацией по выбранному персонажу. На эту страницу добавить возможность редактировать и сохранять информацию о персонаже локально, без отправки на сервер. 
 
Плюсы: 
+ Аккуратная верстка 
+ Использование UI фреймворка (Material, Ant, Bootstrap и т.п.) 
В качестве дополнительного задания: 
+ Тесты

Решение:
Статическая генерация:
Использование Next.js getStaticPaths и getStaticProps для предварительного рендеринга, что обеспечивает быстрое время загрузки и преимущества для SEO.
Кэширование:
Редактированные данные кэшируются с использованием утилитного модуля (cache), который оборачивает localStorage. Это обеспечивает сохранение данных избранного между сессиями без дополнительного запроса на сервер

Incremental Static Regeneration (ISR):
Статическая генерация: Страницы предварительно рендерятся во время сборки и выдаются как статичный HTML.
Регенирация: Страницы обновляются в фоновом режиме через заданный интервал (каждые 60 секунд). Когда запрашивается страница, которая требует пере-валидации, Next.js сначала возвращает устаревшую страницу, а затем обновляет её в фоне.

Обоснование генерации путей для подмножества токенов
Производительность:
Предварительная генерация путей обеспечивает почти мгновенную загрузку этих страниц для пользователей.
Масштабируемость:
Использование ISR с подмножеством предварительно сгенерированных путей позволяет приложению эффективно масштабироваться


TODO: (что не успела добить нормально)
add turbopack
add i18n
vercel setups (linters)
Testing - playright e2e testing (error on run)
Unit testing


