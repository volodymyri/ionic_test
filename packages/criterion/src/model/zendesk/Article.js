Ext.define('criterion.model.zendesk.Article', function() {

    return {
        extend : 'criterion.model.Abstract',

        fields : [
            {
                name : 'title',
                type : 'string'
            },
            {
                name : 'body',
                type : 'string'
            },
            {
                name : 'bodyPreview',
                depends : ['body'],
                calculate : function(data) {
                    return Ext.util.Format.ellipsis(Ext.util.Format.stripTags(data.body), 150, true);
                },
                persist: false
            },
            {
                name : 'html_url',
                type : 'string'
            }
            // more tbd
        ]
    };

});
