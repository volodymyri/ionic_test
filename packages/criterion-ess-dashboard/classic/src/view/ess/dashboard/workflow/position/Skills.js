Ext.define('criterion.view.ess.dashboard.workflow.position.Skills', function() {

    var DICT = criterion.consts.Dict;

    return {

        alias : 'widget.criterion_selfservice_workflow_position_skills',

        extend : 'criterion.ux.Panel',

        referenceHolder : true,

        requires : [
            'criterion.store.employer.position.Skills',
            'criterion.store.Skills'
        ],

        layout : {
            type : 'vbox',
            align : 'stretch'
        },

        padding : 15,

        header : {
            title : i18n.gettext('Skills'),
            hidden : true,
            bind : {
                hidden : '{!showHeader}'
            }
        },

        viewModel : {
            data : {
                showHeader : false
            },
            stores : {
                allSkills : {
                    type : 'criterion_skills',
                    proxy : 'memory'
                }
            }
        },

        items : [
            {
                xtype : 'criterion_gridpanel',
                reference : 'skillsGrid',
                width : '100%',
                store : {
                    type : 'employer_position_skills',
                    proxy : 'memory'
                },
                viewModel : true,
                columns : [
                    {
                        xtype : 'codedatacolumn',
                        dataIndex : 'skillCategoryCd',
                        codeDataId : DICT.SKILL_CATEGORY,
                        reference : 'skillCategory',
                        text : i18n.gettext('Category'),
                        flex : 1,
                        menuDisabled : true,
                        sortable : false
                    },
                    {
                        xtype : 'gridcolumn',
                        text : i18n.gettext('Skill'),
                        flex : 1,
                        dataIndex : 'skillId',
                        renderer : function(value, metaData, record) {
                            var vm = this.getViewModel();

                            return (value) ? vm.get('allSkills').getById(record.get('skillId')).get('name') : '';
                        },
                        menuDisabled : true,
                        sortable : false
                    },
                    {
                        xtype : 'codedatacolumn',
                        dataIndex : 'skillLevelCd',
                        codeDataId : DICT.SKILL_LEVEL,
                        text : i18n.gettext('Level'),
                        flex : 1,
                        menuDisabled : true,
                        sortable : false
                    }
                ]
            }
        ],

        setSkillsData : function(skills) {
            var vm = this.getViewModel(),
                aSkillsValues = skills || [],
                skillsGrid = this.lookup('skillsGrid'),
                positionSkillsStore = skillsGrid && skillsGrid.getStore();

            vm.set('showHeader', !!aSkillsValues.length);

            positionSkillsStore.removeAll(true);
            positionSkillsStore.loadData(aSkillsValues, false);
        },

        setSkills : function(skills) {
            skills.cloneToStore(this.getViewModel().getStore('allSkills'));
        }
    }
});
