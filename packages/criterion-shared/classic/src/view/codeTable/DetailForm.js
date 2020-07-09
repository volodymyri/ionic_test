Ext.define('criterion.view.codeTable.DetailForm', function() {

    var CODETABLE_FIELDS_CONFIG = criterion.Consts.CODETABLE_FIELDS_CONFIG;

    return {
        alias : 'widget.criterion_settings_codetable_detail_form',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.codeTable.DetailForm'
        ],

        title : i18n.gettext('Code Table Details'),

        cls : 'criterion-settings-codetable-detail-form',

        controller : {
            type : 'criterion_codetable_detail_form',
            externalUpdate : false
        },

        viewModel : {
            data : {
                local : null,
                locals : {},
                localsVisibility : {}
            }
        },

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        bodyPadding : '25 10',

        defaults : criterion.Consts.UI_CONFIG.ONE_COL_FORM,

        initComponent : function() {
            var data = this.codeTableRecord.getData(),
                vm = this.getViewModel(),
                localFields = [],
                lStore = criterion.CodeDataManager.getStore(criterion.consts.Dict.LOCALIZATION_LANGUAGE),
                localsVisibility = {},
                customFields = [];

            criterion.CodeDataManager.codeTablesStoreFreezeFilters();

            Ext.Array.each(Ext.Object.getKeys(CODETABLE_FIELDS_CONFIG), function(fieldName) {
                if (data[fieldName]) {
                    var fc = CODETABLE_FIELDS_CONFIG[fieldName],
                        sourceField = fc.source,
                        ctName;

                    if (sourceField && data[sourceField]) {
                        ctName = criterion.CodeDataManager.getCodeTableNameById(parseInt(data[sourceField], 10));

                        customFields.push({
                            xtype : 'criterion_code_detail_field',
                            fieldLabel : data[fieldName],
                            name : fc.dataIndex,
                            codeDataId : ctName,
                            allowBlank : true
                        });
                    } else {
                        customFields.push({
                            xtype : fc.fieldType,
                            fieldLabel : data[fieldName],
                            name : fc.dataIndex
                        });
                    }
                }
            });

            criterion.CodeDataManager.codeTablesStoreUnfreezeFilters();

            lStore.each(function(lrec) {
                var lRecId = lrec.getId(),
                    isLocaleHiddenBinding = '{!localsVisibility.' + lRecId + '}';

                localFields.push({
                    xtype : 'textfield',
                    flex : 2,
                    allowBlank : true,
                    allowOnlyWhitespace : true,
                    hidden : true,
                    bind : {
                        value : '{locals.' + lRecId + '}',
                        hidden : isLocaleHiddenBinding,
                        allowBlank : isLocaleHiddenBinding,
                        allowOnlyWhitespace : isLocaleHiddenBinding
                    },
                    setAllowBlank : function(value) {
                        this.allowBlank = value;
                        this.validate();
                    },
                    setAllowOnlyWhitespace : function(value) {
                        this.allowOnlyWhitespace = value;
                        this.validate();
                    }
                });

                localsVisibility[lRecId] = lrec.get('code') === criterion.Consts.LOCALIZATION_LANGUAGE_EN;
            });
            localFields.push({
                xtype : 'criterion_code_detail_field',
                codeDataId : criterion.consts.Dict.LOCALIZATION_LANGUAGE,
                editable : false,
                margin : '0 0 0 10',
                bind : '{local}',
                flex : 1
            });
            vm.set('localsVisibility', localsVisibility);

            vm.bind('{local}', function(val) {
                var vis = vm.get('localsVisibility');

                if (val) {
                    Ext.Object.each(vis, function(key) {
                        vis[key] = false;
                    });
                    vis[val] = true;
                }

                vm.set('localsVisibility', vis);
            });

            this.items = [
                {
                    xtype : 'textfield',
                    name : 'code',
                    fieldLabel : i18n.gettext('Code'),
                    allowBlank : false
                },
                {
                    xtype : 'fieldcontainer',
                    fieldLabel : i18n.gettext('Description'),
                    reference : 'descriptionsContainer',
                    layout : 'hbox',

                    items : localFields
                },
                {
                    xtype : 'container',
                    layout : 'anchor',
                    defaults : {
                        anchor : '100%',
                        labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDTH
                    },
                    items : customFields
                },
                {
                    xtype : 'toggleslidefield',
                    name : 'isActive',
                    fieldLabel : i18n.gettext('Active')
                },
                {
                    xtype : 'toggleslidefield',
                    name : 'isDefault',
                    fieldLabel : i18n.gettext('Default')
                }
            ];

            this.callParent(arguments);
        },

        loadRecord : function(record) {
            var localizations = record.get('localizations'),
                locals = {},
                vm = this.getViewModel();

            this.callParent(arguments);

            Ext.each(localizations, function(l) {
                locals[l.localizationLanguageCd] = l.description;
            });
            locals[criterion.CodeDataManager.getCodeDetailRecord('code', criterion.Consts.LOCALIZATION_LANGUAGE_EN, criterion.consts.Dict.LOCALIZATION_LANGUAGE).getId()] = record.get('description');
            vm.set('locals', locals);
        }
    };
});
