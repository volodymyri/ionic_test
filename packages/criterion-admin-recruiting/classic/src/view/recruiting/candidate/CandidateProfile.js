Ext.define('criterion.view.recruiting.candidate.CandidateProfile', function() {

    let tplIfNull = (value, format = '', ifNull = '', separator = '') => ('<tpl if="' + value + ' != null">' + separator + '{' + value + format + '}'
        + '<tpl else>'
        + (ifNull ? separator + ifNull : '')
        + '</tpl>');

    let itemBtns = (
            criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.RECRUITING_JOB_CANDIDATES, criterion.SecurityManager.UPDATE)() &&
            criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.RECRUITING_CANDIDATE_PROFILE, criterion.SecurityManager.UPDATE)() ?
                '  <div class="icon edit ion-edit"></div>' : ''
        ) + (
            criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.RECRUITING_JOB_CANDIDATES, criterion.SecurityManager.UPDATE)() &&
            criterion.SecurityManager.getSecurityHRAccessFn(criterion.SecurityManager.HR_KEYS.RECRUITING_CANDIDATE_PROFILE, criterion.SecurityManager.DELETE)() ?
                '  <div class="icon delete ion-android-delete"></div>' : ''
        );

    return {
        alias : 'widget.criterion_recruiting_candidate_profile',

        extend : 'criterion.ux.Panel',

        requires : [
            'criterion.controller.recruiting.candidate.CandidateProfile',
            'criterion.model.Candidate',
            'criterion.view.recruiting.candidate.ProfileItem',
            'criterion.view.recruiting.candidate.EducationForm',
            'criterion.view.recruiting.candidate.ExperienceForm',
            'criterion.view.recruiting.candidate.AwardForm',
            'criterion.view.recruiting.candidate.CertificationForm',
            'criterion.view.recruiting.candidate.SkillForm'
        ],

        controller : {
            type : 'criterion_recruiting_candidate_profile'
        },

        listeners : {
            scope : 'controller'
        },

        bodyPadding : 0,

        scrollable : 'vertical',

        defaults : {
            xtype : 'panel',

            cls : 'transparent-bg-header minimized-header',

            bodyPadding : '15 20 0 20',

            header : {
                margin : '0 0 0 20',
                items : [
                    {
                        xtype : 'button',
                        glyph : criterion.consts.Glyph['plus'],
                        text : i18n.gettext('Add'),
                        cls : 'criterion-btn-new-primary criterion-btn-sm-glyph',
                        margin : '0 25 5 0',
                        scale : 'small',
                        handler : 'handleAddCandidateData',
                        hidden : true,
                        bind : {
                            hidden : criterion.SecurityManager.getComplexSecurityFormula({
                                rules : {
                                    OR : [
                                        {
                                            key : criterion.SecurityManager.HR_KEYS.RECRUITING_JOB_CANDIDATES,
                                            actName : criterion.SecurityManager.UPDATE,
                                            reverse : true
                                        },
                                        {
                                            key : criterion.SecurityManager.HR_KEYS.RECRUITING_CANDIDATE,
                                            actName : criterion.SecurityManager.UPDATE,
                                            reverse : true
                                        },
                                        {
                                            key : criterion.SecurityManager.HR_KEYS.RECRUITING_CANDIDATE_PROFILE,
                                            actName : criterion.SecurityManager.CREATE,
                                            reverse : true
                                        }
                                    ]
                                }
                            })
                        }
                    }
                ]
            },

            listeners : {
                editCandidate : 'handleEditCandidateData',
                deleteCandidate : 'handleDeleteCandidateData'
            }
        },

        items : [
            {
                title : i18n.gettext('Employment History'),

                editor : 'criterion.view.recruiting.candidate.ExperienceForm',

                items : [
                    {
                        xtype : 'criterion_recruiting_candidate_profile_item',

                        bind : {
                            store : '{candidate.experiences}'
                        },

                        tpl : Ext.create('Ext.XTemplate',
                            '<tpl for=".">',
                            '  <div class="criterion-candidate-data item">',
                            itemBtns,
                            '    <div class="title">{title}</div>',
                            '    <div class="subtitle mb04em">{company}</div>',
                            '    <div class="worktime mb04em criterion-text-gray">',
                                    tplIfNull('startDate', ':date(criterion.consts.Api.DATE_MONTH_YEAR_SHORT)', '', ''),
                                    tplIfNull('endDate', ':date(criterion.consts.Api.DATE_MONTH_YEAR_SHORT)', '<span class="current-workplace">' + i18n.gettext('Current') + '</span>', ' - '),
                            '        <span class="duration criterion-text-gray d-inline-block"> | ',
                                        '{[this.getPeriodBetweenDates(values.startDate, values.endDate)]}',
                            '        </span>',
                            '    </div>',
                            '    <div class="location mb04em criterion-text-gray">{location}</div>',
                            '   <tpl if="description">',
                            '       <div class="description">{description}</div>',
                            '   </tpl>',
                            '  </div>',
                            '</tpl>',
                            {
                                getPeriodBetweenDates : (dateFrom, dateTo) => criterion.Utils.periodToLongString(criterion.Utils.getPeriodBetweenDates(dateFrom, dateTo))
                            })
                    }
                ]
            },

            {
                title : i18n.gettext('Education'),

                editor : 'criterion.view.recruiting.candidate.EducationForm',

                items : [
                    {
                        xtype : 'criterion_recruiting_candidate_profile_item',

                        bind : {
                            store : '{candidate.educations}'
                        },

                        tpl : Ext.create('Ext.XTemplate',
                            '<tpl for=".">',
                            '<div class="criterion-candidate-data item">',
                            itemBtns,
                            '  <div class="title">{school}</div>',
                            '    <div class="degree mb04em">{degreeDescription}</div>',
                            '    <div class="studytime mb04em criterion-text-gray">',
                                    tplIfNull('startDate', ':date(criterion.consts.Api.DATE_MONTH_YEAR_SHORT)', '', ''),
                                    tplIfNull('endDate', ':date(criterion.consts.Api.DATE_MONTH_YEAR_SHORT)', i18n.gettext('Present'), ' - '),
                            '      <span class="duration criterion-text-gray"> | ',
                                    '{[this.getPeriodBetweenDates(values.startDate, values.endDate)]}',
                            '      </span>',
                            '    </div>',
                            '<tpl if="fieldOfStudy">',
                            '    <div class="fieldOfStudy mb04em">{fieldOfStudy}</div>',
                            '</tpl>',
                            '<tpl if="gpa">',
                            '    <div class="mb04em">{gpa}</div>',
                            '</tpl>',
                            '  <div class="location mb04em criterion-text-gray">{location}</div>',
                            '   <tpl if="activities">',
                            '       <div class="description">{activities}</div>',
                            '   </tpl>',
                            '</div>',
                            '</tpl>',
                            {
                                getPeriodBetweenDates : (dateFrom, dateTo) => criterion.Utils.periodToLongString(criterion.Utils.getPeriodBetweenDates(dateFrom, dateTo))
                            })
                    }
                ]
            },

            {
                title : i18n.gettext('Skills'),

                editor : 'criterion.view.recruiting.candidate.SkillForm',

                userCls : 'skills',

                items : [
                    {
                        xtype : 'textfield',
                        emptyText : i18n.gettext('Add a new skill and Enter'),
                        enableKeyEvents : true,
                        listeners : {
                            keypress : 'onSkillKeyPress'
                        }
                    },
                    {
                        xtype : 'criterion_recruiting_candidate_profile_item',

                        bind : {
                            store : '{candidate.skills}'
                        },

                        componentCls : 'criterion-skills-container',
                        itemSelector : 'span.item',

                        tpl : Ext.create('Ext.XTemplate',
                            '<tpl for=".">',
                            '  <span class="criterion-skill-data d-inline-block item">',
                            '    <span class="skill">{skill}</span>',
                            itemBtns,
                            '  </span>',
                            ' ', // This space is required!
                            '</tpl>')
                    }
                ]
            },

            {
                title : i18n.gettext('Awards'),

                editor : 'criterion.view.recruiting.candidate.AwardForm',

                items : [
                    {
                        xtype : 'criterion_recruiting_candidate_profile_item',

                        bind : {
                            store : '{candidate.awards}'
                        },

                        tpl : Ext.create('Ext.XTemplate',
                            '<tpl for=".">',
                            '  <div class="criterion-candidate-data item">',
                            itemBtns,
                            '    <div class="title">{title}</div>',
                            '    <div class="award-date criterion-text-gray">{awardDate:date(criterion.consts.Api.SHOW_DATE_FORMAT)}</div>',
                            '   <tpl if="description">',
                            '       <div class="description">{description}</div>',
                            '   </tpl>',
                            '  </div>',
                            '</tpl>')
                    }
                ]
            },

            {
                title : i18n.gettext('Certifications'),

                editor : 'criterion.view.recruiting.candidate.CertificationForm',

                items : [
                    {
                        xtype : 'criterion_recruiting_candidate_profile_item',

                        bind : {
                            store : '{candidate.certifications}'
                        },

                        tpl : Ext.create('Ext.XTemplate',
                            '<tpl for=".">',
                            '  <div class="criterion-candidate-data item">',
                            itemBtns,
                            '    <div class="title">{name}</div>',
                            '   <tpl if="issuedBy">',
                            '       <div class="mb04em issuedBy">{issuedBy}</div>',
                            '   </tpl>',
                            '    <div class="mb04em criterion-text-gray">',
                                tplIfNull('issueDate', ':date(criterion.consts.Api.DATE_MONTH_YEAR_SHORT)', '', ''),
                                tplIfNull('expiryDate', ':date(criterion.consts.Api.DATE_MONTH_YEAR_SHORT)', i18n.gettext('Present'), ' - '),
                            '  </div>',
                            '   <tpl if="description">',
                            '       <div class="description">{description}</div>',
                            '   </tpl>',
                            '  </div>',
                            '</tpl>')
                    }
                ]
            }
        ]
    };

});
