Ext.define('criterion.model.security.profile.Report', function() {

    return {
        extend : 'criterion.model.security.Abstract',

        proxy : {
            type : 'memory'
        },

        serializeAccessLevelFn : function(value, record) {
            return [0, +record.get('accessView'), +record.get('accessMemorize'), 0].join('');
        },

        fields : [
            {
                name : 'securityProfileId',
                type : 'integer'
            },
            {
                name : 'reportId',
                type : 'int'
            },
            {
                name : 'reportName',
                type : 'string'
            },
            {
                name : 'accessView',
                type : 'criterion_status_bit',
                bitMask : parseInt('0100', 2)
            },
            {
                name : 'accessMemorize',
                type : 'criterion_status_bit',
                bitMask : parseInt('0010', 2)
            }
        ]
    };
});
