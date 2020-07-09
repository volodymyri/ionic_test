Ext.define('criterion.view.scheduling.Population', function() {

    return {

        alias : 'widget.criterion_scheduling_population',

        extend : 'criterion.view.FormView',

        title : i18n.gettext('Population'),

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        controller : {
            type : 'criterion_formview',
            externalUpdate : false
        },

        bodyPadding : 20,

        viewModel : {
            formulas : {

                hideSave : function(data) {
                    return !data('isLocationAreaValid') || !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.SCHEDULING_POPULATION, criterion.SecurityManager.UPDATE, false, true));
                },

                hideDelete : function(data) {
                    return data('hideDeleteInt') || !this.get(criterion.SecurityManager.getSecurityHRFormula(criterion.SecurityManager.HR_KEYS.SCHEDULING_POPULATION, criterion.SecurityManager.DELETE, false, true));
                },

                blockWorkArea : function(data) {
                    return !data('isPhantom') || !data('record.employerWorkLocationId')
                },

                isLocationAreaValid : function(data) {
                    var employerWorkLocationId = data('record.employerWorkLocationId'),
                        areaId = data('record.areaId'),
                        store = data('mainStore'),
                        isPhantom = data('isPhantom'),
                        idnx;

                    if (!isPhantom) {
                        return true;
                    }

                    idnx = store.findBy(function(rec) {
                        return !rec.phantom && rec.get('employerWorkLocationId') === employerWorkLocationId && rec.get('areaId') === areaId;
                    });

                    return idnx === -1;
                }
            }
        },

        items : [
            {
                xtype : 'combobox',
                fieldLabel : i18n.gettext('Work Location'),
                displayField : 'description',
                valueField : 'id',
                queryMode : 'local',
                name : 'employerWorkLocationId',
                reference : 'workLocationCombo',
                allowBlank : false,
                bind : {
                    store : '{employerWorkLocations}',
                    value : '{record.employerWorkLocationId}',
                    disabled : '{!isPhantom}'
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
                    disabled : '{blockWorkArea}',
                    filters : {
                        property : 'workLocationId',
                        value : '{workLocationCombo.selection.workLocationId}',
                        exactMatch : true
                    }
                }
            },
            {
                xtype : 'numberfield',
                fieldLabel : i18n.gettext('Count'),
                name : 'count',
                minValue : 0,
                bind : '{record.count}'
            },
            {
                html : '<span class="criterion-red">Population for this area is already defined. Please select another work area.</span>',
                hidden : true,
                bind : {
                    hidden : '{isLocationAreaValid}'
                }
            }
        ]
    };

});
