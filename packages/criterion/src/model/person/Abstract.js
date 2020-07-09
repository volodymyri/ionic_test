Ext.define('criterion.model.person.Abstract', function() {

    return {
        extend : 'criterion.model.Abstract',

        requires : [
            'criterion.store.Base'
        ],

        fields : [
            {
                name : 'personId',
                type : 'int',
                reference : {
                    parent : 'Person',
                    inverse : {
                        storeConfig : {
                            type : 'criterion_base'
                        }
                    }
                },
                validators : [
                    criterion.Consts.getValidator().NON_EMPTY
                ]
            }
        ]
    };
});
