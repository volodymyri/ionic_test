Ext.define('criterion.view.ess.dashboard.workflow.CustomFields', function() {

    return {

        alias : 'widget.criterion_selfservice_workflow_custom_fields',

        extend : 'Ext.Panel',

        requires : [
            'criterion.model.CustomData',
            'criterion.view.customData.Field'
        ],

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        viewModel : {
            data : {
                showHeader : false
            }
        },

        bodyPadding : '25 25 5 25',

        header : {
            title : i18n.gettext('Custom fields'),
            padding : '10 0 0 0',
            hidden : true,
            bind : {
                hidden : '{!showHeader}'
            }
        },

        items : [
            {
                xtype : 'container',
                itemId : 'cfContainer'
            }
        ],

        setCustomFieldsData : function(customFieldValues, removedCustomValues) {
            var cfContainer = this.down('#cfContainer'),
                vm = this.getViewModel(),
                aCustomFieldValues = customFieldValues || [],
                aRemovedCustomValues = removedCustomValues || [];

            cfContainer.removeAll();

            vm.set('showHeader', (!!aCustomFieldValues.length || !!aRemovedCustomValues.length));

            Ext.Array.each(aCustomFieldValues, function(customFieldValue) {
                var customField;

                customField = cfContainer.add({
                    xtype : 'criterion_customdata_field',
                    readOnly : true,
                    margin : '0 0 20 0',
                    labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH
                });

                customField.updateRecord(Ext.create('criterion.model.CustomData', Ext.clone(customFieldValue.customField)));
                customField.setValue(customFieldValue.value);
            });

            // removed custom fields
            Ext.Array.each(aRemovedCustomValues, function(customFieldValue) {
                var customField;

                customField = cfContainer.add({
                    xtype : 'criterion_customdata_field',
                    readOnly : true,
                    margin : '0 0 20 0',
                    labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH
                });
                customField.updateRecord(Ext.create('criterion.model.CustomData', Ext.clone(customFieldValue.customField)));
                customField.setValue(customFieldValue.value);
            });
        }
    }
});
