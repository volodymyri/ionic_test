Ext.define('criterion.model.light.Employer', function() {

    var VALIDATOR = criterion.Consts.getValidator();

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : criterion.consts.Api.API.EMPLOYER
        },

        fields : [
            {
                name : 'legalName',
                type : 'string',
                fieldLabel : i18n.gettext('Company Name')
            },
            {
                name : 'alternativeName',
                type : 'string',
                fieldLabel : i18n.gettext('Alternate Name')
            },
            {
                name : 'nationalIdentifier',
                type : 'string',
                fieldLabel : i18n.gettext('National Identifier')
            }
        ]
    };
});
