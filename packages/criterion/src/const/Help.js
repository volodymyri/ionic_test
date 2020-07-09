Ext.define('criterion.consts.Help', function() {

    return {

        singleton : true,

        HELP_CENTER_SUGGESTION_TOPIC_ID : 200232460,
        HELP_CENTER_URL : 'https://help.criterionhcm.com',
        HELP_CENTER_EMAIL : 'help@criterionhcm.com',
        HELP_CENTER_PHONE : criterion.support && criterion.support.phone || '+1 203 703 9000',
        HELP_CENTER_SUGGESTION_TOPIC : '/hc/en-us/community/topics/200232460-Feature-Requests',
        HELP_CENTER_DEFAULT_LABEL : 'introduction',

        /**
         * Match url to zendesk labels, entry format :
         * [ regex, label, isPrimary ]
         */
        HELP_CENTER_ROUTE_LABELS : [
            // =HR=

            [/.*dashboard$/, 'dashboard', true],
            [/.*HR\/reports(\/\d+)?$/, 'hr_reports', true],
            [/.*HR\/reports\/dataGrid$/, 'data_grid', true],

            // =Recruiting=

            [/.*Recruiting\/reports(\/\d+)?$/, 'recruiting_reports', true],
            [/.*Recruiting\/reports\/dataGrid$/, 'data_grid', true],
            [/.*Recruiting\/jobs$/, 'recruiting_jobs', true],
            [/.*Recruiting\/jobs\/new$/, 'jobs_add', true],
            [/.*Recruiting\/jobs\/\d+(\/details$|$)/, 'jobs_edit', true],
            [/.*Recruiting\/jobs\/\d+\/positionInformation$/, 'jobs_position', true],
            [/.*Recruiting\/jobs\/\d+\/publish$/, 'job_publishing', true],
            [/.*Recruiting\/jobs\/\d+\/candidates$/, 'candidates', true],
            [/.*Recruiting\/jobs\/\d+\/activity$/, 'activity', true],

            [/.*Recruiting\/candidates$/, 'candidates_list', true],
            [/.*Recruiting\/candidates\/new$/, 'candidate_add', true],
            [/.*Recruiting\/candidates\/\d+(\/profile$|$)/, 'candidate_profile', true],
            [/.*Recruiting\/candidates\/\d+\/jobs$/, 'candidate_jobs', true],
            [/.*Recruiting\/candidates\/\d+\/activity$/, 'activity', true],
            [/.*Recruiting\/candidates\/\d+\/forms$/, 'candidate_documents', true],
            [/.*Recruiting\/candidates\/\d+\/attachments$/, 'candidate_attachments', true],

            [/.*Recruiting\/questions$/, 'questions', true],
            [/.*Recruiting\/questions\/\d+(\/set$|$)/, 'question_set', true],
            [/.*Recruiting\/questions\/\d+\/postings$/, 'questions_job_postings', true],
            [/.*Recruiting\/questions\/\d+\/questions$/, 'questions_details', true],

            // =Scheduling=

            [/.*Scheduling\/reports(\/\d+)?$/, 'scheduling_reports', true],
            [/.*Scheduling\/reports\/dataGrid$/, 'data_grid', true],
            [/.*Scheduling\/shift$/, 'shifts', true],
            [/.*Scheduling\/shift\/(\d+|new)$/, 'shift_management', true],
            [/.*Scheduling\/population$/, 'population', true],

            // =Payroll=

            [/.*Payroll\/payroll$/, 'payroll', true],
            [/.*Payroll\/reports(\/\d+)?$/, 'payroll_reports', true],
            [/.*Payroll\/reports\/dataGrid$/, 'data_grid', true],

            [/.*Payroll\/batch(\/\d+$|$)/, 'payroll_batch', true],
            [/.*Payroll\/batch\/\d+\/entry$/, 'payroll_entry', true],
            [/.*Payroll\/batch\/\d+\/approval$/, 'payroll_approval', true],

            [/.*Payroll\/payProcessing\/payBatch$/, 'pay_batch', true],
            [/.*Payroll\/payProcessing\/payBatch\/\d+$/, 'pay_batch_details', true],

            [/.*Payroll\/payProcessing\/taxFiling$/, 'tax_filing', true],
            [/.*Payroll\/payProcessing\/generalLedger$/, 'general_ledger', true],
            [/.*Payroll\/payProcessing\/export$/, 'twn_export', true],

            // =Common=

            [/.*\/organization(\/\d+)?$/, 'organization_chart', true],

            // Employees

            [/.*\/employees$/, 'employees', true],
            [/.*\/addEmployee$/, 'new_employee', true],
            [/.*\/addEmployee\/rehire\/person\/\d+\/\d+$/, 'rehire_employee', true],
            [/.*\/addEmployee\/person\/\d+$/, 'add_another_employer', true],
            [/.*\/addEmployee\/transfer\/person\/\d+\/\d+$/, 'transfer_employee', true],

            [/.*\/employee\/\d+\/profile$/, 'demographics', true],
            [/.*\/employee\/\d+\/profile\/basicDemographics$/, 'demographics', true],
            [/.*\/employee\/\d+\/profile\/address$/, 'address', true],

            [/.*\/employee\/\d+\/employment$/, 'employment', true],
            [/.*\/employee\/\d+\/employment\/info$/, 'employment', true],
            [/.*\/employee\/\d+\/employment\/position$/, 'primary_position', true],
            [/.*\/employee\/\d+\/employment\/positions$/, 'additional_positions', true],
            [/.*\/employee\/\d+\/employment\/positions\/(\d+|new)$/, 'additional_position_details', true],
            [/.*\/employee\/\d+\/employment\/positionHistory$/, 'position_history', true],
            [/.*\/employee\/\d+\/employment\/positionHistory\/(\d+|new)$/, 'position_history_details', true],
            [/.*\/employee\/\d+\/employment\/tasks$/, 'tasks', true],
            [/.*\/employee\/\d+\/employment\/tasks\/(\d+|new)$/, 'task_details', true],

            [/.*\/employee\/\d+\/benefits\/benefitPlans$/, 'benefit_plans', true],
            [/.*\/employee\/\d+\/benefits\/benefitPlans\/\d+$/, 'benefit_plan_details', true],
            [/.*\/employee\/\d+\/benefits\/benefitPlans\/new$/, 'benefit_plan_add_employee', true],
            [/.*\/employee\/\d+\/benefits\/timeOffPlans\b/, 'time_off_plans', true],
            [/.*\/employee\/\d+\/benefits\/timeOffPlans\/\d+$/, 'timeoff_plan_details_employee', true],
            [/.*\/employee\/\d+\/benefits\/timeOff\b/, 'time_off', true],

            [/.*\/employee\/\d+\/documents\b/, 'ee_documents', true],

            [/.*\/employee\/\d+\/miscellaneous\/security$/, 'employee_security', true],
            [/.*\/employee\/\d+\/miscellaneous\/customForms$/, 'ee_custom_forms', true],
            [/.*\/employee\/\d+\/miscellaneous\/customForms\/(\d+|new)$/, 'сustom_form_details', true],
            [/.*\/employee\/\d+\/miscellaneous\/compensations$/, 'workers_compensation', true],
            [/.*\/employee\/\d+\/miscellaneous\/compensations\/(\d+|new)$/, 'workers_comp_details', true],
            [/.*\/employee\/\d+\/miscellaneous\/groups$/, 'ee_groups', true],
            [/.*\/employee\/\d+\/skills\/education$/, 'ee_education', true],
            [/.*\/employee\/\d+\/skills\/education\/(\d+|new)$/, 'ee_education_details', true],
            [/.*\/employee\/\d+\/skills\/skills\b/, 'skills', true],
            [/.*\/employee\/\d+\/skills\/certification$/, 'certifications', true],
            [/.*\/employee\/\d+\/skills\/certification\/(\d+|new)$/, 'certification_details', true],
            [/.*\/employee\/\d+\/skills\/courses$/, 'courses', true],
            [/.*\/employee\/\d+\/skills\/courses\/(\d+|new)$/, 'employee_courses_details', true],

            [/.*\/employee\/\d+\/performance\/goals$/, 'goals', true],
            [/.*\/employee\/\d+\/performance\/goals\/(\d+|new)$/, 'goal_details', true],
            [/.*\/employee\/\d+\/performance\/reviews$/, 'ee_reviews', true],
            [/.*\/employee\/\d+\/performance\/reviews\/(\d+|new)$/, 'ee_review_details', true],
            [/.*\/employee\/\d+\/performance\/journalEntries$/, 'journal_entries', true],
            [/.*\/employee\/\d+\/performance\/journalEntries\/(\d+|new)$/, 'journal_entry_details', true],

            [/.*\/employee\/\d+\/payroll\/filingStatus$/, 'filling_status', true],
            [/.*\/employee\/\d+\/payroll\/filingStatus\/(\d+|new)$/, 'filling_status_details', true],
            [/.*\/employee\/\d+\/payroll\/deductions$/, 'ee_deductions', true],
            [/.*\/employee\/\d+\/payroll\/deductions\/(\d+|new)$/, 'ee_deduction_details', true],
            [/.*\/employee\/\d+\/payroll\/bankAccounts$/, 'ee_bank_accounts', true],
            [/.*\/employee\/\d+\/payroll\/bankAccounts\/(\d+|new)$/, 'ee_bank_account_details', true],
            [/.*\/employee\/\d+\/payroll\/incomes\b/, 'ee_income', true],
            [/.*\/employee\/\d+\/payroll\/taxes\b/, 'ee_taxes', true],
            [/.*\/employee\/\d+\/payroll\/taxes\/\d+$/, 'filling_status_details', true],

            [/.*\/employee\/\d+\/advancedProfile\/contacts$/, 'dependents_contacts', true],
            [/.*\/employee\/\d+\/advancedProfile\/contacts\/(\d+|new)$/, 'dependent_details', true],

            [/.*\/employee\/\d+\/advancedProfile\/additionalAddress$/, 'additional_address', true],
            [/.*\/employee\/\d+\/advancedProfile\/additionalAddress\/(\d+|new)$/, 'additional_address_details', true],
            [/.*\/employee\/\d+\/advancedProfile\/priorEmployment$/, 'prior_employment', true],
            [/.*\/employee\/\d+\/advancedProfile\/priorEmployment\/(\d+|new)$/, 'prior_employment_details', true],
            [/.*\/employee\/\d+\/advancedProfile\/social\b/, 'social_media', true],
            [/.*\/employee\/\d+\/advancedProfile\/onboarding\b/, 'onboarding_profile_manage', true],
            [/.*\/employee\/\d+\/advancedProfile\/onboarding\/\d+$/, 'onboarding_task_details', true],
            [/.*\/employee\/\d+\/advancedProfile\/onboarding\/new$/, 'onboarding_task_add', true],
            [/.*\/employee\/\d+\/advancedProfile\/additionalDemographics$/, 'additional_demographics', true],

            // Positions

            [/.*\/positions$/, 'positions', true],
            [/.*\/positions\/\d+$/, 'position_details', true],
            [/.*\/positions\/new$/, 'position_add', true],
            [/.*\/positions\/(\d+|new)\/details\/information$/, 'position_details', true],
            [/.*\/positions\/(\d+|new)\/details\/classification$/, 'position_classification', true],
            [/.*\/positions\/(\d+|new)\/details\/recruiting$/, 'position_recruiting', true],
            [/.*\/positions\/(\d+|new)\/details\/wage$/, 'wage_information', true],
            [/.*\/positions\/(\d+|new)\/details\/list$/, 'assignments', true],

            // Settings

            [/.*\/settings\/hr\/jobs$/, 'jobs', true],
            [/.*\/settings\/hr\/jobs\/(\d+|new)$/, 'job_details', true],
            [/.*\/settings\/payroll\/incomes$/, 'income_settings', true],
            [/.*\/settings\/payroll\/incomes\/(\d+|new)$/, 'income_details', true],
            [/.*\/settings\/hr\/timeOffPlans$/, 'timeoff_plan_settings', true],
            [/.*\/settings\/hr\/timeOffPlans\/(\d+|new)$/, 'timeoffplan_add', true],
            [/.*\/settings\/hr\/benefits$/, 'benefits_settings', true],
            [/.*\/settings\/hr\/benefits\/(\d+|new)$/, 'benefit_details', true],
            [/.*\/settings\/hr\/openEnrollments$/, 'open_enrollments', true],
            [/.*\/settings\/hr\/openEnrollments\/\d+$/, 'open_enrollment_details', true],
            [/.*\/settings\/hr\/openEnrollments\/new$/, 'new_enrollment', true],
            [/.*\/settings\/hr\/employeeGroups$/, 'employee_groups_settings', true],
            [/.*\/settings\/hr\/employeeGroups\/(\d+|new)$/, 'employee_group_detail', true],
            [/.*\/settings\/hr\/salaryGrades\b/, 'salary_grades', true],
            [/.*\/settings\/hr\/jobCodes\b/, 'job_codes_settings', true],
            [/.*\/settings\/hr\/tasks$/, 'tasks_settings', true],
            [/.*\/settings\/hr\/tasks\/(\d+|new)$/, 'task_settings_details', true],
            [/.*\/settings\/hr\/taskGroups/, 'task_groups_settings', true],
            [/.*\/settings\/hr\/taskGroups\/(\d+|new)$/, 'task_groups_details', true],
            [/.*\/settings\/hr\/workLocations$/, 'work_location_settings', true],
            [/.*\/settings\/hr\/workLocations\/(\d+|new)$/, 'work_location_details', true],
            [/.*\/settings\/hr\/aca$/, 'aca_settings', true],
            [/.*\/settings\/hr\/aca\/(\d+|new)$/, 'aca_settings', true],
            [/.*\/settings\/hr\/projects$/, 'projects_settings', true],
            [/.*\/settings\/hr\/projects\/new$/, 'project_add', true],
            [/.*\/settings\/hr\/projects\/\d+$/, 'project_details', true],
            [/.*\/settings\/hr\/holidays$/, 'holidays', true],
            [/.*\/settings\/hr\/holidays\/(\d+|new)$/, 'holiday_details', true],
            [/.*\/settings\/hr\/carrierConnect\b/, 'carrier_connect', true],
            [/.*\/settings\/hr\/carriers$/, 'carrier', true],
            [/.*\/settings\/hr\/carriers\/(\d+|new)$/, 'carrier_details', true],
            [/.*\/settings\/hr\/companyEvents$/, 'company_events', true],
            [/.*\/settings\/hr\/companyEvents\/(\d+|new)$/, 'event_details', true],
            [/.*\/settings\/hr\/workPeriods$/, 'work_periods_settings', true],
            [/.*\/settings\/hr\/workPeriods\/(\d+|new)$/, 'work_periods_details', true],

            [/.*\/settings\/hr\/onboardings$/, 'onboarding_page', true],
            [/.*\/settings\/hr\/onboardings\/(\d+|new)$/, {
                'criterion_settings_onboarding' : 'onboarding_list_information',
                'criterion_common_onboarding_form' : 'onboarding_task_details'
            }, true],

            [/.*\/settings\/payroll\/schedules$/, 'payroll_schedule_settings', true],
            [/.*\/settings\/payroll\/schedules\/(\d+|new)$/, 'payroll_schedule_details', true],
            [/.*\/settings\/payroll\/payGroups$/, 'pay_group_settings', true],
            [/.*\/settings\/payroll\/payGroups\/(\d+|new)$/, 'pay_group_details', true],
            [/.*\/settings\/payroll\/timesheetLayouts$/, 'timesheet_layouts', true],
            [/.*\/settings\/payroll\/timesheetLayouts\/(\d+|new)$/, 'timesheet_layout_details', true],
            [/.*\/settings\/payroll\/bankAccounts$/, 'bank_account_settings', true],
            [/.*\/settings\/payroll\/bankAccounts\/(\d+|new)$/, 'bank_account_details', true],
            [/.*\/settings\/payroll\/timeClock$/, 'time_clock', true],
            [/.*\/settings\/payroll\/timeClock\/(\d+|new)$/, 'time_clock_details', true],
            [/.*\/settings\/payroll\/GLAccountMap$/, 'gl_account_map', true],
            [/.*\/settings\/payroll\/GLAccountMap\/(\d+|new)$/, 'gl_account_map_details', true],
            [/.*\/settings\/payroll\/deductions$/, 'deductions_settings', true],
            [/.*\/settings\/payroll\/deductions\/(\d+|new)$/, 'deduction_details', true],
            [/.*\/settings\/payroll\/deductionFrequency$/, 'deduction_frequency', true],
            [/.*\/settings\/payroll\/deductionFrequency\/(\d+|new)$/, 'deduction_frequency_details', true],
            [/.*\/settings\/payroll\/certifiedRates/, 'certified_rates', true],
            [/.*\/settings\/payroll\/certifiedRates\/(\d+|new)$/, 'certified_rates_details', true],
            [/.*\/settings\/payroll\/workersCompensations/, 'wc_settings', true],
            [/.*\/settings\/payroll\/workersCompensations\/\d+$/, 'wc_details', true],
            [/.*\/settings\/payroll\/workersCompensations\/new$/, 'wc_settings_add', true],

            [/.*\/settings\/payroll\/GLAccounts\b/, 'gl_accounts', true],
            [/.*\/settings\/payroll\/GLTaxes\b/, 'gl_taxes', true],
            [/.*\/settings\/payroll\/taxRates\b/, 'er_taxes', true],
            [/.*\/settings\/payroll\/taxRates\/(\d+|new)/, 'tax_rates_details', true],
            [/.*\/settings\/payroll\/shiftRates\b/, 'shift_rates', true],
            [/.*\/settings\/payroll\/shiftRates\/(\d+|new)$/, 'shift_rates_details', true],

            [/.*\/settings\/employeeEngagement\/communities$/, 'communities', true],
            [/.*\/settings\/employeeEngagement\/communities\/(\d+|new)$/, 'community_details', true],
            [/.*\/settings\/employeeEngagement\/badges\b/, 'badges', true],

            [/.*\/settings\/recruiting\/publishing\b/, 'job_publishing_settings', true],
            [/.*\/settings\/recruiting\/publishing\/(\d+|new)\b/, 'job_publishing_details', true],
            [/.*\/settings\/recruiting\/recruitingEmails$/, 'candidate_email', true],
            [/.*\/settings\/recruiting\/jobPortalSettings$/, 'job_portal', true],
            [/.*\/settings\/recruiting\/interviewQualifications$/, 'interview_qualifications', true],

            [/.*\/settings\/scheduling\/requiredCoverage\b/, 'required_coverage', true],

            [/.*\/settings\/general\/forms/, 'form_settings', true],
            [/.*\/settings\/general\/forms\/\d-\d+$/, 'forms_details', true],
            [/.*\/settings\/general\/forms\/new$/, 'forms_add', true],

            [/.*\/settings\/general\/documents\b/, 'documents', true],
            [/.*\/settings\/general\/videos\b/, 'videos', true],
            [/.*\/settings\/general\/links\b/, 'ess_links', true],

            [/.*\/settings\/learningManagement\/skills\b/, 'er_skills', true],
            [/.*\/settings\/learningManagement\/courses$/, 'er_courses', true],
            [/.*\/settings\/learningManagement\/courses\/(\d+|new)$/, 'course_details', true],
            [/.*\/settings\/learningManagement\/certification$/, 'er_certifications', true],
            [/.*\/settings\/learningManagement\/certification\/(\d+|new)$/, 'er_certification_details', true],
            [/.*\/settings\/learningManagement\/learningPaths$/, 'learning_path', true],
            [/.*\/settings\/learningManagement\/learningPaths\/(\d+|new)$/, 'learning_path_details', true],
            [/.*\/settings\/learningManagement\/instructors/, 'instructors', true],
            [/.*\/settings\/learningManagement\/instructors\/(\d+|new)$/, 'instructor_details', true],
            [/.*\/settings\/learningManagement\/classes$/, 'class', true],
            [/.*\/settings\/learningManagement\/classes\/(\d+|new)$/, 'class_details', true],

            [/.*\/settings\/performanceReviews\/ratingScale$/, 'rating_scales', true],
            [/.*\/settings\/performanceReviews\/ratingScale\/(\d+|new)$/, 'rating_scale_details', true],
            [/.*\/settings\/performanceReviews\/reviewPeriod$/, 'review_periods', true],
            [/.*\/settings\/performanceReviews\/reviewPeriod\/(\d+|new)$/, 'review_period_details', true],
            [/.*\/settings\/performanceReviews\/reviewTemplate$/, 'review_templates', true],
            [/.*\/settings\/performanceReviews\/reviewTemplate\/(\d+|new)$/, 'review_template_details', true],

            [/.*\/settings\/performanceReviews\/manageReviews\b/, 'manage_reviews', true],
            [/.*\/settings\/performanceReviews\/reviewCompetency\b/, 'review_competency', true],

            [/.*\/settings\/system\/securityProfiles$/, 'security_profiles', true],
            [/.*\/settings\/system\/securityProfiles\/(\d+|new)$/, 'security_profile_details', true],
            [/.*\/settings\/system\/overtimeRules$/, 'overtime_rules', true],
            [/.*\/settings\/system\/overtimeRules\/(\d+|new)$/, 'overtime_rules_details', true],
            [/.*\/settings\/system\/customForms$/, 'custom_forms', true],
            [/.*\/settings\/system\/customForms\/(\d+|new)$/, 'custom_form_details', true],
            [/.*\/settings\/system\/workflow$/, 'workflow_settings', true],
            [/.*\/settings\/system\/workflow\/(\d+|new)$/, 'workflow_details', true],
            [/.*\/settings\/system\/employers$/, 'employer_settings', true],
            [/.*\/settings\/system\/employers\/(\d+|new)$/, 'employer_details', true],
            [/.*\/settings\/system\/customTransfers$/, 'custom_transfers', true],
            [/.*\/settings\/system\/customTransfers\/(\d+|new)$/, 'custom_transfer_details', true],
            [/.*\/settings\/system\/customFieldFormats$/, 'custom_field_formats', true],
            [/.*\/settings\/system\/customFieldFormats\/(\d+|new)$/, 'custom_field_format_details', true],
            [/.*\/settings\/system\/customLocalizations$/, 'custom_labels', true],
            [/.*\/settings\/system\/essHelp$/, 'self_service_help', true],
            [/.*\/settings\/system\/essHelp\/(\d+|new)$/, 'help_details', true],
            [/.*\/settings\/system\/customFields\b/, 'custom_fields', true],
            [/.*\/settings\/system\/codeTables\b/, 'code_tables', true],
            [/.*\/settings\/system\/generalLedger\b/, 'gl_settings', true],
            [/.*\/settings\/system\/customReports\b/, 'custom_reports', true],
            [/.*\/settings\/system\/reportSettings\b/, 'report_settings', true],
            [/.*\/settings\/system\/classificationCodes\b/, 'classification_codes', true],
            [/.*\/settings\/system\/fieldConfiguration\b/, 'field_configuration', true],
            [/.*\/settings\/system\/staticTokens\b/, 'api_keys', true],
            [/.*\/settings\/system\/staticTokens\/new$/, 'api_key_add', true],
            [/.*\/settings\/system\/paySettings\b/, 'pay_settings', true],
            [/.*\/settings\/system\/emailLayouts\b/, 'email_layouts_settings', true],
            [/.*\/settings\/system\/taxEngine\b/, 'tax_engine', true],
            [/.*\/settings\/system\/taxEngine\/(\d+|new)\b/, 'tax_engine_add', true],
            [/.*\/settings\/system\/dataImport\b/, 'data_import', true],
            [/.*\/settings\/system\/documentStorage\b/, 'document_storage', true],
            [/.*\/settings\/system\/passwordPolicies\b/, 'password_policies', true],
            [/.*\/settings\/system\/sandboxSettings\b/, 'sandbox', true],
            [/.*\/settings\/system\/externalSystems\b/, 'external_systems', true],
            [/.*\/settings\/system\/taskScheduler$/, 'task_scheduler', true],
            [/.*\/settings\/system\/taskScheduler\/(\d+|new)$/, 'task_scheduler_details', true],
            [/.*\/settings\/system\/fieldConfiguration$/, 'audit', true]
        ]


    };
});
