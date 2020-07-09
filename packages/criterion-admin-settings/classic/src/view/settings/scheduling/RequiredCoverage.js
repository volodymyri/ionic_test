Ext.define('criterion.view.settings.scheduling.RequiredCoverage', function() {

    return {

        alias : 'widget.criterion_settings_scheduling_required_coverage',

        extend : 'criterion.view.FormView',

        title : i18n.gettext('Required Coverage'),

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        bodyPadding : 20,

        controller : {
            type : 'criterion_formview',
            externalUpdate : false
        },

        items : [
            {
                xtype : 'criterion_employer_combo',
                fieldLabel : i18n.gettext('Employer'),
                name : 'employerId',
                disabled : true,
                hideTrigger : true
            },
            {
                xtype : 'combobox',
                fieldLabel : i18n.gettext('Work Location'),
                reference : 'workLocation',
                displayField : 'description',
                valueField : 'id',
                queryMode : 'local',
                name : 'employerWorkLocationId',
                allowBlank : false,
                bind : {
                    store : '{employerWorkLocations}',
                    value : '{record.employerWorkLocationId}'
                }
            },
            {
                xtype : 'combobox',
                fieldLabel : i18n.gettext('Work Area'),
                displayField : 'name',
                valueField : 'id',
                queryMode : 'local',
                name : 'areaId',
                allowBlank : false,
                forceSelection : true,
                bind : {
                    store : '{workLocationAreas}',
                    value : '{record.areaId}',
                    disabled : '{!workLocation.selection}',
                    filters : {
                        property : 'workLocationId',
                        value : '{workLocation.selection.workLocationId}',
                        exactMatch : true
                    }
                }
            },
            {
                xtype : 'combobox',
                fieldLabel : i18n.gettext('Position'),
                bind : {
                    store : '{employerPositions}',
                    value : '{record.positionId}'
                },
                allowBlank : false,
                displayField : 'title',
                valueField : 'id',
                queryMode : 'local',
                name : 'positionId'
            },
            {
                xtype : 'fieldcontainer',
                layout : 'hbox',
                fieldLabel : i18n.gettext('Time Range'),
                requiredMark : true,
                items : [
                    {
                        xtype : 'timefield',
                        name : 'startTime',
                        fieldLabel : '',
                        hideLabel : true,
                        bind : {
                            value : '{record.startTime}'
                        },
                        allowBlank : false,
                        increment : 30,
                        margin : '0 10 0 0',
                        flex : 1
                    },
                    {
                        xtype : 'displayfield',
                        hideLabel : true,
                        value : '-'
                    },
                    {
                        xtype : 'timefield',
                        name : 'endTime',
                        fieldLabel : '',
                        hideLabel : true,
                        bind : {
                            value : '{record.endTime}'
                        },
                        allowBlank : false,
                        increment : 30,
                        margin : '0 0 0 10',
                        flex : 1
                    }
                ]
            },
            {
                xtype : 'numberfield',
                fieldLabel : i18n.gettext('Required Coverage per Unit'),
                name : 'requiredNum',
                minValue : 0,
                bind : '{record.requiredNum}'
            }
        ]
    };

});

