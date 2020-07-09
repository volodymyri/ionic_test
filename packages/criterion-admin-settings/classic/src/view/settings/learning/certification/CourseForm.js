Ext.define('criterion.view.settings.learning.certification.CourseForm', function() {

    return {
        alias : 'widget.learning_certification_course_form',

        extend : 'criterion.view.FormView',

        modal : true,

        cls : 'criterion-modal',

        plugins : [
            {
                ptype : 'criterion_sidebar',
                width : criterion.Consts.UI_DEFAULTS.MODAL_NARROW_WIDTH,
                height : 'auto',
                modal : true
            }
        ],

        title : i18n.gettext('Course'),

        items : [
            {
                xtype : 'combo',
                fieldLabel : i18n.gettext('Course Name'),
                name : 'courseId',
                displayField : 'name',
                valueField : 'id',

                labelWidth : criterion.Consts.UI_DEFAULTS.LABEL_WIDER_WIDTH,
                width : '100%',

                queryMode : 'local',

                bind : {
                    store : '{allCourses}'
                },

                editable : false,
                allowBlank : false
            }
        ]
    };
});