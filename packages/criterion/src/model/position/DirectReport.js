/**
 * @deprecated
 */
Ext.define('criterion.model.position.DirectReport', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict;

    return {
        extend : 'criterion.model.Abstract',

        idProperty : {
            name : 'assignmentId',
            type : 'auto'
        },

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_POSITION_DIRECT_REPORT,
            reader : 'treeData'
        },

        fields : [
            {
                name : 'jobCode',
                type : 'string'
            },
            {
                name : 'desc',
                type : 'string'
            },
            {
                name : 'email',
                type : 'string'
            },
            {
                name : 'effectiveDate',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_FORMAT
            },
            {
                name : 'personName',
                type : 'string',
                allowNull : true
            },
            {
                name : 'personId',
                type : 'int',
                allowNull : true,
                defaults : null
            },
            {
                name : 'phone',
                type : 'string',
                allowNull : true
            },
            {
                name : 'positionId',
                type : 'int'
            },
            {
                name : 'subordinatesCount',
                type : 'int'
            },
            {
                name : 'supervisorName',
                type : 'string',
                allowNull : true
            },
            {
                name : 'combined',
                type : 'string',

                calculate : function(data) {
                    return data.jobCode + ' (' + (data.personName || 'unassigned') + ')';
                }
            }
        ]
    };
});
