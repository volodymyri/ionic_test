Ext.define('criterion.controller.ess.Help', function() {

    const ESS_KEYS = criterion.SecurityManager.ESS_KEYS,
        ESS_HELP_ROUTE_FUNCTIONS = {
            'benefits/plans' : ESS_KEYS.BENEFITS_PLANS,
            'benefits/openEnrollments' : ESS_KEYS.OPEN_ENROLLMENT,
            'time/timeOffDashboard' : ESS_KEYS.MY_TIME_OFFS,
            'time/timesheets' : ESS_KEYS.TIMESHEET,
            'time/availability' : ESS_KEYS.MY_AVAILABILITY,
            'time/availabilityManager' : ESS_KEYS.TEAM_AVAILABILITY,
            'time/myShiftAssignments' : ESS_KEYS.MY_SHIFT_ASSIGNMENTS,
            'time/teamTimeOffs' : ESS_KEYS.TEAM_TIME_OFFS,
            'time/attendanceDashboard' : ESS_KEYS.TEAM_ATTENDANCE,
            'payroll/taxes' : ESS_KEYS.TAXES,
            'payroll/deductions' : ESS_KEYS.DEDUCTION,
            'payroll/incomes' : ESS_KEYS.INCOME,
            'payroll/bankAccounts' : ESS_KEYS.BANK_ACCOUNTS,
            'payroll/payHistory' : ESS_KEYS.PAY_HISTORY,
            'calendar' : ESS_KEYS.CALENDAR_MENU,
            'learning/active' : ESS_KEYS.LEARNING_ACTIVE,
            'learning/completed' : ESS_KEYS.LEARNING_COMPLETE,
            'learning/myTeam' : ESS_KEYS.MY_TEAM,
            'learning/instructorPortal' : ESS_KEYS.INSTRUCTOR_PORTAL,
            'resources/myDocuments' : ESS_KEYS.MY_DOCUMENTS,
            'resources/companyDocuments' : ESS_KEYS.COMPANY_DOCUMENTS,
            'resources/teamDocuments' : ESS_KEYS.TEAM_DOCUMENTS,
            'resources/companyVideos' : ESS_KEYS.COMPANY_VIDEOS,
            'resources/companyDirectory' : ESS_KEYS.COMPANY_DIRECTORY,
            'resources/reports' : ESS_KEYS.REPORTS,
            'resources/forms' : ESS_KEYS.FORM,
            'resources/team' : ESS_KEYS.ORGANIZATION_VIEW,
            'resources/team/current' : ESS_KEYS.ORGANIZATION_VIEW,
            'personalInformation/basicDemographics' : ESS_KEYS.DEMOGRAPHICS,
            'personalInformation/address' : ESS_KEYS.ADDRESS,
            'personalInformation/dependentsAndContacts' : ESS_KEYS.DEPENDENTS_CONTACTS,
            'personalInformation/employment' : ESS_KEYS.EMPLOYMENT_INFORMATION,
            'personalInformation/position' : ESS_KEYS.PRIMARY_POSITION,
            'personalInformation/positions' : ESS_KEYS.ADDITIONAL_POSITIONS,
            'personalInformation/positionHistory' : ESS_KEYS.POSITION_HISTORY,
            'preferences/security' : ESS_KEYS.SECURITY,
            'preferences/lookAndFeel' : ESS_KEYS.LOOK_AND_FEEL,
            'preferences/calendar' : ESS_KEYS.CALENDAR,
            'preferences/delegation' : ESS_KEYS.DELEGATION,
            'preferences/teamDelegation' : ESS_KEYS.TEAM_DELEGATION,
            'recruiting/jobPostings' : ESS_KEYS.JOB_POSTINGS,
            'time/timesheetDashboard' : ESS_KEYS.TEAM_TIMESHEETS,
            'performance/journalEntry' : ESS_KEYS.JOURNAL_ENTRY,
            'performance/teamJournals' : ESS_KEYS.TEAM_JOURNALS,
            'performance/myJournals' : ESS_KEYS.MY_JOURNALS,
            'performance/myGoals' : ESS_KEYS.MY_GOALS,
            'performance/teamGoals' : ESS_KEYS.TEAM_GOALS,
            'performance/teamReviews' : ESS_KEYS.TEAM_REVIEWS,
            'performance/reviews' : ESS_KEYS.REVIEWS,
            'calendar/events' : ESS_KEYS.EVENTS,

            'career/education' : ESS_KEYS.EDUCATION,
            'career/skills' : ESS_KEYS.SKILL,
            'career/certifications' : ESS_KEYS.CERTIFICATION
        };

    return {

        extend : 'criterion.app.ViewController',

        alias : 'controller.criterion_ess_help',

        handleRouteChange : function(isViewJustInitialized) {
            let vm = this.getViewModel(),
                helpArticles = vm.getStore('help_articles');

            if (isViewJustInitialized) {
                vm.set('isViewJustInitialized', false);
            }

            if (helpArticles.isLoaded()) {
                this.updateArticle()
            } else {
                helpArticles.on('load', function() {
                    this.updateArticle();
                }, this, {single : true});
            }
        },

        updateArticle : function() {
            let vm = this.getViewModel(),
                helpArticles = vm.getStore('help_articles'),
                helpButton = vm.get('helpButton'),
                code = ESS_HELP_ROUTE_FUNCTIONS[Ext.History.getToken().replace(/\/\s*$/, "")],
                record = null,
                recId;

            recId = code && helpArticles.findBy(function(item) {
                    return item.get('securityEssFunctionCode') === code
                });

            if (Ext.isNumber(recId) && recId >= 0) {
                record = helpArticles.getAt(recId);
            }

            vm.set('record', record);
            helpButton.getViewModel().set('available', !!record);
        },

        onChangeVisibility : function() {
            let helpButton = this.getViewModel().get('helpButton');

            if (this.getView().isVisible()) {
                helpButton.addCls('support-active');
            } else {
                helpButton.removeCls('support-active');
            }
        },

        onAfterRender : function() {
            this.getView().updateSize();
        },

        onToolbarHide : function() {
            let view = this.getView();

            !view.inAnimation && view.hide();
        },

        onTabToggle : function(cmp, btn) {
            this.getView().setActiveItem(btn.cardIdx)
        }

    }
});
