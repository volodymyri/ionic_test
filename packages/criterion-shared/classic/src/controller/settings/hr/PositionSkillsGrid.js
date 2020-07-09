Ext.define('criterion.controller.settings.hr.PositionSkillsGrid', function() {

    return {
        alias : 'controller.criterion_settings_hr_position_skills_grid',

        extend : 'criterion.controller.GridView',

        getEmptyRecord : function() {
            return {
                positionId : this.getViewModel().get('positionRecord').getId()
            };
        }

    }
});
