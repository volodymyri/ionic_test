/**
 * REST Proxy.
 */
Ext.define('criterion.data.proxy.Rest', function() {

    return {

        alias : 'proxy.criterion_rest',

        extend : 'Ext.data.proxy.Rest',

        requires : [
            'criterion.data.reader.Json',
            'criterion.Api',
            'criterion.data.writer.Json'
        ],

        batchOrder : 'destroy,create,update', // order was change for a correct validation in the BE part

        reader : {
            type : 'criterion_reader_json'
        },

        writer : {
            type : 'criterion_json'
        },

        /**
         * Makes request.
         *
         * @param opts
         */
        request : function request(opts) {
            return criterion.Api.request(opts);
        },

        /**
         * @overrides
         *
         * Fires a request
         * @param {Ext.data.Request} The request
         * @return {Ext.data.Request} The request
         * @private
         */
        sendRequest : function(request) {
            var cfg = request.getCurrentConfig();

            // move signature field from record to jsonData for DELETE request
            if (cfg['method'] === 'DELETE' && cfg['params'] && cfg['params']['isWorkflow'] && cfg['records'].length && cfg['records'][0].get('signature')) {
                cfg['jsonData']['signature'] = cfg['records'][0].get('signature');
            }

            request.setRawRequest(this.request(cfg));
            this.lastRequest = request;

            return request;
        },

        /**
         * @overrides
         *
         * convert url for mock-api
         * from this: http://criterionhcm.local/src/web/api-mock/wageBasis/group/1?_dc=1414594108482
         * to this: http://criterionhcm.local/src/web/api-mock/wageBasis/group-1.json
         *
         * @param {Object} request
         */
        buildUrl : function(request) {
            var me = this,
                res;

            res = me.callParent(arguments);

            if (/api-mock/.test(res)) {

                var action = request['_action'];

                /**
                 * @param match
                 * @param p1        1
                 * @param p2        ?_dc=1495460426069
                 * @param offset
                 * @param str
                 * @return {*|string}
                 */
                var replacer = function(match, p1, p2, offset, str) {
                    var ret = '';

                    if (action === 'create') {
                        ret += '-' + action;
                    } else if (action === 'destroy' || action === 'destroy') {
                        ret += p1 + '-' + action;
                    } else if (p1) {
                        ret += '-' + p1;
                    }

                    ret += '.json';

                    return ret;
                };

                res = res.replace(/\/?([\d]*)?(\?.*)/, replacer);
                res = res.substring(1, res.length);
            }

            return res;
        },

        getMethod : function(request) {
            if (/api-mock/.test(request.getUrl())) {
                if (request._action === 'create' || request._action === 'update') {
                    console.log('Create or update operation on api-mock. Request data: ', request);
                }
                return 'GET';
            } else {
                return this.callParent(arguments);
            }
        }
    };

});
