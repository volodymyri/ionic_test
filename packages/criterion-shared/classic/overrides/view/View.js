Ext.define('criterion.overrides.view.View', {

    override : 'Ext.view.View',

    generateClassesBlackList : false,
    classesBlackList : [],

    getRecord: function(node){
        return this.dataSource ? this.callParent(arguments) : null; // CRITERION-4908, some issues with delegated events in hidden / unbound abstract view
    },

    initComponent : function() {
        this.callParent(arguments);

        if (this.generateClassesBlackList) {
            this.classesBlackList = criterion.Utils.getClassesBlackList(this.lookupTpl('tpl'));
        }
    }

});
