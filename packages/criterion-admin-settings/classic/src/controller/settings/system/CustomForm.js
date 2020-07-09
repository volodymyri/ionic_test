// @deprecated
Ext.define('criterion.controller.settings.system.CustomForm', function() {

    return {

        extend : 'criterion.controller.FormView',

        alias : 'controller.criterion_settings_system_customform',

        handleRecordLoad : function(record) {
            var customdataGrid = this.lookupReference('customdataGrid');

            customdataGrid.setCustomFormId(record.getId());
            customdataGrid.getStore().setAutoSync(false);
            customdataGrid.lookupReference('customizableEntityField').select(
                criterion.CodeDataManager.getCodeDetailRecord('code', 'FORM', criterion.consts.Dict.ENTITY_TYPE)
            );

            !record.phantom && customdataGrid.getController().load();
        },

        handleSubmitClick : function() {
            var me = this,
                record = this.getRecord(),
                form = me.getView(),
                parentGridController = form._connectedView.getController(),
                customdataGridStore = this.lookupReference('customdataGrid').getStore();

            if (form.isValid()) {
                record.set('name', form.getValues().name);
                if (record.phantom) {
                    record.save({
                        success : function(record) {
                            Ext.Array.each(customdataGridStore.getModifiedRecords(), function(rec) {
                                rec.set('customFormId', record.getId());
                            });
                            customdataGridStore.sync();
                            parentGridController.load();
                            me.close();
                        }
                    });
                } else {
                    customdataGridStore.sync();
                    parentGridController.load();
                    this.callParent(arguments);
                }
            } else {
                me.focusInvalidField();
            }
        }

    };
});
