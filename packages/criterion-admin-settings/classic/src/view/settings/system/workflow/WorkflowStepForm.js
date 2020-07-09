Ext.define('criterion.view.settings.system.workflow.WorkflowStepForm', function() {

    var WORKFLOW_ACTOR = criterion.Consts.WORKFLOW_ACTOR;

    function getWfStructure(code, description) {
        var wfStructure;

        switch (code) {
            case WORKFLOW_ACTOR.POS_STRUCT1:
                wfStructure = criterion.CodeDataManager.getStore(criterion.consts.Dict.WF_STRUCTURE).findRecord('code', criterion.Consts.WF_STRUCTURE.WF1);
                break;
            case WORKFLOW_ACTOR.POS_STRUCT2:
                wfStructure = criterion.CodeDataManager.getStore(criterion.consts.Dict.WF_STRUCTURE).findRecord('code', criterion.Consts.WF_STRUCTURE.WF2);
                break;
        }

        return wfStructure ? Ext.util.Format.format('{0} ({1})', description, wfStructure.get('description')) : description;
    }

    return {
        alias : 'widget.criterion_settings_workflow_step_form',

        extend : 'criterion.view.FormView',

        requires : [
            'criterion.controller.settings.system.workflow.WorkflowStepForm'
        ],

        plugins : [
            {
                ptype : 'criterion_sidebar',
                width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH,
                height : 'auto',
                modal : true
            }
        ],

        modal : true,

        viewModel : {
            formulas : {
                disableEdit : function(get) {
                    var record = get('record');

                    return record && record.get('sequence') == 1;
                },
                hideDelete : function(get) {
                    var record = get('record');

                    return record && record.get('sequence') == 1;
                }
            }
        },

        controller : {
            type : 'criterion_settings_workflow_step_form'
        },

        title : i18n.gettext('Step'),

        allowDelete : true,

        modelValidation : true,

        items : [
            {
                xtype : 'criterion_code_detail_field',
                fieldLabel : i18n.gettext('Action'),
                codeDataId : criterion.consts.Dict.WORKFLOW_STATE,
                name : 'stateCd',
                bind : {
                    value : '{record.stateCd}',
                    disabled : '{disableEdit}'
                },
                editable : false,
                displayField : 'description',
                listConfig : {
                    listeners : {
                        show : function(boundlist) {
                            var vm = this.lookupViewModel(),
                                parentCombo = boundlist.ownerCmp,
                                record = parentCombo.up().getRecord(),
                                store = record.store,
                                wfStateStore = criterion.CodeDataManager.getStore(criterion.consts.Dict.WORKFLOW_STATE),
                                pendingApproval = wfStateStore.findRecord('code', criterion.Consts.WORKFLOW_STATUSES.PENDING_APPROVAL).getId(),
                                approvedRecord = store.findRecord('stateCd', wfStateStore.findRecord('code', criterion.Consts.WORKFLOW_STATUSES.APPROVED).getId(), 0, false, false, true),
                                hasApproved = approvedRecord && approvedRecord != record,
                                filterValues;

                            boundlist.store.clearFilter();
                            parentCombo.suspendEvents(false);
                            if (store.find('stateCd', pendingApproval) > -1) {
                                filterValues = [
                                    criterion.Consts.WORKFLOW_STATUSES.SAVED,
                                    criterion.Consts.WORKFLOW_STATUSES.PENDING_APPROVAL,
                                    criterion.Consts.WORKFLOW_STATUSES.NOT_SUBMITTED,
                                    criterion.Consts.WORKFLOW_STATUSES.REJECTED,
                                ];

                                hasApproved && filterValues.push(criterion.Consts.WORKFLOW_STATUSES.APPROVED);

                                boundlist.store.setFilters([
                                    {
                                        property : 'code',
                                        value : filterValues,
                                        operator : 'notin'
                                    }
                                ]);
                            }
                            parentCombo.resumeEvents();
                        }
                    }
                }
            },
            {
                xtype : 'criterion_code_detail_field',
                fieldLabel : i18n.gettext('Performer'),
                reference : 'performerField',
                codeDataId : criterion.consts.Dict.WORKFLOW_ACTOR,
                listeners : {
                    change : 'onPerformerTypeChange'
                },
                name : 'actorCd',
                bind : {
                    value : '{record.actorCd}',
                    disabled : '{disableEdit}'
                },
                editable : false,
                tpl : Ext.create('Ext.XTemplate',
                    '<ul class="x-list-plain">',
                        '<tpl for=".">',
                            '<li role="option" class="x-boundlist-item item-enab-{isActive}">{[this.getWfStructure(values.code, values.description)]}</li>',
                        '</tpl>',
                    '</ul>',
                    {
                        getWfStructure : getWfStructure
                    }),
                displayTpl : Ext.create('Ext.XTemplate',
                    '<tpl for=".">',
                        '{[this.getWfStructure(values.code, values.description)]}',
                    '</tpl>',
                    {
                        getWfStructure : getWfStructure
                    }
                ),
                listConfig : {
                    listeners : {
                        show : function(boundlist) {
                            var parentCombo = boundlist.ownerCmp,
                                record = parentCombo.up().getRecord(),
                                store = record.store,
                                pendingApproval = criterion.CodeDataManager.getStore(criterion.consts.Dict.WORKFLOW_STATE).findRecord('code', criterion.Consts.WORKFLOW_STATUSES.PENDING_APPROVAL).getId();

                            boundlist.store.clearFilter();
                            parentCombo.suspendEvents(false);
                            if (store.find('stateCd', pendingApproval) > -1) {
                                boundlist.store.setFilters(
                                    {
                                        property : 'code',
                                        value : [
                                            WORKFLOW_ACTOR.INITIATOR
                                        ],
                                        operator : '!='
                                    }
                                );
                            }
                            parentCombo.resumeEvents();
                        }
                    }
                }
            },
            {
                xtype : 'criterion_code_detail_field',
                reference : 'orgStructureCombo',
                codeDataId : criterion.consts.Dict.ORG_STRUCTURE,

                fieldLabel : i18n.gettext('Organization Structure'),
                hidden : true,
                allowBlank : false,
                editable : false,

                store : {
                    sorters : [{
                        property : 'attribute1',
                        direction : 'ASC'
                    }]
                },

                bind : {
                    value : '{record.orgType}'
                },

                valueField : 'attribute1'
            },
            {
                xtype : 'numberfield',
                reference : 'orgLevelField',
                fieldLabel : i18n.gettext('Level'),
                hidden : true,
                name : 'orgLevel',
                minValue : 0,
                bind : '{record.orgLevel}',
                allowBlank : false
            },
            {
                xtype : 'container',
                reference : 'positionContainer',
                layout : 'hbox',
                margin : '0 0 10 0',
                items : [
                    {
                        xtype : 'textfield',
                        flex : 1,
                        fieldLabel : i18n.gettext('Position'),
                        name : 'performer',
                        bind : {
                            value : '{record.performer}'
                        },
                        readOnly : true,
                        allowBlank : false
                    },
                    {
                        xtype : 'button',
                        scale : 'small',
                        margin : '0 0 0 3',
                        cls : 'criterion-btn-light',
                        glyph : criterion.consts.Glyph['ios7-search'],
                        listeners : {
                            click : 'onPositionSearch'
                        }
                    }
                ],
                hidden : true
            },
            {
                xtype : 'container',
                reference : 'employeeContainer',
                layout : 'hbox',
                margin : '0 0 10 0',
                items : [
                    {
                        xtype : 'textfield',
                        flex : 1,
                        fieldLabel : i18n.gettext('Employee'),
                        name : 'performer',
                        bind : {
                            value : '{record.performer}'
                        },
                        readOnly : true,
                        allowBlank : false
                    },
                    {
                        xtype : 'button',
                        scale : 'small',
                        margin : '0 0 0 3',
                        cls : 'criterion-btn-light',
                        glyph : criterion.consts.Glyph['ios7-search'],
                        listeners : {
                            click : 'onEmployeeSearch'
                        }
                    }
                ],
                hidden : true
            }
        ]
    };

});
