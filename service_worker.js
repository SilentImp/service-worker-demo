// События ServiceWorkerGlobalScope
var cache_name = 'static_assets_v1';

// Вызывается при первом вызове воркера страницей
this.addEventListener('install', function(event) {
    event.waitUntil(
        caches.open(cache_name).then(function(cache) {
          return cache.addAll([
            'https://silentimp.github.io/service-worker-demo/',
            'https://silentimp.github.io/service-worker-demo/index.html',
            'https://silentimp.github.io/service-worker-demo/css/styles.css',
            'https://silentimp.github.io/service-worker-demo/images/photo.jpg'
            ]);
            console.log('Воркер инсталирован, данные кэшированы');
        }).catch(function(err) {
            console.log('Не удалось кешировать данные', err);
        })
    );
});


this.addEventListener('activate', function(event) {
    console.log('Воркер активирован', arguments);
});


// Перехватываем запрос со страницы
this.addEventListener('fetch', function(event) {

    console.log('URL: ', decodeURIComponent(event.request.url));
    console.log('FetchEvent: ', event);

    if (decodeURIComponent(event.request.url).indexOf('/comments/') > -1) {
        // Это URL API, который необходимо перехватить
        var body = new Blob([JSON.stringify({
                complete: true
            })], {
                type: 'application/json'
            }),
            headers = new Headers({
                'Content-Type': 'application/json'
            }),
            init = {
                "status": 200,
                "statusText": "API dummy responce",
                "headers": headers
            },
            responce = new Response(body, init);
        event.respondWith(responce);
        return;
    }

    // Проверяем нет ли запроса в кэш
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) {
                return response;
            } else {
                var request_clone = event.request.clone();
                return fetch(request_clone).then(function (response) {
                    var answer_clone = response.clone();

                    caches.open(cache_name).then(function(cache) {
                        cache.put(event.request, answer_clone);
                        console.log('Положили в кэш');
                    });

                    console.log('Отдали ответ');
                    return responce;
                }).catch(function (error) {
                    console.error('Запрос провалился: ', error);
                });
            }
        }).catch(function(error){
            console.error('Ошибка обращения в кэш: ', error);
        })
    );
});


// Мы получили сообщение от страницы
this.addEventListener('message', function(event) {
    switch (event.data.command) {
        case 'flush':
            console.log('Cбрасываем кэш');
            return caches.delete(cache_name);
            break;
    }
});
