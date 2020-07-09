Ext.define('criterion.model.employer.course.class.ClassAttachment', function() {

    var API = criterion.consts.Api.API;

    return {
        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'documentTypeCd',
                type : 'integer'
            },
            {
                name : 'name',
                type : 'string'
            },
            {
                name : 'uploadUrl',
                persist : false,
                type : 'string'
            }
        ]
    };
});
