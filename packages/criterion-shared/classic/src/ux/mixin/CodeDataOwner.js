Ext.define('criterion.ux.mixin.CodeDataOwner', function() {

    return {
        alternateClassName : [
            'criterion.ux.mixin.CodeDataOwner'
        ],

        extend : 'Ext.util.StoreHolder',

        mixinId : 'codeDataOwner',

        isCodeDataOwner : true,

        codeDataId : null,

        codeDataDisplayField : 'description',

        getCodeDataId : function() {
            return this.codeDataId;
        },

        getDisplayField : function() {
            return this.codeDataDisplayField;
        }
    };

});
