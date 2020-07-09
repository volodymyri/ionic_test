Ext.define('criterion.model.light.Position', function() {

    var API = criterion.consts.Api.API,
        DICT = criterion.consts.Dict;

    return {
        extend : 'criterion.model.Abstract',

        proxy : {
            type : 'criterion_rest',
            url : API.EMPLOYER_POSITION
        },

        fields : [
            {
                name : 'code',
                type : 'string',
                persist : false,
                fieldLabel : i18n.gettext('Position Code')
            },
            {
                name : 'title',
                type : 'string',
                persist : false,
                fieldLabel : i18n.gettext('Position Title')
            },
            {
                name : 'employerId',
                type : 'int',
                persist : false
            }
        ]
    };
});
