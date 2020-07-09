Ext.define('ess.view.dashboard.PositionSkills', function() {

    var DICT = criterion.consts.Dict;

    return {

        alias : 'widget.ess_modern_dashboard_position_skills',

        extend : 'criterion.view.Grid',

        requires : [
            'criterion.store.employer.position.Skills',
            'criterion.store.Skills'
        ],

        viewModel : {
            stores : {
                skills : {
                    type : 'employer_position_skills',
                    proxy : 'memory'
                },
                allSkills : {
                    type : 'criterion_skills'
                }
            }
        },

        bind : {
            store : '{skills}'
        },
        height : 125,
        columns : [
            {
                xtype : 'criterion_codedatacolumn',
                dataIndex : 'skillCategoryCd',
                codeDataId : DICT.SKILL_CATEGORY,
                text : i18n.gettext('Category'),
                flex : 1
            },
            {
                text : i18n.gettext('Skill'),
                dataIndex : 'skillId',
                flex : 1,
                sortable : false,
                cell : {
                    xtype : 'storevalue',
                    fieldName : 'name',
                    bind : {
                        store : '{allSkills}'
                    }
                }
            },
            {
                xtype : 'criterion_codedatacolumn',
                dataIndex : 'skillLevelCd',
                codeDataId : DICT.SKILL_LEVEL,
                text : i18n.gettext('Level'),
                flex : 1
            }
        ],

        setSkills : function(aSkillsValues) {
            var vm = this.getViewModel(),
                skills = vm.get('skills'),
                allSkills = vm.get('allSkills'),
                fillSkills = function() {
                    skills.removeAll(true);
                    skills.loadData(aSkillsValues, false);
                },
                delegatedByEmployeeId = vm.get('workflowLog.delegatedByEmployeeId');

            if (!Ext.isArray(aSkillsValues) || !aSkillsValues.length) {
                skills.removeAll(true);
                return;
            }

            if (!allSkills.isLoaded()) {
                allSkills.loadWithPromise({
                    params : (delegatedByEmployeeId ? {delegatedByEmployeeId : delegatedByEmployeeId} : {})
                }).then(function() {
                    fillSkills();
                });
            } else {
                fillSkills();
            }
        }
    }
});
