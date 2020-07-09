Ext.define('criterion.view.person.SkillsAndEducation', function () {

    return {
        alias : 'widget.criterion_person_skillsandeducation',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.view.person.Educations',
            'criterion.view.person.Certifications',
            'criterion.view.person.Skills',
            'criterion.view.person.Courses'
        ],

        title : i18n.gettext('Skills and Education'),

        layout : {
            type : 'card'
        },

        defaults: {
            header: false,
            autoScroll: true
        },

        plugins : [
            {
                ptype : 'criterion_security_items'
            }
        ],

        items : [
            {
                xtype : 'criterion_person_educations',
                reference : 'educations',
                itemId : 'education',
                securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.EMPLOYEE_EDUCATION, criterion.SecurityManager.READ)
            },
            {
                xtype : 'criterion_person_skills',
                reference : 'skills',
                itemId : 'skills',
                securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.EMPLOYEE_SKILLS, criterion.SecurityManager.READ)
            },
            {
                xtype : 'criterion_person_certifications',
                reference : 'certifications',
                itemId : 'certification',
                securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.EMPLOYEE_CERTIFICATIONS, criterion.SecurityManager.READ)
            },
            {
                xtype : 'criterion_person_courses',
                reference : 'courses',
                itemId : 'courses',
                securityAccess : criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.EMPLOYEE_COURSES, criterion.SecurityManager.READ)
            }
        ]
    };

});
