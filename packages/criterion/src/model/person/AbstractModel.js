Ext.define('criterion.model.person.AbstractModel', function() {

    return {
        extend : 'criterion.model.Abstract',

        requires : [],

        fields : [
            {
                name : 'personId',
                type : 'int',
                validators : [criterion.Consts.getValidator().NON_EMPTY]
            }
        ]
    };
});
