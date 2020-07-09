Ext.define('criterion.data.reader.Json', function() {

    var securityProp = criterion.consts.Api.SECURITY_PROPERTY;

    return {

        extend : 'Ext.data.reader.Json',

        alias : 'reader.criterion_reader_json',

        rootProperty : criterion.consts.Api.DATA_ROOT,
        successProperty : criterion.consts.Api.SUCCESS_PROPERTY,
        totalProperty : 'count',

        /**
         * Override implements handling of security descriptors passed along with model's data.
         *
         * @param node
         * @param readOptions
         * @param entityType
         * @param includes
         * @param fieldExtractorInfo
         * @returns {*|Object}
         */
        extractRecord: function (node, readOptions, entityType, includes, fieldExtractorInfo) {
            var securityDescriptor, record;

            securityDescriptor = Ext.clone(node[securityProp]);
            delete node[securityProp]; // ensure that security descriptor won't be passed to model as part of data

            record = this.callParent(arguments);

            if (securityDescriptor) {
                record.setSecurityDescriptor && record.setSecurityDescriptor(securityDescriptor);
            }

            return record;
        }

    }
});
