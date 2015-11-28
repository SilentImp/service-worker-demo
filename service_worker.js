// События ServiceWorkerGlobalScope
var cache_name = 'static_assets_vx';

// Вызывается при первом вызове воркера страницей
this.addEventListener('install', function(event) {

    caches.open(cache_name).then(function(cache) {
        return cache.addAll([
            'https://silentimp.github.io/service-worker-demo/', 'https://silentimp.github.io/service-worker-demo/index.html', 'https://silentimp.github.io/service-worker-demo/css/styles.css', 'https://silentimp.github.io/service-worker-demo/images/photo.jpg'
        ]);
        console.log('Воркер инсталирован, данные кэшированы');

    }).catch(function(err) {
        console.log('Не удалось кешировать данные', err);

    });

});


this.addEventListener('activate', function(event) {
    console.log('Активирован', arguments);
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
        caches.open(cache_name).then(function(cache) {

            return cache.match(event.request).then(function(response) {

                if (response) {
                    console.log('Запрос был найден в кэш:', response);
                    return response;
                } else {
                    console.log('Запрос не был найден в кэш');
                    cache.add(decodeURIComponent(event.request.url));
                    return fetch(event.request);
                }

            }).catch(function(error) {
                console.error('Ошибка обращения в кэш:', error);
                throw error;
            });

        }).catch(function(error) {
            console.error('Ошибка открытия кэша:', error);
            throw error;
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
