(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

(function () {

    /**
     * Класс показывающий то, как происходит работа с Service Worker
     * @class
     */

    var ServiceWorkerController = (function () {

        /**
         * Инициализируем воркер, назначаем события
         * @constructor
         */

        function ServiceWorkerController() {
            var _this = this;

            _classCallCheck(this, ServiceWorkerController);

            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.register('service_worker.js?x12', {
                    scope: '/service-worker-demo/'
                }).then(this.success.bind(this))['catch'](this.error.bind(this));
            }

            // После загрузки DOM назначим обработчик кнопке отправки сообщений
            this.ifDOMLoadedRun(function () {
                document.querySelector('.send_request').addEventListener('click', _this.sendDummyRequest.bind(_this));

                document.querySelector('.refresh').addEventListener('click', _this.refreshPage.bind(_this));
            });
        }

        _createClass(ServiceWorkerController, [{
            key: 'refreshPage',
            value: function refreshPage() {
                document.location.reload(true);
            }
        }, {
            key: 'ifDOMLoadedRun',
            value: function ifDOMLoadedRun(callback) {
                var ready = new Promise(function (resolve, reject) {
                    if (document.readyState != "loading") return resolve();
                    document.addEventListener("DOMContentLoaded", function () {
                        return resolve();
                    });
                });
                ready.then(callback);
            }

            /**
             * В случае неудачной регистрации воркера
             * @param error текст ошибки
             */
        }, {
            key: 'error',
            value: function error(err) {
                console.log('Не удалось зарегистрировать ServiceWorker: ', err);
            }

            /**
             * В случае успешной регистрации воркера
             * @param registration {ServiceWorkerRegistration} интерфейс ServiceWorker API, представляющий регистрацию воркера.
             */
        }, {
            key: 'success',
            value: function success(registration) {

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
        }, {
            key: 'initEvents',
            value: function initEvents() {
                // Отправка сообщений
                document.querySelector('.clear_cache').addEventListener('click', this.sendClearMessage.bind(this));
            }

            /**
             * Отправляем воркеру сообщение о том, что нужно очистить кэш
             */
        }, {
            key: 'sendClearMessage',
            value: function sendClearMessage() {
                var message = {
                    'command': 'flush'
                };
                navigator.serviceWorker.controller.postMessage(message);
            }

            /**
             * Отправляем запроса, который должен подменять Service Worker
             */
        }, {
            key: 'sendDummyRequest',
            value: function sendDummyRequest() {
                var xhr = new XMLHttpRequest();
                xhr.open('get', '/comments/', true);
                xhr.onreadystatechange = function () {
                    if (XMLHttpRequest.DONE != xhr.readyState) {
                        return;
                    }
                    if (200 != xhr.status) {
                        return;
                    }
                    console.log('text:', xhr.responseText);
                    alert(xhr.responseText);
                };
                xhr.send();
            }
        }]);

        return ServiceWorkerController;
    })();

    new ServiceWorkerController();
})();

},{}]},{},[1]);
