Ext.define('criterion.model.vertex.FilingStatusValues', function() {

    const API = criterion.consts.Api.API,
        TE_FILING_STATUSES = criterion.Consts.TE_FILING_STATUSES;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.VERTEX_FILING_STATUS_VALUES
        },

        fields : [
            {
                name : 'description',
                type : 'string'
            },
            {
                name : 'code',
                type : 'integer'
            },

            {
                name : 'isForBefore01012020',
                type : 'boolean',
                calculate : data => Ext.Array.contains([TE_FILING_STATUSES.SINGLE, TE_FILING_STATUSES.MARRIED], data.code),
                persist : false
            },
            {
                name : 'isW4_2020codes',
                type : 'boolean',
                calculate : data => Ext.Array.contains([
                    TE_FILING_STATUSES.SINGLE_OR_MARRIED_FILING_SEPARATELY,
                    TE_FILING_STATUSES.MARRIED_FILING_JOINTLY,
                    TE_FILING_STATUSES.HEAD_OF_HOUSEHOLD
                ], data.code),
                persist : false
            }
        ]
    };
});
