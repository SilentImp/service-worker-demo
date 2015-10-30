"use strict";
(function() {

    /**
     * Класс показывающий то, как происходит работа с Service Worker
     * @class
     */
    class ServiceWorkerController {

        /**
         * Инициализируем воркер, назначаем события
         * @constructor
         */
        constructor () {

            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('service_worker.js', {
                    scope: '/service-worker-demo/'
                }).then(this.success.bind(this)).catch(this.error.bind(this));
            }

            // После загрузки DOM назначим обработчик кнопке отправки сообщений
            this.ifDOMLoadedRun(()=>{
                document.querySelector('.send_request').addEventListener('click', this.sendDummyRequest.bind(this));

                document.querySelector('.refresh').addEventListener('click', this.refreshPage.bind(this));

            });
        }

        refreshPage () {
            document.location.reload(true);
        }

        ifDOMLoadedRun (callback) {
            let ready = new Promise((resolve, reject) => {
                if (document.readyState != "loading") return resolve();
                document.addEventListener("DOMContentLoaded", () => resolve());
            });
            ready.then(callback);
        }

        /**
         * В случае неудачной регистрации воркера
         * @param error текст ошибки
         */
        error(err) {
            console.log('Не удалось зарегистрировать ServiceWorker: ', err);
        }

        /**
         * В случае успешной регистрации воркера
         * @param registration {ServiceWorkerRegistration} интерфейс ServiceWorker API, представляющий регистрацию воркера.
         */
        success (registration) {

            // Воркер успешно зарегистрирован
            if (registration.installing) {
                console.log('Сервис воркер инсталируестся');
            } else if (registration.waiting) {
                console.log('Сервис воркер инсталирован');
            } else if (registration.active) {
                console.log('Сервис воркер активен');
                this.ifDOMLoadedRun(this.initEvents());
            }
        }

        /**
         * Назначаем события, которые позволят работать с воркером
         */
        initEvents () {
            // Отправка сообщений
            document.querySelector('.clear_cache').addEventListener('click', this.sendClearMessage.bind(this));
        }

        /**
         * Отправляем воркеру сообщение о том, что нужно очистить кэш
         */
        sendClearMessage () {
            let message = {
                'command': 'flush'
            };
            navigator.serviceWorker.controller.postMessage(message);
        }


        /**
         * Отправляем запроса, который должен подменять Service Worker
         */
        sendDummyRequest () {
            let xhr = new XMLHttpRequest();
            xhr.open('get', '/comments/', true);
            xhr.onreadystatechange = function () {
                if ( XMLHttpRequest.DONE != xhr.readyState ) {
                    return;
                }
                if ( 200 != xhr.status ) {
                    return;
                }
                console.log('text:', xhr.responseText );
            };
            xhr.send();
        }

    }


    new ServiceWorkerController;

})();
