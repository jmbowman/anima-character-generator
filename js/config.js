/*global require: false */
/**
 * RequireJS configuration for the app.  Sets library paths and dependencies.
 * @module config
 */
require.config({
    paths: {
        bootstrap: 'libs/bootstrap.min',
        jquery: 'libs/jquery-1.9.1.min',
        pubsub: 'libs/jq.pubsub',
        validate: 'libs/jquery.validate.min'
    },
    shim: {
        bootstrap: ['jquery'],
        pubsub: ['jquery'],
        validate: ['jquery']
    }
});
