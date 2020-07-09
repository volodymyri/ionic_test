Ext.define('criterion.controller.settings.general.Forms', function() {

    const API = criterion.consts.Api.API;

    return {
        alias : 'controller.criterion_settings_general_forms',

        extend : 'criterion.controller.GridView',

        requires : [
            'criterion.model.WebForm',
            'criterion.model.DataForm'
        ],

        config : {
            /**
             * Editor's configuration for data form.
             *
             * @type {Object}
             */
            editorDataForm : undefined
        },

        handleFormCopy : function(record) {
            let me = this,
                view = this.getView();

            view.setLoading(true);

            criterion.Api.requestWithPromise({
                url : Ext.String.format(
                    record.get('isWebForm') ? API.WEBFORM_COPY : API.DATAFORM_COPY,
                    record.get('formId')
                ),
                method : 'POST',
                jsonData : {
                    name : Ext.String.format('{0} {1}', i18n.gettext('Copy of'), record.get('name'))
                }
            }).then({
                success : function() {
                    view.setLoading(false);
                    Ext.defer(function() {
                        me.load();
                    }, 100);
                },
                failure : function() {
                    view.setLoading(false);
                }
            })
        },

        handleAddDataForm : function() {
            this.addDataForm();
        },

        // default - webform
        add : function() {
            this.startEdit(Ext.create('criterion.model.WebForm'), this.getEditor());
            this.updateGridToken(this.getNewEntityToken());
        },

        addDataForm : function() {
            this.startEdit(Ext.create('criterion.model.DataForm'), this.getEditorDataForm());
        },

        handleEditAction : function(record) {
            if (!record || record.get('isSystem')) {
                return;
            }

            if (this.getHandleRoute()) {
                this.updateGridToken(record.getId());
            } else {
                this.edit(record);
            }

            this.toggleAutoSync(false);
        },

        edit : function(record) {
            let me = this,
                view = this.getView(),
                isWebForm = record.get('isWebForm'),
                editor = isWebForm ? me.getEditor() : me.getEditorDataForm(),
                rec = isWebForm ? Ext.create('criterion.model.WebForm', {id : record.get('formId')}) : Ext.create('criterion.model.DataForm', {id : record.get('formId')});

            view.setLoading(true);

            rec.loadWithPromise().then(function(rec) {
                me.startEdit(rec, editor);
            }).always(function() {
                view.setLoading(false);
            });
        },

        handleWebFormImport : function(cmp, e) {
            if (!e.target.files || !e.target.files.length) {
                return
            }

            var view = this.getView(),
                me = this,
                reader = new FileReader();

            reader.onload = function(e) {
                var data,
                    missedTables = [];

                if (window.DOMParser) {
                    data = (new DOMParser()).parseFromString(e.target.result, "text/xml");
                } else {
                    data = new ActiveXObject("Microsoft.XMLDOM");
                    data.loadXML(e.target.result);
                }

                Ext.Array.each(data.getElementsByTagName('webformField'), function(field) {
                    if (field.getElementsByTagName('webformDataTypeCode')[0].innerHTML === 'DROPDOWN') {
                        var tableCode = field.getElementsByTagName('responseName')[0].innerHTML;

                        if (!criterion.CodeDataManager.codeTablesStore.getById(tableCode)) {
                            missedTables.push(tableCode)
                        }
                    }
                });

                if (missedTables.length) {
                    var items = Ext.Array.map(missedTables, function(tableCode) {
                            return {
                                xtype : 'combobox',
                                fieldLabel : tableCode,
                                store : criterion.CodeDataManager.getCodeTablesStore(),
                                queryMode : 'local',
                                valueField : 'name',
                                displayField : 'description',
                                editable : false,
                                allowBlank : false
                            }
                        }),
                        popup = Ext.create('criterion.ux.form.Panel', {
                            title : i18n.gettext('Select Missed Code Tables'),
                            plugins : [
                                {
                                    ptype : 'criterion_sidebar',
                                    modal : true,
                                    height : 500,
                                    width : criterion.Consts.UI_DEFAULTS.MODAL_MEDIUM_WIDTH
                                }
                            ],
                            defaults : criterion.Consts.UI_CONFIG.ONE_COL_FORM_WIDE,
                            layout : 'vbox',
                            items : items,
                            buttons : [
                                '->',
                                {
                                    xtype : 'button',
                                    reference : 'cancel',
                                    text : i18n.gettext('Cancel'),
                                    cls : 'criterion-btn-light',
                                    listeners : {
                                        click : function() {
                                            popup.destroy();
                                        }
                                    }
                                },
                                {
                                    xtype : 'button',
                                    text : i18n.gettext('Apply'),
                                    listeners : {
                                        click : function() {
                                            if (popup.isValid()) {
                                                var fields = Ext.Array.map(popup.items.items, function(item) {
                                                    return {
                                                        name : item.fieldLabel,
                                                        value : item.getValue()
                                                    }
                                                });

                                                submitData(fields);
                                                popup.destroy();
                                            }
                                        }
                                    }
                                }
                            ]
                        });

                    popup.show();
                } else {
                    submitData();
                }
            };

            reader.readAsText(e.target.files[0]);

            function submitData(additionalData) {
                if (!additionalData) {
                    additionalData = [];
                }

                view.setLoading(true);

                criterion.Api.submitFakeForm(additionalData, {
                    url : API.WEBFORM_IMPORT,
                    extraData : {
                        document : e.target.files[0]
                    },

                    success : function() {
                        view.setLoading(false);
                        cmp.reset();
                        me.load();
                        criterion.Utils.toast(i18n.gettext('Successfully imported.'));
                    },
                    failure : function() {
                        view.setLoading(false);
                        cmp.reset();
                    }
                });
            }
        }
    };

});
