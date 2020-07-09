Ext.define('criterion.model.reports.Options', function() {

    return {
        extend : 'criterion.model.employer.Abstract',

        requires : [
            'criterion.model.reports.options.Filter',
            'criterion.model.reports.options.Column',
            'criterion.model.reports.options.TableSettings',
            'criterion.model.reports.options.Sorter',
            'criterion.model.reports.options.Grouper',
            'criterion.model.reports.options.Parameter'
        ],

        fields : [
            {
                name : 'advancedParams',
                defaultValue : []
            },
            {
                name : 'groupByParams',
                defaultValue : []
            },
            {
                name : 'isExternalLoaded',
                type : 'boolean',
                persist : false,
                defaultValue : false
            },
            {
                name : 'availableFormats',
                persist : false
            },
            {
                name : 'helpLabel',
                persist : false
            }
        ],

        hasMany : [
            {
                model : 'criterion.model.reports.options.Filter',
                name : 'filters',
                associationKey : 'filters'
            },
            {
                model : 'criterion.model.reports.options.TableSettings',
                name : 'tableSettings',
                associationKey : 'tableSettings'
            },
            {
                model : 'criterion.model.reports.options.Column',
                name : 'hiddenColumns',
                associationKey : 'hiddenColumns'
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
            url : criterion.consts.Api.API.REPORT_OPTIONS
        }
    };

});
