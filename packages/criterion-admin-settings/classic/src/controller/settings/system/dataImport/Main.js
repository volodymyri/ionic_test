Ext.define('criterion.controller.settings.system.dataImport.Main', function() {

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_settings_data_import',

        listen : {
            component : {
                field : {
                    change : 'onFieldChange'
                }
            }
        },

        handleActionsFilterChange : function(store) {
            let vm = this.getViewModel(),
                template = vm.get('template'),
                actionCombo = this.lookup('actionCombo'),
                firstAction = store.getAt(0);

            if (template) {
                actionCombo.select(firstAction);
                this.handleActionSelect(actionCombo, firstAction);
            }
        },

        handleActionSelect : function(combo, action) {
            let vm = this.getViewModel(),
                template = vm.get('template'),
                activeTemplatePanel = this.lookupReference(Ext.util.Format.format('template_{0}', template.getId())),
                templateOptionsPanel = this.lookupReference('templateOptionsPanel');

            if (!action) {
                return;
            }

            if (activeTemplatePanel) {
                let actionsCardPanel = activeTemplatePanel.down('#actionsCardPanel');

                if (actionsCardPanel) {
                    actionsCardPanel.setActiveItem(action.getId());
                }

                templateOptionsPanel.setActiveItem(activeTemplatePanel);
            } else {
                console.warn(`[W] Unknown template: template_${template.getId()}`);
            }
        },

        handleAfterRender : function() {
            let demographicsTemplate = this.getView().down('#templateFileField');

            this.addDndFileHandlers(demographicsTemplate);
        },

        addDndFileHandlers : function(field) {
            let fieldEl = field.getEl(),
                templateOptionsPanel = this.lookup('templateOptionsPanel'),
                file, activeTemplateViewController;

            fieldEl.on({
                dragover : function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    fieldEl.addCls('drag-over');
                },
                drop : function(e) {
                    e.preventDefault();
                    e.stopPropagation();

                    file = e.event.dataTransfer && e.event.dataTransfer.files && e.event.dataTransfer.files[0];

                    activeTemplateViewController = templateOptionsPanel.getLayout().getActiveItem().getController();
                    activeTemplateViewController.templateFile = file;

                    if (field && file) {
                        field.inputEl.dom.value = file.name;
                    }

                    fieldEl.removeCls('drag-over');
                },
                dragleave : function(e) {
                    e.preventDefault();
                    e.stopPropagation();
                    fieldEl.removeCls('drag-over');
                }
            });
        },

        handleSelectTemplateFile : function(fld, value) {
            let fileInputEl = fld.fileInputEl.el.dom,
                newValue = value.replace(/C:\\fakepath\\/g, ''),
                templateOptionsPanel = this.lookup('templateOptionsPanel'),
                activeTemplateViewController = templateOptionsPanel.getLayout().getActiveItem().getController();

            fld.setRawValue(newValue);
            activeTemplateViewController.templateFile = fileInputEl && fileInputEl.files && fileInputEl.files[0];
        },

        downloadTemplateHandler5C() {
            const INCLUDE_RELEVANT = 1,
                  INCLUDE_ALL = 2;

            let me = this,
                dfd = Ext.create('Ext.Deferred'),
                confirmWindow;

            confirmWindow = Ext.create({
                xtype : 'window',
                title : i18n.gettext('Download Template'),
                modal : true,
                closable : true,
                draggable : true,
                plugins : [
                    {
                        ptype : 'criterion_sidebar',
                        modal : true,
                        height : 'auto',
                        width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH
                    }
                ],

                buttons : [
                    {
                        xtype : 'button',
                        text : i18n.gettext('Cancel'),
                        cls : 'criterion-btn-light',
                        handler : _ => {
                            confirmWindow.fireEvent('close');
                        }
                    },
                    '->',
                    {
                        xtype : 'button',
                        text : i18n.gettext('Download'),
                        handler : _ => {
                            confirmWindow.fireEvent('download');
                        }
                    }
                ],

                bodyPadding : 20,

                items : [
                    {
                        xtype : 'radiogroup',
                        columns : 1,
                        vertical : true,
                        items : [
                            {
                                boxLabel : i18n.gettext('Include tax names relevant to employer and employee locations'),
                                name : 'include',
                                inputValue : INCLUDE_RELEVANT,
                                checked : true
                            },
                            {
                                boxLabel : i18n.gettext('Include all tax names'),
                                name : 'include',
                                inputValue : INCLUDE_ALL
                            }
                        ]
                    }
                ]
            });

            confirmWindow.show();
            confirmWindow.on({
                close : _ => {
                    confirmWindow.destroy();
                    dfd.reject();
                },
                download : _ => {
                    let radioValue = confirmWindow.down('radiogroup').getValue();

                    confirmWindow.destroy();

                    dfd.resolve(radioValue['include'] === INCLUDE_RELEVANT ? { isRelevantTaxes : true } : {});
                }
            });

            return dfd.promise;
        },

        downloadTemplateHandler : function(cmp) {
            let me = this,
                vm = this.getViewModel(),
                template = vm.get('template'),
                selectedEmployer = vm.get('employer'),
                modulesCardPanel = this.lookupReference('templateOptionsPanel'),
                module = modulesCardPanel.getLayout().getActiveItem(),
                formValues = module.getValues(),
                templateDownloadParamsArr = template.get('templateDownloadParams'),
                templateDownloadParams = {},
                templateUrl = cmp.templateUrl,
                beforeDownloadTemplateMethod = cmp.beforeDownloadTemplateMethod;

            if (!template.get('isEmployerIndependent')) {
                templateDownloadParams['employerId'] = selectedEmployer.getId();
            }

            if (templateDownloadParams) {
                Ext.each(templateDownloadParamsArr, function(templateDowloadParam) {
                    templateDownloadParams[templateDowloadParam] = formValues[templateDowloadParam];
                });
            }

            if (beforeDownloadTemplateMethod && Ext.isFunction(this[beforeDownloadTemplateMethod])) {
                this[beforeDownloadTemplateMethod]().then(params => {
                    Ext.apply(templateDownloadParams, params || {});

                    me.actDownloadTemplate(templateUrl, templateDownloadParams);
                })

                return;
            }

            this.actDownloadTemplate(templateUrl, templateDownloadParams);

        },

        actDownloadTemplate(templateUrl, templateDownloadParams) {
            let url = Ext.urlAppend(templateUrl, Ext.Object.toQueryString(templateDownloadParams));

            window.open(url, '_blank');
        },

        downloadDefaultsHandler : function(button) {
            window.open(button.defaultsUrl, '_blank');
        },

        onFieldChange : function(field) {
            if (field.isHidden()) {
                return;
            }

            this.resetNextFields(field);
        },

        resetNextFields : function(field) {
            let form = field.up('form'),
                formFields = form.query('field'),
                resetFieldsFromIndex = Ext.Array.indexOf(formFields, field),
                fieldsToReset = Ext.Array.slice(formFields, resetFieldsFromIndex + 1, formFields.length),
                templateOptionsPanel = this.lookupReference('templateOptionsPanel'),
                templateFileField = form.down('#templateFileField'),
                employerField = this.lookup('employerCombo'),
                employers = employerField.getStore(),
                firstEmployer = employers.getAt(0);

            if (templateOptionsPanel.down(field) || field === templateFileField) {
                return;
            }

            Ext.each(fieldsToReset, function(formField) {
                if (templateOptionsPanel.down(formField)) {
                    formField.setValue(null);
                } else if (field !== employerField) {
                    formField.reset();
                }
            });

            if (field !== employerField) {
                employerField.select(firstEmployer);
            }
        },

        handleSubmit : function() {
            let modulesCardPanel = this.lookupReference('templateOptionsPanel'),
                module = modulesCardPanel.getLayout().getActiveItem(),
                moduleViewController = module.lookupController();

            if (!moduleViewController.isValidForm()) {
                return;
            }

            moduleViewController.beforeSubmit();

            module.fireEvent('submit');
        },

        handleCancel : function() {
            let templateOptionsPanel = this.lookupReference('templateOptionsPanel');

            templateOptionsPanel.getLayout().getActiveItem().fireEvent('reset');
        }
    }
});
