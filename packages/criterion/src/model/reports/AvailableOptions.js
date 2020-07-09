Ext.define('criterion.model.reports.AvailableOptions', function() {

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.model.reports.options.AvailableFilter',
            'criterion.model.reports.options.Column',
            'criterion.model.reports.options.Sorter',
            'criterion.model.reports.options.Grouper',
            'criterion.model.reports.options.Parameter'
        ],

        fields : [
            {
                type : 'boolean',
                name : 'hasEmployerFilter'
            },
            {
                name : 'availableFormats',
                persist : false
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.reports.options.AvailableFilter',
                name : 'filters',
                associationKey : 'filters'
            },
            {
                model : 'criterion.model.reports.options.Column',
                name : 'availableColumns',
                associationKey : 'availableColumns'
            },
            {
                model : 'criterion.model.reports.options.Sorter',
                name : 'orderBy',
                associationKey : 'orderBy'
            },
            {
                model : 'criterion.model.reports.options.Grouper',
                name : 'groupBy',
                associationKey : 'groupBy'
            },
            {
                model : 'criterion.model.reports.options.Parameter',
                name : 'parameters',
                associationKey : 'parameters'
            }
        ],

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.REPORT_AVAILABLE_OPTIONS
        }
    };

});
