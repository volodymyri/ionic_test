Ext.define('criterion.controller.ess.resources.Forms', function() {

    return {

        extend : 'criterion.controller.GridView',

        alias : 'controller.criterion_selfservice_resources_forms',

        handleAssignAction(record) {
            let me = this,
                formContainer = Ext.create('criterion.ux.form.Panel', {
                    layout : {
                        type : 'vbox',
                        align : 'center'
                    },

                    title : i18n.gettext('Add Form'),

                    plugins : [
                        {
                            ptype : 'criterion_sidebar',
                            modal : true,
                            height : 'auto',
                            width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH
                        }
                    ],
                    modal : true,
                    draggable : false,

                    bodyPadding : '10 0',

                    buttons : [
                        '->',
                        {
                            xtype : 'button',
                            text : i18n.gettext('Cancel'),
                            cls : 'criterion-btn-light',
                            handler : () => {
                                formContainer.close();
                            }
                        },
                        {
                            xtype : 'button',
                            text : i18n.gettext('Add'),
                            cls : 'criterion-btn-primary',
                            handler : () => {
                                if (formContainer.isValid()) {
                                    me.formAssign(
                                        record.get('formId'),
                                        record.get('type'),
                                        formContainer.down('[name=dueDate]').getValue(),
                                        formContainer.down('[name=description]').getValue()
                                    );
                                    formContainer.close();
                                }
                            }
                        }
                    ],

                    items : [
                        {
                            xtype : 'textfield',
                            name : 'description',
                            allowBlank : false,
                            fieldLabel : i18n.gettext('Description')
                        },
                        {
                            xtype : 'datefield',
                            fieldLabel : i18n.gettext('Due Date'),
                            name : 'dueDate',
                            allowBlank : false
                        }
                    ]
                });

            formContainer.show();
            formContainer.down('[name=description]').focus();
        },

        formAssign(formId, formType, dueDate, comment) {
            let me = this;

            criterion.Api.requestWithPromise({
                url : criterion.consts.Api.API.FORM_ASSIGN,
                method : 'POST',
                jsonData : {
                    formId : formId,
                    formType : formType,
                    comment : comment,
                    dueDate : Ext.Date.format(dueDate, criterion.consts.Api.DATE_FORMAT)
                }
            }).then((req) => {
                Ext.StoreManager.lookup(criterion.Consts.GLOBAL_STORES.WORKFLOW_PENDING_LOGS.storeId).loadWithPromise({
                    params : {
                        employeeId : me.getEmployeeId(),
                        withoutDetails : true
                    }
                }).then(() => {
                    me.redirectTo(criterion.consts.Route.SELF_SERVICE.DASHBOARD_INBOX + '/' + req.id, null);
                });
            });
        }
    };

});
