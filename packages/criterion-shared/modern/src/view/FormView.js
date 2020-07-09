Ext.define('criterion.view.FormView', function() {

    return {

        alias : 'widget.criterion_formview',

        extend : 'Ext.form.Panel',

        requires : [
            'criterion.controller.FormView',
            'criterion.ux.field.Combobox',
            'criterion.ux.field.Time',
            'criterion.ux.field.Rating',
            'criterion.ux.field.CurrencyField',
            'criterion.ux.field.TagField'
        ],

        controller : {
            type : 'criterion_formview'
        },

        viewModel : {
            data : {
                record : null,
                recordName : 'the record',
                blockedState : false, // for blocking form elements + buttons
                submitBtnText : i18n.gettext('Submit'),
                deleteBtnText : i18n.gettext('Delete')
            },

            formulas : {
                isPhantom : function(data) {
                    return data('record') ? data('record').phantom : null
                },

                isDirty : {
                    bind : {
                        bindTo : '{record}',
                        deep : true
                    },
                    get : function(record) {
                        return record && record.dirty;
                    }
                },

                saveBtnText : function(data) {
                    return data('blockedState') ? 'Please wait...' : 'Save'
                },
                cancelBtnText : function() {
                    return 'Cancel';
                },

                hideDelete : function(data) {
                    return data('isPhantom');
                },

                hideSubmit : function(data) {
                    return data('isPhantom');
                },

                hideSave : function(data) {
                    return false;
                },

                formTitle : function(data) {
                    var recordName = data('recordName');
                    return data('isPhantom') ? 'Add ' + recordName : 'Edit ' + recordName
                }
            }
        },

        listeners : {
            scope : 'controller',
            painted : 'handlePainted'
        },

        items : [],

        loadRecord : Ext.emptyFn,

        initComponent : Ext.emptyFn

    };
});
