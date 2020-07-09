Ext.define('criterion.model.employer.aca.Month', function() {

    var API = criterion.consts.Api.API,
        VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_ACA_MONTH
        },

        fields : [
            {
                name : 'acaId',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'month',
                type : 'date',
                dateFormat : criterion.consts.Api.DATE_MONTH_NUMERIC
            },
            {
                name : 'isAllMonth',
                type : 'boolean',
                persist : false
            },
            {
                name : 'monthText',
                type : 'string',
                depends : ['month', 'isAllMonth'],
                convert : function(v, record) {
                    var data = record.getData();
                    return data['isAllMonth'] ? i18n.gettext('All Months') : data['month'] && Ext.Date.format(data['month'], criterion.consts.Api.DATE_MONTH)
                },
                persist : false
            },
            {
                name : 'mecIndicator',
                type : 'boolean',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'ftEmployeeCount',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'totalEmployeeCount',
                type : 'integer',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'groupIndicator',
                type : 'boolean',
                validators : [VALIDATOR.NON_EMPTY]
            },
            {
                name : 'reliefIndicator',
                type : 'string'
            }
        ]
    };
});
