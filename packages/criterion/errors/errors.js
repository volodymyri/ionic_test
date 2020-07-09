
var CRITERION_ERRORS_STORE_DATA = {
    errors: [
        {
            level: 1,
            code: "AUTH_CANNOT_REUSE_OLD_PASSWORD",
            message: i18n.gettext("Old password cannot be reused.")
        },
        {
            level: 1,
            code: "AUTH_PASSWORD_SHOULD_CONTAIN_UPPER_CASE",
            message: i18n.gettext("New password must contain at least one upper case letter.")
        },
        {
            level: 1,
            code: "AUTH_PASSWORD_SHOULD_CONTAIN_LOWER_CASE",
            message: i18n.gettext("New password must contain at least one lower case letter.")
        },
        {
            level: 1,
            code: "AUTH_PASSWORD_SHOULD_CONTAIN_DIGIT",
            message: i18n.gettext("New password must contain at least one digit.")
        },
        {
            level: 1,
            code: "AUTH_PASSWORD_SHOULD_CONTAIN_NON_ALPHA",
            message: i18n.gettext("New password must contain at least one non alphanumeric character.")
        },
        {
            level: 1,
            code: "AUTH_PASSWORD_TOO_SHORT",
            message: i18n.gettext("New password must contain minimum {0} characters.")
        },
        {
            level: 1,
            code: "INCORRECT_OLD_PASSWORD",
            message: i18n.gettext("Old password you have provided is incorrect. Please provide valid password.")
        },
        {
            level: 1,
            code: "INCORRECT_TOTP",
            message: i18n.gettext("The authentication code you entered is incorrect.")
        },
        {
            level: 1,
            code: "ENTITY_DOES_NOT_EXISTS",
            message: i18n.gettext("Entity does not exist. Table name: {0}, id: {1}")
        },
        {
            level: 1,
            code: "CANNOT_DELETE_OR_UPDATE_PARENT_ROW",
            message: i18n.gettext("Failed to delete {0}. Please remove {1} references to this item.")
        },
        {
            level: 1,
            code: "INVALID_XML_STRUCTURE",
            message: i18n.gettext("Invalid xml structure: <BR/> {0}")
        },
        {
            level: 1,
            code: "ENDPOINT_IS_NOT_VALID",
            message: i18n.gettext("Invalid app endpoint: {0}")
        },
        {
            level: 1,
            code: "EMPLOYER_SETTINGS_DOES_NOT_HAVE_TAX_FILING_CLIENT_KEY",
            message: i18n.gettext("Can't generate file. Employer {0} settings do not have tax filing client key.")
        },
        {
            level: 1,
            code: "EMPLOYER_SETTINGS_DOES_NOT_HAVE_EMPLOYER_TYPE_CD",
            message: i18n.gettext("Can't generate file. Employer {0} settings do not have employer type code.")
        },
        {
            level: 1,
            code: "INVALID_WORK_LOCATION_STATE_CODE",
            message: i18n.gettext("Invalid state code {0} found for work location {1}.")
        },
        {
            level: 1,
            code: "EMPLOYEE_ID_SHOULD_NOT_HAVE_LENGTH_MORE_THAN_20",
            message: i18n.gettext("Employee's id '{0}' should not be longer than 20 characters.")
        },
        {
            level: 1,
            code: "PERSON_STATE_CODE_HAS_INVALID_FORMAT_NOT_EQUAL_2",
            message: i18n.gettext("Person's state code '{0}' must be equal to 2 characters.")
        },
        {
            level: 1,
            code: "ZIP_CODE_HAS_INVALID_FORMAT_NOT_EQUAL_5",
            message: i18n.gettext("Zip's code '{0}' must be equal to 5 characters.")
        },
        {
            level: 1,
            code: "ZIP_EXT_HAS_INVALID_FORMAT_NOT_EQUAL_4",
            message: i18n.gettext("Zip's ext '{0}' must be equal to 4 characters.")
        },
        {
            level: 1,
            code: "COUNTRY_CODE_DETAIL_ATTRIBUTE_1_HAS_INVALID_FORMAT_NOT_EQUAL_2",
            message: i18n.gettext("The attribute 1 value '{0}' in detail in country code table must be equal to 2 characters.")
        },
        {
            level: 1,
            code: "WORK_LOCATION_STATE_CODE_HAS_INVALID_FORMAT_NOT_EQUAL_2",
            message: i18n.gettext("Work Location's state code '{0}' must be equal to 2 characters.")
        },
        {
            level: 1,
            code: "EMPLOYER_SETTINGS_CLIENT_KEY_SHOULD_NOT_HAVE_LENGTH_MORE_THAN_100",
            message: i18n.gettext("Employer's settings tax filling client key '{0}' should not be longer than 100 characters.")
        },
        {
            level: 1,
            code: "EMPLOYER_SETTINGS_LEGAL_NAME_SHOULD_NOT_HAVE_LENGTH_MORE_THAN_40",
            message: i18n.gettext("Employer's legal name '{0}' should not be longer than 40 characters.")
        },
        {
            level: 1,
            code: "DATA_TRANSFER_HAS_INVALID_FILE",
            message: i18n.gettext("Can't transfer data. Data transfer {0} contains invalid file.")
        },
        {
            level: 1,
            code: "DATA_TRANSFER_HAS_NO_FILES",
            message: i18n.gettext("\"fileCustom\" or \"fileStandard\" should be defined.")
        },
        {
            level: 1,
            code: "BATCH_CALCULATION_IS_IN_PROGRESS_STATE",
            message: i18n.gettext("Payroll batch ({0}) is being processed and cannot be changed.")
        },
        {
            level: 1,
            code: "ZIP_CODE_TOO_SHORT",
            message: i18n.gettext("ZIP code should be at least {0} characters long.")
        },
        {
            level: 1,
            code: "DELEGATION_TO_ONESELF",
            message: i18n.gettext("It's impossible to delegate workflow to yourself.")
        },
        {
            level: 1,
            code: "END_DATE_IS_BEFORE_START_DATE",
            message: i18n.gettext("Workflow delegation's end date {1:date} can't be before start date {0:date}.")
        },
        {
            level: 1,
            code: "EMPLOYEE_IS_NOT_YOUR_TEAM_MEMBER",
            message: i18n.gettext("Employee {0} is not a member of your team.")
        },
        {
            level: 1,
            code: "EMPLOYEE_NO_PRIMARY_WORK_LOCATION",
            message: i18n.gettext("Invalid data. Employee {0} doesn't have primary work location assigned. Please contact your system administrator.")
        },
        {
            level: 1,
            code: "EMPLOYER_LOCATION_STATE_UNDEFINED",
            message: i18n.gettext("Please provide state for Employer Location '{0}'.")
        },
        {
            level: 1,
            code: "INCORRECT_DATE_RANGE",
            message: i18n.gettext("Incorrect date range. Effective date({0:date}) should be less than Expiration date({1:date}).")
        },
        {
            level: 1,
            code: "DATA_TOO_LONG",
            message: i18n.gettext("Cannot update data. Data length is exceeded in column '{0}'.")
        },
        {
            level: 1,
            code: "VALUE_TOO_LONG",
            message: i18n.gettext("Cannot update data. Value length is exceeded in column '{0}'.")
        },
        {
            level: 1,
            code: "VALIDATION_PERSON_EMAIL_EXISTS",
            message: i18n.gettext("Person with {0} email already exists. Please use another email.")
        },
        {
            level: 1,
            code: "SALARY_GRADE_NOT_UNIQUE",
            message: i18n.gettext("Similar SalaryGrade record already exists in the database. Please provide unique salary grade.")
        },
        {
            level: 1,
            code: "PENDING_CHECKS_RECALCULATION_ALERT",
            message: i18n.gettext("Similar SalaryGrade record already exists in the database. Please provide unique salary grade.")
        },
        {
            level: 1,
            code: "BENEFIT_COVERAGE_FORMULA_NOT_VALID",
            message: i18n.gettext("Incorrect formula. Coverage formula is not valid.")
        },
        {
            level: 1,
            code: "BENEFIT_PREMIUM_FORMULA_NOT_VALID",
            message: i18n.gettext("Incorrect formula. Premium formula is not valid.")
        },
        {
            level: 1,
            code: "BENEFIT_DEPENDENT_FORMULA_NOT_VALID",
            message: i18n.gettext("Incorrect formula. Dependent formula is not valid.")
        },
        {
            level: 1,
            code: "BENEFIT_EE_CONTRIBUTION_FORMULA_NOT_VALID",
            message: i18n.gettext("Incorrect formula. Employee Contribution formula is not valid.")
        },
        {
            level: 1,
            code: "BENEFIT_ELIGIBILITY_FORMULA_NOT_VALID",
            message: i18n.gettext("Incorrect formula. Eligibility formula is not valid.")
        },
        {
            level: 1,
            code: "BENEFIT_EFFECTIVE_FORMULA_NOT_VALID",
            message: i18n.gettext("Incorrect formula. Effective formula is not valid.")
        },
        {
            level: 1,
            code: "BENEFIT_EXPIRE_FORMULA_NOT_VALID",
            message: i18n.gettext("Incorrect formula. Expire formula is not valid.")
        },
        {
            level: 1,
            code: "PAYROLL_IMPORT_SETTINGS_UNDEFINED",
            message: i18n.gettext("Payroll import settings are not defined. Please upload settings XML.")
        },
        {
            level: 1,
            code: "PAYROLL_IMPORT_SETTINGS_INVALID",
            message: i18n.gettext("Payroll import settings has invalid XML, tag: {0}.")
        },
        {
            level: 1,
            code: "PAYROLL_IMPORT_ALREADY_SAVED_TO_BATCH",
            message: i18n.gettext("Selected payroll import is already saved to batch. Please import another file.")
        },
        {
            level: 1,
            code: "PAYROLL_IMPORT_FILE_IS_EMPTY",
            message: i18n.gettext("Uploaded .csv file is empty. Please provide file of correct format.")
        },
        {
            level: 1,
            code: "PAYROLL_IMPORT_FILE_HAS_NO_IMPORT_DETAILS",
            message: i18n.gettext("Uploaded .csv file or timesheet has no import details. Please provide file of correct format or check timesheet period.")
        },
        {
            level: 1,
            code: "PAYROLL_IMPORT_COLUMN_NOT_FOUND",
            message: i18n.gettext("Uploaded .csv file doesn't contain Column {0}. Please provide file of correct format.")
        },
        {
            level: 1,
            code: "PAYROLL_IMPORT_LOCATION_NOT_FOUND",
            message: i18n.gettext("Can't process payroll import. Employer with location with code {0} doesn't exist.")
        },
        {
            level: 1,
            code: "PAYROLL_IMPORT_TASK_NOT_FOUND",
            message: i18n.gettext("Can't process payroll import. Employer task with code {0} doesn't exist.")
        },
        {
            level: 1,
            code: "PAYROLL_IMPORT_PROJECT_NOT_FOUND",
            message: i18n.gettext("Can't process payroll import. Project with code {0} doesn't exist.")
        },
        {
            level: 1,
            code: "EMPLOYEE_DEDUCTION_WILL_EXPIRE",
            message: i18n.gettext("Employee deductions cannot overlap. Prior employee deduction will expire on {0:date}. Please close the prior deduction before creating a new one with the same dates.")
        },
        {
            level: 1,
            code: "INVALID_SCHEDULE_DAYS_BEFORE_PAY_DATE",
            message: i18n.gettext("The range for Pay Date Days After is [{0}, {1}]. Please specify the date that falls into this date range.")
        },
        {
            level: 1,
            code: "PAYROLL_INCOME_LIST_ALREADY_USED",
            message: i18n.gettext("Income {0} is already used in the batch. Please select another Income type.")
        },
        {
            level: 1,
            code: "PAY_RATE_FALL_OUTSIDE_THE_RANGE",
            message: i18n.gettext("Pay rate({0}) for assignment can't fall outside the min/max({1}/{2}) range of the salary grade.")
        },
        {
            level: 1,
            code: "INCORRECT_TIME_SHEET_DETAIL_HOURS",
            message: i18n.gettext("Time format {0} is incorrect. Timesheet detail hours should fall in range of {1} - {2}.")
        },
        {
            level: 1,
            code: "INCORRECT_TIME_SHEET_DETAIL_MINUTES",
            message: i18n.gettext("Time format {0} is incorrect. Timesheet detail minutes should fall in range of {1} - {2}.")
        },
        {
            level: 1,
            code: "INCORRECT_TIME_SHEET_DETAIL_UNITS",
            message: i18n.gettext("Time format {0} is incorrect. Timesheet detail units should be greater or equal 0.")
        },
        {
            level: 1,
            code: "SKIP_TIME_OFF",
            message: i18n.gettext("Time off is not added. Employee has Regular Closed Day or Holiday in specified period.")
        },
        {
            level: 1,
            code: "IMPOSSIBLE_TO_TERMINATE_EMPLOYEE",
            message: i18n.gettext("Employee cannot be terminated. Employee has active additional assignments. Please remove all the references to the employee.")
        },
        {
            level: 1,
            code: "IMPOSSIBLE_TO_TERMINATE_TERMINATED_EMPLOYEE",
            message: i18n.gettext("You cannot terminate a terminated employee.")
        },
        {
            level: 1,
            code: "INCORRECT_TERMINATION_DATE",
            message: i18n.gettext("Termination date {0:date} should be equal to or later than effective date of last assignment detail<br>{1:date}.")
        },
        {
            level: 1,
            code: "ATTEMPT_UPDATE_PENDING_APPROVAL_EMPLOYEE",
            message: i18n.gettext("Can't update employee. Employee changes are in pending approval state. Workflow {0} should be completed first.")
        },
        {
            level: 1,
            code: "EXPECTED_NON_MANUAL_BENEFIT_PLAN_OPTION",
            message: i18n.gettext("Wrong benefit plan option. Non-manual benefit plan option is expected for Option Group {0}.")
        },
        {
            level: 1,
            code: "JOB_POSTING_CANDIDATE_INVALID_RATING",
            message: i18n.gettext("Incorrect candidate rating. Rating {0} should be in range [0,5] with 0.5 as a step.")
        },
        {
            level: 1,
            code: "EMPLOYER_NO_NATIONAL_ID",
            message: i18n.gettext("Employer {0} doesn't have National Identifier.")
        },
        {
            level: 1,
            code: "EXTRA_PRIMARY_EMPLOYER_LOCATION",
            message: i18n.gettext("Can't set this location as primary. Primary work location for this employer already exists. Only one primary work location per employer is allowed.")
        },
        {
            level: 1,
            code: "PERSON_ADDRESS_STATE_UNDEFINED",
            message: i18n.gettext("Please provide state in address for person {0}.")
        },
        {
            level: 1,
            code: "MORE_THAN_ONE_PRIMARY_PERSON_ADDRESS",
            message: i18n.gettext("Person {0} has several primary addresses, it's allowed to have just one.")
        },
        {
            level: 1,
            code: "MORE_THAN_ONE_MAILING_PERSON_ADDRESS",
            message: i18n.gettext("Person {0} has several mailing addresses, it's allowed to have just one.")
        },
        {
            level: 1,
            code: "NO_PRIMARY_PERSON_ADDRESS",
            message: i18n.gettext("Person {0} does not have primary address, but should have at least one.")
        },
        {
            level: 1,
            code: "MORE_THAN_ONE_PRIMARY_EMPLOYEE_WORK_LOCATION",
            message: i18n.gettext("Employee {0} has several primary work locations, it's allowed to have just one.")
        },
        {
            level: 1,
            code: "NO_PRIMARY_EMPLOYEE_WORK_LOCATION",
            message: i18n.gettext("Employee {0} does not have primary work location, but should have at least one.")
        },
        {
            level: 1,
            code: "PERSON_ADDRESS_COUNTRY_TWO_LETTER_CODE_UNDEFINED",
            message: i18n.gettext("Please provide country 2-letter code (code table detail attribute 1) for person {0}.")
        },
        {
            level: 1,
            code: "PERSON_ADDRESS_ZIP_CODE_UNDEFINED",
            message: i18n.gettext("Please provide zip code in address for person {0}.")
        },
        {
            level: 1,
            code: "ZIP_CODE_IS_EMPTY_IN_WORK_LOCATION",
            message: i18n.gettext("Zip code is empty in work location {0}.")
        },
        {
            level: 1,
            code: "ADDRESS_1_IS_EMPTY_IN_WORK_LOCATION",
            message: i18n.gettext("Address 1 is empty in work location {0}.")
        },
        {
            level: 1,
            code: "CITY_IS_EMPTY_IN_WORK_LOCATION",
            message: i18n.gettext("City is empty in work location {0}.")
        },
        {
            level: 1,
            code: "INCORRECT_BASE_TIMEOFF_DURATION_DAY_VALUE",
            message: i18n.gettext("Time off duration cannot exceed employee average hours.")
        },
        {
            level: 1,
            code: "ACA_DATA_ALREADY_GENERATED",
            message: i18n.gettext("ACA data for Employer {0} and year {1} has already been generated.")
        },
        {
            level: 1,
            code: "BENEFIT_PLAN_ALREADY_EXISTS",
            message: i18n.gettext("Benefit plan rate with code '{0}' and tier '{1}' already exists.")
        },
        {
            level: 1,
            code: "DASHBOARD_INVALID_VIEW_NUMBER",
            message: i18n.gettext("Invalid View Number {0}. View number should be in range [1,3]. Please provide correct number.")
        },
        {
            level: 1,
            code: "DASHBOARD_VIEW_ALREADY_USED",
            message: i18n.gettext("This dashboard view is already in use. Please choose another dashboard view.")
        },
        {
            level: 1,
            code: "DUPLICATE_EMPLOYEE_GROUP_MEMBER",
            message: i18n.gettext("The group contains duplicate members. Please remove duplicates.")
        },
        {
            level: 1,
            code: "REVIEW_TYPE_DISABLED",
            message: i18n.gettext("Review Type '{0}' is disabled for Review Period '{1}'. Please enable it before opening this item.")
        },
        {
            level: 1,
            code: "REVIEW_TYPE_IS_IN_USE",
            message: i18n.gettext("Review type \"{0}\" is being used.")
        },
        {
            level: 1,
            code: "ALREADY_SCHEDULED_FOR_SHIFT",
            message: i18n.gettext("Employee is already scheduled for a shift for this period. Please choose another employee.")
        },
        {
            level: 1,
            code: "MORE_EMPLOYEES_THAN_SHIFT_REQUIRED",
            message: i18n.gettext("Shift required number is exceeded. Can't add more employees because shift required number is: {0}.")
        },
        {
            level: 1,
            code: "SHIFT_DURATION_TOO_LONG",
            message: i18n.gettext("Shift duration is exceeded. Shift duration can't be more than 96 hours.")
        },
        {
            level: 1,
            code: "SHIFT_END_BEFORE_START",
            message: i18n.gettext("Wrong shift dates. Shift end date must be later than start date.")
        },
        {
            level: 1,
            code: "UNABLE_TO_DELETE_ACTIVE_OPEN_ENROLLMENT",
            message: i18n.gettext("Can't remove active employer open enrollment. Please close the enrollment before removing it.")
        },
        {
            level: 1,
            code: "POPULATION_ALREADY_DEFINED",
            message: i18n.gettext("Population for this area is already defined. Please select another work area.")
        },
        {
            level: 1,
            code: "REQUIRED_COVERAGE_ALREADY_EXISTS",
            message: i18n.gettext("Required coverage already exists for this Employer / Work Location / Work Area / Job.")
        },
        {
            level: 1,
            code: "UNABLE_TO_DELETE_WORKFLOW",
            message: i18n.gettext("Unable to delete Workflow. Delete all parent Employee Group Workflow records first.")
        },
        {
            level: 1,
            code: "EMPLOYEE_NO_DOB",
            message: i18n.gettext("Employee {0} doesn't have date of birth.")
        },
        {
            level: 1,
            code: "EMPLOYEE_NO_MAILING_ADDRESS",
            message: i18n.gettext("Employee {0} doesn't have mailing address.")
        },
        {
            level: 1,
            code: "EMPLOYEE_NO_NATIONAL_ID",
            message: i18n.gettext("Employee {0} doesn't have national identifier.")
        },
        {
            level: 1,
            code: "EMPLOYEE_NO_MIDDLE_NAME",
            message: i18n.gettext("Employee {0} doesn't have middle name specified.")
        },
        {
            level: 1,
            code: "RATING_ABOVE_LIMIT",
            message: i18n.gettext("Incorrect rating. Rating {0} is above limit. Please specify lower rating.")
        },
        {
            level: 1,
            code: "PERSON_DUPLICATE_SKILL",
            message: i18n.gettext("Duplicate skills are entered for this person. Please remove duplicates.")
        },
        {
            level: 1,
            code: "PERSON_DUPLICATE_NATIONAL_IDENTIFIER",
            message: i18n.gettext("An entry with provided SSN already exists in Criterion HCM. Please use another number.")
        },
        {
            level: 1,
            code: "POSITION_IS_REQUIRED_BY_POSITION_CONTROL",
            message: i18n.gettext("Position should be set as it is required by Employer's Position Control.")
        },
        {
            level: 1,
            code: "PERSON_NATIONAL_IDENTIFIER_REQUIRED",
            message: i18n.gettext("Person {0} should have national identifier field specified.")
        },
        {
            level: 1,
            code: "GL_SETUP_UNDEFINED",
            message: i18n.gettext("GL setup is not defined for the employer. Please provide GL settings in the System Configuration Settings section.")
        },
        {
            level: 1,
            code: "GL_SETUP_INVALID_PARAM_1",
            message: i18n.gettext("Incorrect GL setup. Parameter1 (companyId) is not defined.")
        },
        {
            level: 1,
            code: "GL_SETUP_INVALID_PARAM_2",
            message: i18n.gettext("Incorrect GL setup. Parameter2 (userId) is not defined.")
        },
        {
            level: 1,
            code: "RECURRING_BLOCK_TOO_LONG",
            message: i18n.gettext("Wrong recurring block format. Recurring block can't be more than 168 hours.")
        },
        {
            level: 1,
            code: "RECURRING_END_DATE_TOO_EARLY",
            message: i18n.gettext("Wrong recurring block dates. Recurring end date must be later than today.")
        },
        {
            level: 1,
            code: "RECURRING_END_DATE_BEFORE_START",
            message: i18n.gettext("Wrong recurring date. Recurring end date must be later than start date.")
        },
        {
            level: 1,
            code: "RECURRING_END_DATE_TOO_LATE",
            message: i18n.gettext("Wrong recurring block dates. Recurring end date must not be later than one year from today.")
        },
        {
            level: 1,
            code: "UNKNOWN_DATA_IMPORT_STYLESHEET_TYPE",
            message: i18n.gettext("Unknown data import stylesheet type ({0}).")
        },
        {
            level: 1,
            code: "NO_DATA_TO_PROCESS",
            message: i18n.gettext("No data to process.")
        },
        {
            level: 1,
            code: "TIMESHEET_TYPE_IS_NOT_DEFINED_FOR_EMPLOYEE",
            message: i18n.gettext("Timesheet type is not defined for employee.")
        },
        {
            level: 1,
            code: "NOT_ENOUGH_AVAILABLE_DAYS_TO_GET_TIMEOFF",
            message: i18n.gettext("Employee does not have enough time accrued to request {0} time off for period {3:date} - {4:date}. Requested time - {2} days exceeds available time - {1} days.")
        },
        {
            level: 1,
            code: "NOT_ENOUGH_AVAILABLE_HOURS_TO_GET_TIMEOFF",
            message: i18n.gettext("Employee does not have enough time accrued to request {0} time off for period {3:date} - {4:date}. Requested time - {2} hours exceeds available time - {1} hours.")
        },
        {
            level: 1,
            code: "EMPLOYEE_WITH_PAYROLL_NUMBER_ALREADY_EXISTS",
            message: i18n.gettext("Can't update profile. Employee with this payroll number already exists.")
        },
        {
            level: 1,
            code: "EMPLOYEE_WITH_EMPLOYEE_NUMBER_ALREADY_EXISTS",
            message: i18n.gettext("Can't update profile. Employee with this employee number already exists.")
        },
        {
            level: 1,
            code: "GROSS_UP_ONLY_AMOUNT",
            message: i18n.gettext("Can't gross up. You can only gross up income with calculation method set to \"Amount\".")
        },
        {
            level: 1,
            code: "GROSS_UP_ONLY_NOT_REIMBURSEMENT",
            message: i18n.gettext("Can't gross up. You can only gross up income which is not reimbursement.")
        },
        {
            level: 1,
            code: "QUESTION_WITH_LABEL_EXISTS",
            message: i18n.gettext("Can't add question. Question with this label already exists.")
        },
        {
            level: 1,
            code: "DIF_EXCEPTION_WHILE_DATA_IMPORT_PROCESSING",
            message: i18n.gettext("Can't process Imported file. Warnings: {0}.")
        },
        {
            level: 1,
            code: "DIF_INCORRECT_DATETIME_FORMAT",
            message: i18n.gettext("Can't process imported file. Value({0}) can't be parsed as Timestamp({1}) format.")
        },
        {
            level: 1,
            code: "DIF_INCORRECT_DATE_FORMAT",
            message: i18n.gettext("Can't process imported file. Value({0}) can't be parsed as Date({1}) format.")
        },
        {
            level: 1,
            code: "DIF_UNKNOWN_EMPLOYEE_INFORMATION_OPERATION_TYPE",
            message: i18n.gettext("Can't process imported file. Unknown employee information operation type '{0}'.")
        },
        {
            level: 1,
            code: "DIF_UNKNOWN_EMPLOYEE_BENEFIT_OPERATION_TYPE",
            message: i18n.gettext("Can't process imported file. Unknown employee benefit operation type '{0}'.")
        },
        {
            level: 1,
            code: "DIF_UNKNOWN_EMPLOYEE_COMPENSATION_OPERATION_TYPE",
            message: i18n.gettext("Can't process imported file. Unknown employee compensation operation type '{0}'.")
        },
        {
            level: 1,
            code: "DIF_ASSIGNMENT_WAS_NOT_FOUND",
            message: i18n.gettext("Failed to find active assignments for payrollNumber='{0}' and positionCode='{1}'.")
        },
        {
            level: 1,
            code: "DIF_EMPLOYER_WAS_NOT_FOUND",
            message: i18n.gettext("No employer found. Employer - {0} with payroll number {1} was not found.")
        },
        {
            level: 1,
            code: "DIF_ER_BENEFIT_PLAN_WAS_NOT_FOUND",
            message: i18n.gettext("No benefit plan found. Employer benefit for {0} with benefit code - '{1}' was not found.")
        },
        {
            level: 1,
            code: "DIF_BENEFIT_SHOULD_CONTAIN_AT_LEAST_ONE_FIELD_TO_UPDATE",
            message: i18n.gettext("Can't process imported file. Benefit information should contain at least one field.<br>Row detail: payrollNumber='{0}', employerBenefitCode='{1}'.")
        },
        {
            level: 1,
            code: "DIF_BENEFIT_SHOULD_CONTAIN_ONLY_ONE_FIELD_TO_UPDATE",
            message: i18n.gettext("Can't process imported file. Benefit information should contain only one field to update but {0} fields were found.<br>Row detail: payrollNumber='{1}', employerBenefitCode='{2}'.")
        },
        {
            level: 1,
            code: "DEFAULT_POSITION_NOT_FOUND",
            message: i18n.gettext("Can't process imported file. No default position found. Position with code='DEFAULT' was not found for {0}.")
        },
        {
            level: 1,
            code: "PERSON_PREFERENCES_NOT_FOUND",
            message: i18n.gettext("Can't process imported file. No person preferences found for {0}.")
        },
        {
            level: 1,
            code: "WORKFLOW_NOT_CONFIGURED",
            message: i18n.gettext("None of employee groups is referenced by the workflow.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_CANDIDATE_RESUME_CONTENT_TYPE",
            message: i18n.gettext("Failed to download candidate resume. Document type '{0}' is not supported.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_CANDIDATE_COVER_LETTER_CONTENT_TYPE",
            message: i18n.gettext("Failed to download candidate cover letter. Document type '{0}' is not supported.")
        },
        {
            level: 1,
            code: "BADGE_WITH_THIS_DESCRIPTION_EXISTS",
            message: i18n.gettext("Can't create badge. Badge with this description already exists.")
        },
        {
            level: 1,
            code: "THE_SAME_DEDUCTION_ALREADY_EXISTS",
            message: i18n.gettext("Can't add deduction. This deduction already exists.")
        },
        {
            level: 1,
            code: "NEW_DEDUCTION_OVERLAPS_EXISTED_DEDUCTION",
            message: i18n.gettext("Can't create deduction. '{0}' deduction overlaps '{1}' deduction. Dates of existing deduction ({2:date}-{3:date}) overlap dates of the new deduction ({4:date}-{5:date}). Change dates of the new deduction.")
        },
        {
            level: 1,
            code: "TIMEOFF_ACCRUED_FORMULA_NOT_VALID",
            message: i18n.gettext("Can't save time off plan. Accrued formula you have provided is not valid.")
        },
        {
            level: 1,
            code: "TIMEOFF_EFFECTIVE_DATE_FORMULA_NOT_VALID",
            message: i18n.gettext("Can't save time off plan. Effective Date formula you have provided is not valid.")
        },
        {
            level: 1,
            code: "TIMEOFF_ELIGIBILITY_FORMULA_NOT_VALID",
            message: i18n.gettext("Can't save time off plan. Eligibility formula you have provided is not valid.")
        },
        {
            level: 1,
            code: "TIMEOFF_NEGATIVE_CAP_FORMULA_NOT_VALID",
            message: i18n.gettext("Can't save time off plan. Negative Cap formula you have provided is not valid.")
        },
        {
            level: 1,
            code: "TIMEOFF_THRESHOLD_FORMULA_NOT_VALID",
            message: i18n.gettext("Can't save time off plan. Threshold formula you have provided is not valid.")
        },
        {
            level: 1,
            code: "TIMEOFF_WAITING_PERIOD_FORMULA_NOT_VALID",
            message: i18n.gettext("Can't save time off plan. Waiting Period formula you have provided is not valid.")
        },
        {
            level: 1,
            code: "TIMEOFF_PLAN_POTENTIAL_VALUE_IS_LESS_THAN_ACCRUED",
            message: i18n.gettext("Time off potential time cannot be less than accrued time. Potential time is - '{0}', accrued time is - '{1}'.")
        },
        {
            level: 1,
            code: "TIMEOFF_CARRYOVER_FORMULA_NOT_VALID",
            message: i18n.gettext("Can't save time off plan. Time off carry over formula is not valid.")
        },
        {
            level: 1,
            code: "UNABLE_TO_SET_BENEFIT_PLAN_AS_INACTIVE",
            message: i18n.gettext("Can't set '{0}' benefit plan to inactive. The plan is in use.")
        },
        {
            level: 1,
            code: "UNABLE_TO_CHANGE_BENEFIT_PLAN_TYPE",
            message: i18n.gettext("Can't change benefit plan type. '{0}' plan is used in the pay rate calculations.")
        },
        {
            level: 1,
            code: "BENEFIT_PLAN_ALREADY_USED_BY_EMPLOYEE",
            message: i18n.gettext("Can't change benefit plan options. This plan is in use. Please remove all the references to the benefit plan before changing its options.")
        },
        {
            level: 1,
            code: "UNABLE_TO_SELECT_MORE_THAN_ONE_DEFAULT_BENEFIT_OPTION",
            message: i18n.gettext("Can't select more than one default benefit option.")
        },
        {
            level: 1,
            code: "UNABLE_TO_UPDATE_TERMINATED_ASSIGNMENT",
            message: i18n.gettext("Can't update assignment. This assignment has been terminated.")
        },
        {
            level: 1,
            code: "ASSIGNMENT_DETAIL_FTE_GREATER_THAN_REMAINING",
            message: i18n.gettext("Can't update assignment. Full Time Equivalency {0} is greater than remaining {1}.")
        },
        {
            level: 1,
            code: "EE_INCOME_IS_USED_IN_TIMESHEET_TASK",
            message: i18n.gettext("Can't delete income. '{0}' income is used in employee timesheet tasks.")
        },
        {
            level: 1,
            code: "EE_BENEFIT_OPTION_WAS_NOT_DEFINED",
            message: i18n.gettext("Can't create benefit plan. Employee benefit options are not defined. Options should be provided for {0} in option group {1}.")
        },
        {
            level: 1,
            code: "VALUE_SHOULD_BE_DEFINED_FOR_MANUAL_OPTION",
            message: i18n.gettext("Can't create benefit plan. 'Value' should be defined for manual option in option group {0} of '{1}' plan.")
        },
        {
            level: 1,
            code: "VALUE_SHOULD_BE_DEFINED_FOR_NON_MANUAL_OPTION",
            message: i18n.gettext("Can't create benefit plan. `Value` should be defined for non-manual option in option group {0} of {1} plan.")
        },
        {
            level: 1,
            code: "LAST_EE_BENEFIT_PLAN_SHOULD_BE_EXPIRED",
            message: i18n.gettext("Can't create benefit plan. Employee benefit plan '{0}' with code '{1}' has not expired yet.")
        },
        {
            level: 1,
            code: "MANUAL_VALUE_SHOULD_BE_DEFINED_FOR_MANUAL_OPTION",
            message: i18n.gettext("Can't create benefit plan. `manualValue` should be defined for manual option in option group {0} of {1} plan.")
        },
        {
            level: 1,
            code: "BENEFIT_PLAN_OPTION_ID_SHOULD_BE_DEFINED_FOR_MANUAL_OPTION",
            message: i18n.gettext("Can't create benefit plan. `benefitPlanOptionId` should be defined for non-manual option in option group {0} of {1} plan.")
        },
        {
            level: 1,
            code: "ENTERED_TIME_OFF_HOURS_SHOULD_BE_LESS_OR_EQUAL_TO_EE_AVERAGE_HOURS",
            message: i18n.gettext("Employee time off hours '{0}' can't exceed employee average hours '{1}'.")
        },
        {
            level: 1,
            code: "EE_AVERAGE_HOURS_SHOULD_BE_POSITIVE",
            message: i18n.gettext("Employee average hours '{0}' should be more than 0.")
        },
        {
            level: 1,
            code: "TIME_OFF_IS_NOT_APPROVED",
            message: i18n.gettext("Time off ({0} {1:date}) is not approved.")
        },
        {
            level: 1,
            code: "UNABLE_TO_IMPORT_TIMESHEETS_TO_A_BATCH_WITHOUT_PAYROLL_RECORDS",
            message: i18n.gettext("Unable to import timesheets. Timesheets cannot be imported to a batch without payroll records.")
        },
        {
            level: 1,
            code: "CANT_PROCESS_EXPRESSION_AS_EXPECTED_TYPE",
            message: i18n.gettext("Can't update '{2}' plan. Invalid format is used in '{0}' formula. Expected result should be of '{1}' type.")
        },
        {
            level: 1,
            code: "EE_HAS_NOT_BEEN_MAPPED_WITH_ANY_COMPANY_HOLIDAY",
            message: i18n.gettext("{0} doesn't have any company holidays assigned for {1} year.")
        },
        {
            level: 1,
            code: "WRONG_EMPLOYEE_GROUP_TIMESHEET_TYPE_CONFIGURATION",
            message: i18n.gettext("Invalid timesheet layout configuration. {0} timesheets found for {1} employee group. Only one timesheet layout should be available for an employee.")
        },
        {
            level: 1,
            code: "UNKNOWN_CONTENT_TYPE",
            message: i18n.gettext("Can't upload file. Files of {0} type are not supported.")
        },
        {
            level: 1,
            code: "EMPLOYEE_WITH_EE_NUMBER_ALREADY_EXISTS",
            message: i18n.gettext("Can't import data. Employee number ({0}) already exists.")
        },
        {
            level: 1,
            code: "SECURITY_CANNOT_VIEW_REPORT",
            message: i18n.gettext("Report {0} is not available. Check your profile privileges.")
        },
        {
            level: 1,
            code: "SECURITY_CHECK_DB_PRIVILEGES",
            message: i18n.gettext("Can't {0} {1}. Please check your profile privileges.")
        },
        {
            level: 1,
            code: "SECURITY_DOCUMENT_LOCATION_ACCESS_DENIED",
            message: i18n.gettext("There is no access to document location {0}. Please check your profile privileges.")
        },
        {
            level: 1,
            code: "TIMEOFF_PLAN_WITH_THE_SAME_TIMEOFF_TYPE_ALREADY_EXISTS",
            message: i18n.gettext("Can't add '{0}' time off plan to employee. Only one time off plan of the same type can be assigned to employee.")
        },
        {
            level: 1,
            code: "SALARY_GRADE_RATES_ARE_NOT_VALID",
            message: i18n.gettext("Salary grade rates are invalid. Max rate must be greater than the Min rate.")
        },
        {
            level: 1,
            code: "GRADE_TYPE_SHOULD_BE_DEFINED_FOR_SALARY_GROUP",
            message: i18n.gettext("Grade type is not defined for the selected salary group.")
        },
        {
            level: 1,
            code: "PAYFREQUENCY_SHOULD_BE_DEFINED_FOR_SALARY_GROUP",
            message: i18n.gettext("Pay frequency is not defined for the selected salary group.")
        },
        {
            level: 1,
            code: "THE_SAME_TIMESHEET_TASK_DETAIL_ALREADY_EXISTS",
            message: i18n.gettext("The same timesheet task detail already exists. Start time - {0}, end time - {1}.")
        },
        {
            level: 1,
            code: "CURRENT_TIMESHEET_TASK_DETAIL_OVERLAPS_EXISTED_ONE",
            message: i18n.gettext("Can't update timesheet for detail - \"{0}\". Time range for the task detail ({1}-{2}) overlaps time of existing detail {3} ({4}-{5}).")
        },
        {
            level: 1,
            code: "CURRENT_TIME_PERIOD_WAS_REPORTED",
            message: i18n.gettext("Can't start timer. Current time overlaps time that has already been reported.")
        },
        {
            level: 1,
            code: "YOU_ARE_NOT_ABLE_TO_START_THE_TIMER",
            message: i18n.gettext("The timer cannot be started until {0}.")
        },
        {
            level: 1,
            code: "CANT_UPDATE_WORKFLOW_THAT_IS_CURRENTLY_USED",
            message: i18n.gettext("Can't update workflow. '{0}' workflow is currently in use.")
        },
        {
            level: 1,
            code: "ESCALATION_DAYS_IS_REQUIRED_FOR_WORKFLOW_WITH_ESCALATION_STEPS",
            message: i18n.gettext("Please, enter a positive number for the field \"Escalation Days\" as workflow contains escalation steps.")
        },
        {
            level: 1,
            code: "YOU_ARE_NOT_ABLE_TO_ADD_REGULAR_HOURS_MANUALLY",
            message: i18n.gettext("Manual entry is not allowed for timesheet ({0}).")
        },
        {
            level: 1,
            code: "EMPLOYEE_DOES_NOT_HAVE_ACTIVE_TIMESHEET",
            message: i18n.gettext("Can't accrue time off. Employee {0} doesn't have active timesheet.")
        },
        {
            level: 1,
            code: "UNABLE_TO_DELETE_EMPLOYEE_TIMEOFF_PLAN_WHICH_HAS_THE_APPROPRIATE_TIMEOFFS",
            message: i18n.gettext("Can't delete time off plan. There are employee time off records that reference this plan.")
        },
        {
            level: 1,
            code: "EMAIL_LAYOUT_DOESNT_EXIST",
            message: i18n.gettext("Email layout does not exist.")
        },
        {
            level: 1,
            code: "TIMEOFF_PLAN_NOT_FOUND_FOR_EMPLOYEE",
            message: i18n.gettext("Start time of day \"{0}\" is earlier than the start time of week \"{1}\".")
        },
        {
            level: 1,
            code: "WRONG_WORKFLOW_CONFIGURATION",
            message: i18n.gettext("Invalid workflow configuration. {0} workflows of type {1} are available to {2}. Only one workflow of the same type can be available for an employee.")
        },
        {
            level: 1,
            code: "EMPLOYEE_OPTION_WITH_OPTION_GROUP_NOT_FOUND",
            message: i18n.gettext("Employee option with option group {0} was not found.")
        },
        {
            level: 1,
            code: "EMPLOYEE_NO_WORK_GEOCODE",
            message: i18n.gettext("{0} doesn't have work geocode.")
        },
        {
            level: 1,
            code: "WORK_LOCATION_NO_GEOCODE",
            message: i18n.gettext("Work location {0} doesn't have geocode.")
        },
        {
            level: 1,
            code: "WORK_LOCATION_NO_STATE",
            message: i18n.gettext("Work location {0} doesn't have state.")
        },
        {
            level: 1,
            code: "EMPLOYEE_NO_RESIDENT_GEOCODE",
            message: i18n.gettext("{0} doesn't have resident geocode.")
        },
        {
            level: 1,
            code: "CUSTOM_LOCALIZATION_ALREADY_EXISTS",
            message: i18n.gettext("Can't add custom localization. Localization for this language and value already exists.")
        },
        {
            level: 1,
            code: "UNABLE_TO_DELETE_BREAK_WHICH_IS_USED_IN_TIMESHEETS",
            message: i18n.gettext("Can't remove {0} break from timesheet layout because this layout is already used in timesheets.")
        },
        {
            level: 1,
            code: "MIN_BREAK_TIME_VIOLATION",
            message: i18n.gettext("Can't stop break until {0:date('m/d/Y - h:i a')}. Minimum break time {1} hasn't passed. Break start time is {2}.")
        },
        {
            level: 1,
            code: "EMPLOYER_MATCH_FORMULA_IS_NOT_VALID",
            message: i18n.gettext("Employer match formula is not valid. Value: {0}.")
        },
        {
            level: 1,
            code: "DEFINE_TERMINATION_REASON",
            message: i18n.gettext("Termination reason is not defined.")
        },
        {
            level: 1,
            code: "MORE_THEN_ONE_OVERTIME_RULE_FOUND",
            message: i18n.gettext("More then one overtime rule is found for employee {0}.")
        },
        {
            level: 1,
            code: "OVERTIME_RULE_NOT_FOUND_FOR_EMPLOYEE",
            message: i18n.gettext("Employee {0} doesn't have overtime rules assigned.")
        },
        {
            level: 1,
            code: "CAN_NOT_UPDATE_SUBMITTED_TIME_OFF",
            message: i18n.gettext("Can't update time off. The time off has already been submitted.")
        },
        {
            level: 1,
            code: "CAN_NOT_DELETE_SUBMITTED_TIME_OFF",
            message: i18n.gettext("Can't delete time off. The time off has already been submitted.")
        },
        {
            level: 1,
            code: "CAN_NOT_UPDATE_TIME_OFF_DETAIL_FOR_CLOSED_EMPLOYEE_TIME_OFF_PLAN",
            message: i18n.gettext("Can't update time off. The employee time off plan has already been closed.")
        },
        {
            level: 1,
            code: "CAN_NOT_SAVE_TIME_OFF_DETAIL_FOR_CLOSED_EMPLOYEE_TIME_OFF_PLAN",
            message: i18n.gettext("Can't save time off detail. Employee time off plan has been closed.")
        },
        {
            level: 1,
            code: "BANK_ACCOUNT_TRANSFER_UNDEFINED",
            message: i18n.gettext("Bank account doesn't have file format defined.")
        },
        {
            level: 1,
            code: "ZEN_DESK_ACCOUNT_CREATE_FAILURE",
            message: i18n.gettext("Your online help account is not being created. Please try again later.")
        },
        {
            level: 1,
            code: "CONTACT_US_TITLE_IS_REQUIRED",
            message: i18n.gettext("\"Contact us\" title is required.")
        },
        {
            level: 1,
            code: "CONTACT_US_MESSAGE_IS_REQUIRED",
            message: i18n.gettext("\"Contact us\" message is required.")
        },
        {
            level: 1,
            code: "CAN_NOT_ADD_TIME_OFF_DETAIL_WRONG_STATUS",
            message: i18n.gettext("Can't add time off detail. Timesheet status should be REJECTED or NOT_SUBMITTED.")
        },
        {
            level: 1,
            code: "VERTICAL_TIMESHEET_VALUE_OUT_IS_NOT_SET",
            message: i18n.gettext("Can't submit timesheet. Please close all tasks and try to submit timesheet again.")
        },
        {
            level: 1,
            code: "UNABLE_TO_DELETE_SYSTEM_ADMINISTRATOR_PROFILE",
            message: i18n.gettext("Can't delete system administrator profile.")
        },
        {
            level: 1,
            code: "UNABLE_TO_CLONE_SYSTEM_ADMINISTRATOR_PROFILE",
            message: i18n.gettext("Can't clone system administrator profile.")
        },
        {
            level: 1,
            code: "SECURITY_PROFILE_IS_USED_BY_PERSONS",
            message: i18n.gettext("Can't remove profile. Profile is in use by one or several employees.")
        },
        {
            level: 1,
            code: "AT_LEAST_ONE_EMPLOYEE_GROUP_SHOULD_BE_SELECTED",
            message: i18n.gettext("At least one employee group should be selected.")
        },
        {
            level: 1,
            code: "TIMESHEET_START_CANT_BE_BEFORE_EMPLOYEE_HIRE_DATE",
            message: i18n.gettext("Can't create timesheet. The start date of the timesheet is earlier than your hire date.")
        },
        {
            level: 1,
            code: "HIRING_MANAGER_IS_NOT_ACCESSIBLE_TO_YOUR_USER",
            message: i18n.gettext("You can't access hiring manager. Please contact your system administrator.")
        },
        {
            level: 1,
            code: "SOME_EMPLOYEES_ARE_NOT_ACCESSIBLE_IN_SECURITY_PROFILE",
            message: i18n.gettext("Can't view pay processing. You don't have access to some of the employees in this pay batch.")
        },
        {
            level: 1,
            code: "BANK_ACCOUNT_DOES_NOT_HAVE_THE_CHECK_REPORT",
            message: i18n.gettext("Can't print check. Verify if employer bank account settings contain corresponding check template.")
        },
        {
            level: 1,
            code: "CANT_HIRE_ACTIVE_PRIMARY_WORK_LOCATION_NOT_SPECIFIED",
            message: i18n.gettext("Can't hire employee. Primary work location is not specified.")
        },
        {
            level: 1,
            code: "CANT_HIRE_MULTIPLE_ACTIVE_PRIMARY_WORK_LOCATIONS",
            message: i18n.gettext("Can't hire employee. There are multiple active primary work locations. Please specify one primary work location.")
        },
        {
            level: 1,
            code: "CANT_HIRE_CHECK_SECURITY_PROFILE",
            message: i18n.gettext("You can't create new employees. Check your security role privileges.")
        },
        {
            level: 1,
            code: "CANT_HIRE_EXISTING_CHECK_SECURITY_PROFILE",
            message: i18n.gettext("You can't create new employees based on existing person. Check your security role privileges.")
        },
        {
            level: 1,
            code: "CANT_RE_HIRE_CHECK_SECURITY_PROFILE",
            message: i18n.gettext("You can't rehire employees. Check your security role privileges.")
        },
        {
            level: 1,
            code: "CANT_TRANSFER_CHECK_SECURITY_PROFILE",
            message: i18n.gettext("You can't transfer employees. Check your security role privileges.")
        },
        {
            level: 1,
            code: "NO_ACCESS_TO_PAYROLL_BATCH",
            message: i18n.gettext("You don't have access to one or more employees in batch. Please verify your security role permissions.")
        },
        {
            level: 1,
            code: "INCOME_IS_USED_IN_TIMESHEET_LAYOUT_OR_BREAK",
            message: i18n.gettext("Can't update income. Income is used in timesheet layout or break configuration.")
        },
        {
            level: 1,
            code: "ASSIGNMENT_TERMINATION_WORKFLOW_ALREADY_EXISTS",
            message: i18n.gettext("Can't update assignment. Assignment termination workflow is in use.")
        },
        {
            level: 1,
            code: "CODE_TABLE_NAME_ALREADY_EXISTS",
            message: i18n.gettext("This code table name is already in use. Please provide another name.")
        },
        {
            level: 1,
            code: "CAN_NOT_PUBLISH_EMPLOYEE_REVIEW",
            message: i18n.gettext("Can't publish review without review date. Please set review date.")
        },
        {
            level: 1,
            code: "CAN_NOT_STOP_PUBLISHING_EMPLOYEE_REVIEW",
            message: i18n.gettext("Can't change review state. Review has been viewed by employee.")
        },
        {
            level: 1,
            code: "INACTIVE_CANDIDATE_STATUS_NOT_SPECIFIED",
            message: i18n.gettext("Inactive candidate status is not specified.")
        },
        {
            level: 1,
            code: "INACTIVE_CANDIDATE_ALREADY_ADDED",
            message: i18n.gettext("This candidate is already added but has \"Inactive\" status. Use \"Show Inactive\" option to display all candidates in the list.")
        },
        {
            level: 1,
            code: "MASS_REJECTION_TO_TEXT_UNDEFINED",
            message: i18n.gettext("\"To address\" for mass rejection in email layout is not specified.")
        },
        {
            level: 1,
            code: "PERSON_CONTACT_USED_IN_DEPENDENT_OR_BENEFICIARY",
            message: i18n.gettext("Can't delete this contact. Contact is used as dependent or beneficiary. Remove all the references to it first.")
        },
        {
            level: 1,
            code: "NO_ACCESS_TO_REQUIRED_CONTACT_FIELDS",
            message: i18n.gettext("Can't add or change the contact. You do not have access to required field. Please contact your administrator.")
        },
        {
            level: 1,
            code: "NO_ACCESS_TO_REQUIRED_ASSIGNMENT_FIELDS",
            message: i18n.gettext("You don't have access to required assignment fields. Please verify your security role permissions.")
        },
        {
            level: 1,
            code: "NO_ACCESS_TO_REQUIRED_ASSIGNMENT_DETAIL_FIELDS",
            message: i18n.gettext("You don't have access to required assignment detail fields. Please verify your security role permissions.")
        },
        {
            level: 1,
            code: "NO_ACCESS_TO_REQUIRED_EMPLOYEE_BENEFIT_FIELDS",
            message: i18n.gettext("You don't have access to required employee benefit fields. Please verify your security role permissions.")
        },
        {
            level: 1,
            code: "NO_ACCESS_TO_REQUIRED_EMPLOYEE_TAX_FIELDS",
            message: i18n.gettext("You don't have access to required employee tax fields. Please verify your security role permissions.")
        },
        {
            level: 1,
            code: "NO_ACCESS_TO_REQUIRED_PERSON_FIELDS",
            message: i18n.gettext("You don't have access to required person fields. Please verify your security role permissions.")
        },
        {
            level: 1,
            code: "NO_ACCESS_TO_REQUIRED_PERSON_ADDRESS_FIELDS",
            message: i18n.gettext("You don't have access to required person address fields. Please verify your security role permissions.")
        },
        {
            level: 1,
            code: "NO_ACCESS_TO_REQUIRED_PERSON_BANK_ACCOUNT_FIELDS",
            message: i18n.gettext("You don't have access to required person bank account fields. Please verify your security role permissions.")
        },
        {
            level: 1,
            code: "NO_ACCESS_TO_EMPLOYEE_DOCUMENT",
            message: i18n.gettext("You can't see documents of other employees. Check your security role privileges.")
        },
        {
            level: 1,
            code: "NO_ACCESS_TO_EMPLOYEE_ONBOARDING",
            message: i18n.gettext("You can't see onboarding of other employees. Check your security role privileges.")
        },
        {
            level: 1,
            code: "NO_ACCESS_TO_EMPLOYER_DOCUMENT",
            message: i18n.gettext("You can't see documents of other employees. Check your security role privileges.")
        },
        {
            level: 1,
            code: "NO_ACCESS_TO_CANDIDATE_DOCUMENT",
            message: i18n.gettext("You can't see selected candidate document. Check your security role privileges.")
        },
        {
            level: 1,
            code: "NO_ACCESS_TO_REQUIRED_EMPLOYER_POSITION_FIELDS",
            message: i18n.gettext("You don't have access to required employer position fields. Please verify your security role permissions.")
        },
        {
            level: 1,
            code: "THIS_ASSIGNMENT_HAS_BEEN_DELETED",
            message: i18n.gettext("Can't access assignment. This assignment has been removed.")
        },
        {
            level: 1,
            code: "JOB_APPLICATION_REPORT_IS_NOT_SET",
            message: i18n.gettext("Can't download report. Report is not configured in the Employer settings.")
        },
        {
            level: 1,
            code: "NO_ACCESS_TO_SUBMIT_WORKFLOW_ENTITY",
            message: i18n.gettext("You can't submit workflow changes. Check your security role privileges.")
        },
        {
            level: 1,
            code: "NO_ACCESS_TO_REJECT_WORKFLOW_ENTITY",
            message: i18n.gettext("You can't reject workflow changes. Check your security role privileges.")
        },
        {
            level: 1,
            code: "UNABLE_TO_DELETE_NON_COMPLETED_OPEN_ENROLLMENT",
            message: i18n.gettext("Can't delete open enrollment. One or more employee open enrollments have not been approved yet.")
        },
        {
            level: 1,
            code: "NOT_ALLOWED_TO_CHANGE_CUSTOM_FIELD_FOR_USED_TIMESHEET_LAYOUT",
            message: i18n.gettext("Can't update custom field. Timesheet layout is in use.")
        },
        {
            level: 1,
            code: "TEAM_PUNCH_DATE_SHOULD_BE_BETWEEN_START_AND_END_DATES",
            message: i18n.gettext("Team punch date doesn't fall into timesheet date range.")
        },
        {
            level: 1,
            code: "NATIONAL_IDENTIFIER_ALREADY_EXIST",
            message: i18n.gettext("Can't save profile. Provided national identifier already exists.")
        },
        {
            level: 1,
            code: "AT_LEAST_ONE_ACCESS_LEVEL_MUST_EXIST_FOR_SECURITY_PROFILE",
            message: i18n.gettext("Can't update security profile. Access level should be specified.")
        },
        {
            level: 1,
            code: "INVALID_EMPLOYEE_BENEFIT_BENEFICIARY",
            message: i18n.gettext("Total percentage for both primary and contingent beneficiaries should be 100%. Contingent beneficiaries can be added only after primary.")
        },
        {
            level: 1,
            code: "QUALIFICATION_IS_USED_IN_DETAILS",
            message: i18n.gettext("Can't delete qualification because it is used in qualification set. Remove all references to it and try again.")
        },
        {
            level: 1,
            code: "QUALIFICATION_SET_IS_USED_IN_JOB_POSTING",
            message: i18n.gettext("Can't remove qualification set because it is used in job posting. Remove all references to it and try again.")
        },
        {
            level: 1,
            code: "NOT_ALLOWED_TO_DELETE_EMPLOYEE_PRIMARY_WORK_LOCATION",
            message: i18n.gettext("Employee primary work location cannot be empty. Please specify at least one location.")
        },
        {
            level: 1,
            code: "EMPLOYEE_CAN_NOT_HAVE_SEVERAL_PRIMARY_WORK_LOCATIONS",
            message: i18n.gettext("Employee can have only one primary location.")
        },
        {
            level: 1,
            code: "EMPLOYEE_IS_NOT_ACCESSIBLE_IN_SECURITY_PROFILE",
            message: i18n.gettext("You don't have access to this employee. Please verify your security role permissions.")
        },
        {
            level: 1,
            code: "UNABLE_TO_CHANGE_REVIEW_COMPETENCY_DETAIL_THAT_IS_USED_IN_WORKFLOW",
            message: i18n.gettext("Can't change review competency detail. Competency detail is used in employee review workflow.")
        },
        {
            level: 1,
            code: "CANDIDATE_EDUCATION_DATE_TO_CAN_NOT_BE_EARLIER_THAN_FROM",
            message: i18n.gettext("Education \"Date to\" cannot be earlier than \"Date From\".")
        },
        {
            level: 1,
            code: "BATCH_WITH_SUCH_NAME_ALREADY_EXISTS",
            message: i18n.gettext("Cannot add batch. Batch with such name already exists.")
        },
        {
            level: 1,
            code: "UNABLE_TO_DEACTIVATE_UNTIL_UNFINISHED_REVIEWS_EXISTS",
            message: i18n.gettext("Can't modify review template. Review template is used in workflow.")
        },
        {
            level: 1,
            code: "UNABLE_TO_CHANGE_REVIEW_DETAILS_UNTIL_UNFINISHED_REVIEW_EXISTS",
            message: i18n.gettext("Can't modify review template details. Review template is used in workflow.")
        },
        {
            level: 1,
            code: "REVIEW_TEMPLATE_TOTAL_SHOULD_EQUAL_ONE",
            message: i18n.gettext("Total weight for groups should be 100%")
        },
        {
            level: 1,
            code: "SIGNATURE_IS_REQUIRED_BY_WORKFLOW",
            message: i18n.gettext("Signature is required by workflow.")
        },
        {
            level: 1,
            code: "INCORRECT_COMPANY_IDENTIFIER_LENGTH",
            message: i18n.gettext("Incorrect company identifier length. It should be less than 20 symbols.")
        },
        {
            level: 1,
            code: "COMPANY_IDENTIFIER_MUST_BE_DEFINED",
            message: i18n.gettext("Incorrect company identifier. It should be defined in employer bank account.")
        },
        {
            level: 1,
            code: "ERROR_READING_IMPORT_FILE",
            message: i18n.gettext("Failed to load import file. File format is incorrect.")
        },
        {
            level: 1,
            code: "ASSIGNMENT_EXPIRATION_DATE_SHOULD_BE_BEFORE_OR_EQUAL_TO_EMPLOYEE_TERMINATION_DATE",
            message: i18n.gettext("Assignment expiration date can't be after employee termination.")
        },
        {
            level: 1,
            code: "CANT_EDIT_EXPIRATION_DATE_FOR_LAST_ASSIGNMENT_DETAIL",
            message: i18n.gettext("Can't edit expiration date for last assignment detail. This assignment is still active.")
        },
        {
            level: 1,
            code: "EMPLOYER_NAME_DOES_NOT_MATCH_EMPLOYER_LEGAL_NAME",
            message: i18n.gettext("Provided employer name does not match employer's legal name.")
        },
        {
            level: 1,
            code: "CAN_NOT_EDIT_INACTIVE_EMPLOYER",
            message: i18n.gettext("This employer is inactive. You cannot modify profiles of inactive employers.")
        },
        {
            level: 1,
            code: "SHIFT_RATE_DETAIL_OVERLAPS_EXISTING_ONE",
            message: i18n.gettext("Time range for the shift rate detail overlaps time of existing detail.")
        },
        {
            level: 1,
            code: "FIRST_AND_LAST_PAYROLL_PERIODS_SHOULD_RELATE_TO_SAME_SCHEDULE",
            message: i18n.gettext("First and final payroll periods from certified rate should be linked to the same payroll schedule.")
        },
        {
            level: 1,
            code: "TIMESHEET_TASK_DETAIL_CANT_BE_OUT_OF_ASSIGNMENT_RANGE",
            message: i18n.gettext("Timesheet task detail can't be out of assignment range.")
        },
        {
            level: 1,
            code: "LEARNING_INCORRECT_PIN",
            message: i18n.gettext("Wrong PIN.")
        },
        {
            level: 1,
            code: "EMPLOYEE_COURSE_ACCESS_DENIED",
            message: i18n.gettext("You don't have access to this course. Please verify your security role permissions.")
        },
        {
            level: 1,
            code: "EMPLOYEE_COURSE_MAX_ENROLLMENT_LIMIT_REACHED",
            message: i18n.gettext("Employee course max enrollment limit reached.")
        },
        {
            level: 1,
            code: "EMPLOYEE_CLASS_MAX_ENROLLMENT_LIMIT_REACHED",
            message: i18n.gettext("Employee class max enrollment limit reached.")
        },
        {
            level: 1,
            code: "CODE_FOR_TE_INCOME_IS_OUT_OF_ALLOWED_RANGE",
            message: i18n.gettext("Code for Te Income if out of allowed range.")
        },
        {
            level: 1,
            code: "CANT_ADD_SYSTEM_TE_INCOME",
            message: i18n.gettext("It's not allowed to add system Te Income.")
        },
        {
            level: 1,
            code: "CANT_ADD_SYSTEM_TE_DEDUCTION",
            message: i18n.gettext("It's not allowed to add system Te Deduction.")
        },
        {
            level: 1,
            code: "REGULAR_CODE_FOR_TE_DEDUCTION_IS_OUT_OF_ALLOWED_RANGE",
            message: i18n.gettext("Regular code for Te Deduction is out of allowed range.")
        },
        {
            level: 1,
            code: "SUPPLEMENTAL_CODE_FOR_TE_DEDUCTION_IS_OUT_OF_ALLOWED_RANGE",
            message: i18n.gettext("Supplemental code for Te Deduction is out of allowed range.")
        },
        {
            level: 1,
            code: "CANT_ADD_TIMEOFF_FOR_INACTIVE_EMPLOYEE",
            message: i18n.gettext("Can't add TIME OFF for inactive employee.")
        },
        {
            level: 1,
            code: "NO_SUITABLE_START_DATE",
            message: i18n.gettext("Cannot find suitable start date in 'Start Day Custom List'.")
        },
        {
            level: 1,
            code: "NO_SUITABLE_END_DATE",
            message: i18n.gettext("Cannot find suitable end date in 'Start Day Custom List'.")
        },
        {
            level: 1,
            code: "CANT_SAVE_SHAPE_WITH_EMPTY_DATA_FIELD",
            message: i18n.gettext("It's not allowed to save a shape with empty data fields.")
        },
        {
            level: 1,
            code: "DATA_FIELD_IS_NOT_VALID_JSON",
            message: i18n.gettext("Data field is not a valid JSON.")
        },
        {
            level: 1,
            code: "CANNOT_ACTIVATE_PLAN_WHEN_NEWER_EXISTS",
            message: i18n.gettext("Cannot activate the plan, newer plan is added.")
        },
        {
            level: 1,
            code: "INCORRECT_TIME_OFF_START_DATE",
            message: i18n.gettext("Incorrect date format. Start Date must be valid and not empty.")
        },
        {
            level: 1,
            code: "TIME_OFF_TIME_OVERLAPS_HOLIDAY",
            message: i18n.gettext("Can't add time off. It overlaps holiday.")
        },
        {
            level: 1,
            code: "EMPLOYEE_TASK_ZERO_ALLOCATION",
            message: i18n.gettext("Auto-allocated tasks must have allocation > 0")
        },
        {
            level: 1,
            code: "TIME_OFF_PLAN_ACCRUAL_DATE_IS_OUT_OF_PERIOD",
            message: i18n.gettext("Time off plan accrual date is out of plan period.")
        },
        {
            level: 1,
            code: "DATAGRID_TABLES_CONNECTION_NOT_EXISTS",
            message: i18n.gettext("Make sure that the tables you select have links and try again.")
        },
        {
            level: 1,
            code: "NEGATIVE_CAFE_CREDIT",
            message: i18n.gettext("Cafe credit must be >= 0.")
        },
        {
            level: 1,
            code: "BACKGROUND_VERIFICATION_REPORT_NOT_READY",
            message: i18n.gettext("Background verification report is not ready.")
        },
        {
            level: 1,
            code: "APPLICATION_COULD_NOT_BE_UNDEPLOYED",
            message: i18n.gettext("Can't undeploy Application.")
        },
        {
            level: 1,
            code: "MAX_FILE_SIZE_EXCEEDED",
            message: i18n.gettext("The file is too large and cannot be uploaded. Please provide file up to {0} bytes.")
        },
        {
            level: 1,
            code: "MAX_REQUEST_SIZE_EXCEEDED",
            message: i18n.gettext("The request is too large and cannot be processed. Please reduce request size.")
        },
        {
            level: 1,
            code: "YOU_ARE_NOT_ABLE_TO_CREATE_TIMESHEET_TASK_WITH_INACTIVE_INCOME",
            message: i18n.gettext("Can't create a timesheet task with inactive income as paycode for date {0:date}.")
        },
        {
            level: 1,
            code: "TIMESHEET_HAS_STARTED_TASK",
            message: i18n.gettext("Can't submit timesheet. Task {0} has been started. Please stop timer and try to submit timesheet again.")
        },
        {
            level: 1,
            code: "ACCRUAL_DATE_IS_LATER_OR_EQUAL_TIME_OFF_DATE",
            message: i18n.gettext("Can't submit timesheet. Task {0} has been started. Please stop timer and try to submit timesheet again.")
        },
        {
            level: 1,
            code: "INCOME_IS_USED_IN_OVERTIME_RULE",
            message: i18n.gettext("Can't use {0} income in timesheet layout because it is already used in overtime rules.")
        },
        {
            level: 1,
            code: "INCOME_IS_USED_IN_TIMESHEET_LAYOUT",
            message: i18n.gettext("Can't use {0} income in overtime rules because it is already used in timesheet layout.")
        },
        {
            level: 1,
            code: "REPORTING_RELATIONSHIP_ALREADY_INCLUDES_THIS_EMPLOYEE",
            message: i18n.gettext("Can't add employee {0}. Reporting relationship already includes this employee.")
        },
        {
            level: 1,
            code: "ORG_EMPLOYEE_ALREADY_INCLUDES_THIS_EMPLOYEE",
            message: i18n.gettext("Can't add employee {0}. Reporting relationship already includes this employee in org structure {1}.")
        },
        {
            level: 1,
            code: "ORG_POSITION_ALREADY_INCLUDES_THIS_POSITION",
            message: i18n.gettext("Can't add position {0}. Reporting relationship already includes this position in org structure {1}.")
        },
        {
            level: 1,
            code: "OPEN_ENROLLMENT_STEP_HAVE_USAGES_CANT_MODIFY",
            message: i18n.gettext("Can't delete plan from open enrollment '{0}' step. It is already in use.")
        },
        {
            level: 1,
            code: "OPEN_ENROLLMENT_STEP_HAVE_USAGES_CANT_DELETE",
            message: i18n.gettext("Can't delete open enrollment {0} step. It is already in use.")
        },
        {
            level: 1,
            code: "NEW_EMPLOYEE_INCOME_OVERLAPS_THE_EXISTING_ONE",
            message: i18n.gettext("New employee income date ({0}) overlaps the existing date ({1}).")
        },
        {
            level: 1,
            code: "TOTAL_REQUESTED_TIMEOFF_HOURS_EXCEEDS_EMPLOYEE_AVERAGE_HOURS",
            message: i18n.gettext("Total requested time off hours {0} exceeds employee time off average hours {1}.")
        },
        {
            level: 1,
            code: "TIME_OFF_DETAIL_OVERLAPS_EXISTING_ONE",
            message: i18n.gettext("Can't add '{0}' time off for {1:date}. This time off overlaps '{2}' time off for {3:date}.")
        },
        {
            level: 1,
            code: "INVALID_TIME_OFF_DURATION",
            message: i18n.gettext("Time off duration ({0}) is longer than the rest of the day.")
        },
        {
            level: 1,
            code: "EMPLOYER_TIME_OFF_PLAN_EXPRESSION_ERROR",
            message: i18n.gettext("Can't process accrual formula. The following character is not supported - '{0}'.")
        },
        {
            level: 1,
            code: "COMPLETE_PAYROLL_BATCH_BEFORE_CALCULATION",
            message: i18n.gettext("Payroll batch {0} should be completed before calculation.")
        },
        {
            level: 1,
            code: "INVALID_DYNAMIC_EMPLOYEE_GROUP_FORMULA",
            message: i18n.gettext("Can't process dynamic employee group formula. Formula syntax is not valid.")
        },
        {
            level: 1,
            code: "EMAIL_RECIPIENTS_LIMIT_EXCEEDED",
            message: i18n.gettext("Email recipients limit is exceeded. You cannot mass reject more than {0} candidates per request.")
        },
        {
            level: 1,
            code: "YOU_ARE_NOT_ABLE_TO_ADD_TIMEOFF_FOR_CLOSED_PLAN_PERIOD",
            message: i18n.gettext("It's not allowed to add time off for closed plan period. Period start - {0:date}, period end - {1:date}.")
        },
        {
            level: 1,
            code: "EXPRESSION_TOKEN_NOT_FOUND",
            message: i18n.gettext("Formula contains invalid expression. {0} token is not supported.")
        },
        {
            level: 1,
            code: "BENEFIT_PLAN_EXPRESSION_TOKEN_NOT_FOUND",
            message: i18n.gettext("{1} benefit plan contains invalid expression. {0} token is not supported.")
        },
        {
            level: 1,
            code: "INVALID_MONTHLY_YEAR_END_CONFIGURATION",
            message: i18n.gettext("Can't save monthly time off plan. Year End date should fall to day preceding the first day of period, which is {2}. Provided Year End date - ({0}) falls to {1}.")
        },
        {
            level: 1,
            code: "INVALID_SEMI_MONTHLY_YEAR_END_CONFIGURATION",
            message: i18n.gettext("Can't save semi-monthly time off plan. Year End date should fall to day preceding the first day of period, which is {2}. Provided Year End date - ({0}) falls to {1}.")
        },
        {
            level: 1,
            code: "INVALID_ANNUAL_YEAR_END_CONFIGURATION",
            message: i18n.gettext("Can't save annual time off plan. Year End date should fall to day preceding the first day of period, which is {2}. Provided Year End date - ({0}) falls to {1}.")
        },
        {
            level: 1,
            code: "EXPRESSION_EXECUTION_ERROR",
            message: i18n.gettext("Can't execute the following formula: {0}.")
        },
        {
            level: 1,
            code: "START_TIME_IS_NOT_BEFORE_START_TIME_OF_DAY",
            message: i18n.gettext("Start time can't be earlier than the start of the day.")
        },
        {
            level: 1,
            code: "WORK_PERIOD_GRACE_INVALID_VALUE",
            message: i18n.gettext("Work period grace {0} can not be greater than {1}.")
        },
        {
            level: 1,
            code: "WORK_PERIOD_EXCEPTION_INVALID_SCHEDULE",
            message: i18n.gettext("Scheduled start {0:date} can't be later than scheduled end {1:date}.")
        },
        {
            level: 1,
            code: "WORK_PERIOD_DETAIL_INVALID_SCHEDULE",
            message: i18n.gettext("Work period detail for {0} is incorrect. Scheduled start {1:date} can't be later than scheduled end {2:date}")
        },
        {
            level: 1,
            code: "EMPLOYER_DOES_NOT_HAVE_THE_PAYROLL_SETTINGS",
            message: i18n.gettext("Payroll settings are not configured for employer \"{0}\"")
        },
        {
            level: 1,
            code: "END_TIME_IS_OUT_OF_DATE_RANGE",
            message: i18n.gettext("End time doesn't fall into timesheet date range ({0} - {1}).")
        },
        {
            level: 1,
            code: "PUNCHING_DATE_IS_OUT_OF_EMPLOYEE_PUNCH_DATE_RANGE",
            message: i18n.gettext("Can't punch time for the following employee: {0}. Time - ({1}) is out of employee time range.")
        },
        {
            level: 1,
            code: "PUNCHING_START_TIME_IS_BEFORE_START_TIME_OF_DAY",
            message: i18n.gettext("Punch time - {0:date('m/d/Y g:i A')} is earlier than start of day.")
        },
        {
            level: 1,
            code: "CUSTOM_FIELD_WITH_THIS_CODE_ALREADY_EXISTS",
            message: i18n.gettext("Custom field for {0} with code {1} already exists with the following label: {2}.")
        },
        {
            level: 1,
            code: "PUBLISH_SITE_SETTING_WIDTH_IS_MORE_THAN_ALLOWED_MAX",
            message: i18n.gettext("Maximum width for the site cannot exceed {0}.")
        },
        {
            level: 1,
            code: "BENEFIT_PLAN_EXPRESSION_EXECUTION_ERROR",
            message: i18n.gettext("Can't execute {1} benefit plan. The following expression is invalid: {0}.")
        },
        {
            level: 1,
            code: "EXCEL_SHEET_NOT_FOUND",
            message: i18n.gettext("The following sheet could not be found: {0}.")
        },
        {
            level: 1,
            code: "EXCEL_HEADER_COLUMN_NOT_FOUND",
            message: i18n.gettext("Wrong file format. Header column \"{0}\" could not be found.")
        },
        {
            level: 1,
            code: "EXCEL_HEADER_NOT_FOUND",
            message: i18n.gettext("Wrong file format. Header row could not be found.")
        },
        {
            level: 1,
            code: "WORK_LOCATION_STATE_MUST_BE_NON_EMPTY",
            message: i18n.gettext("Cannot export payroll for {0}. Employee doesn't have work location assigned.")
        },
        {
            level: 1,
            code: "PERSON_ADDRESS_STATE_MUST_BE_NON_EMPTY",
            message: i18n.gettext("Cannot export payroll for {0}. Employee address is not provided.")
        },
        {
            level: 1,
            code: "REVIEW_PERIOD_START_FORMULA_NOT_VALID",
            message: i18n.gettext("Incorrect formula. Review period start formula is not valid.")
        },
        {
            level: 1,
            code: "REVIEW_PERIOD_DATE_FORMULA_NOT_VALID",
            message: i18n.gettext("Incorrect formula. Review period date formula is not valid.")
        },
        {
            level: 1,
            code: "REVIEW_PERIOD_DEADLINE_FORMULA_NOT_VALID",
            message: i18n.gettext("Incorrect formula. Review period deadline formula is not valid.")
        },
        {
            level: 1,
            code: "UNABLE_TO_CALCULATE_PAYROLL_FOR_EMPLOYEE",
            message: i18n.gettext("Cannot calculate payroll. Employee {0} didn't have any assignments in this period.")
        },
        {
            level: 1,
            code: "NOT_FOUND_PRIMARY_ASSIGNMENT_FOR_PERIOD",
            message: i18n.gettext("Employee {0} didn't have primary assignment in the batch period.")
        },
        {
            level: 1,
            code: "MAX_PER_REQUEST_LIMIT_EXCEEDED",
            message: i18n.gettext("Time limit per one request is exceeded! See current Time Off Plan / Maximum per Request.")
        },
        {
            level: 1,
            code: "CALCULATION_DATE_SHOULD_BE_IN_BENEFIT_PLAN_RANGE",
            message: i18n.gettext("Cannot calculate benefit plan. Calculation date {0:date} is not in benefit plan range ({1:date}-{2:date}).")
        },
        {
            level: 1,
            code: "EXPIRATION_DATE_CANT_BE_LESS_THAN_EFFECTIVE_DATE",
            message: i18n.gettext("Expiration date ({1:date}) is earlier than effective date ({0:date}).")
        },
        {
            level: 1,
            code: "UNABLE_TO_DELETE_FILLED_CANDIDATE_FORM",
            message: i18n.gettext("Can't delete form: \"{0}\". Form has been filled by candidate.")
        },
        {
            level: 1,
            code: "NO_BANK_ACCOUNT_IS_SET_FOR_EMPLOYEE",
            message: i18n.gettext("Bank account is not set up correctly for {0} {1}")
        },
        {
            level: 1,
            code: "INCORRECT_DEPOSIT_ORDER_VALUE_RANGE",
            message: i18n.gettext("Can't save bank account details. Deposit order should be in range of {0}-{1}.")
        },
        {
            level: 1,
            code: "INCORRECT_DEPOSIT_ORDER_VALUE",
            message: i18n.gettext("Can't save bank account details. Check if deposit order is unique and balance entry has highest deposit order.")
        },
        {
            level: 1,
            code: "INCORRECT_BANK_ACCOUNT_VALUE",
            message: i18n.gettext("Can't save bank account details. Amount {0} cannot exceed 100 when deposit type is \"Percent\".")
        },
        {
            level: 1,
            code: "INCORRECT_BENEFIT_EFFECTIVE_DATE",
            message: i18n.gettext("Can't update benefit plan. Effective date ({0:date}) must be greater or equal to the hire date ({1:date}).")
        },
        {
            level: 1,
            code: "TIME_CLOCK_NOT_FOUND",
            message: i18n.gettext("Can't find {0} time clock with authentication token {1}.")
        },
        {
            level: 1,
            code: "TRANSFORMATION_SHOULD_BE_SET_FOR_GL_SETUP",
            message: i18n.gettext("Transformation should be set for gl setup {0}.")
        },
        {
            level: 1,
            code: "TEST_EMAIL_ADDRESS_IS_NOT_SET_FOR_EMPLOYER",
            message: i18n.gettext("Test email address is not set for \"{0}\" employer.")
        },
        {
            level: 1,
            code: "NOT_FOUND_EMPLOYEE_ON_SHEET",
            message: i18n.gettext("Can't find employee on sheet {0}, row number {1}.")
        },
        {
            level: 1,
            code: "EMPLOYER_TAX_WITH_SAME_CODE_AND_EFFECTIVE_DATE_ALREADY_EXIST",
            message: i18n.gettext("Can't add tax. Employer tax with the same code and effective date already exists.")
        },
        {
            level: 1,
            code: "EMPLOYEE_TERMINATION_DATE_CANT_BE_BEFORE_HIRE_DATE",
            message: i18n.gettext("Employee termination date cannot be earlier than hire date.")
        },
        {
            level: 1,
            code: "NOT_FOUND_PLAN_PERIOD_FOR_TIME_OFF_DATE",
            message: i18n.gettext("Plan period for the date of {0} and plan name {1} is not found.")
        },
        {
            level: 1,
            code: "INVALID_GL_ACCOUNT_MAP",
            message: i18n.gettext("Invalid GL account map for {0}.")
        },
        {
            level: 1,
            code: "PAYROLL_PROCESSING_ISSUE",
            message: i18n.gettext("An issue appeared during payroll processing.<br/>{0}")
        },
        {
            level: 1,
            code: "CAN_NOT_PROCESS_PAYROLL_INCOME_ON_GL_EXPORT",
            message: i18n.gettext("Can't process payroll income on gl export for employee {0}, income {1}.")
        },
        {
            level: 1,
            code: "CAN_NOT_MAP_CUSTOM_VALUE_BY_CODE_TABLE_DETAIL_CODE",
            message: i18n.gettext("Can't map custom value by code table detail code. Code table name - \"{0}\", code table detail code - \"{1}\"")
        },
        {
            level: 1,
            code: "PERSON_DOES_NOT_HAVE_DATE_OF_BIRTH",
            message: i18n.gettext("Employee {0} doesn't have birth date specified.")
        },
        {
            level: 1,
            code: "PERSON_DOES_NOT_HAVE_GENDER_SET",
            message: i18n.gettext("Employee {0} doesn't have gender specified.")
        },
        {
            level: 1,
            code: "BENEFIT_BENEFICIARIES_EFFECTIVE_DATE_ERROR",
            message: i18n.gettext("Benefit beneficiary effective date {0:date} can't be before employee's hire date {1:date}.")
        },
        {
            level: 1,
            code: "BENEFIT_DEPENDENTS_EFFECTIVE_DATE_ERROR",
            message: i18n.gettext("Benefit dependent effective date {0:date} can't be before employee's hire date {1:date}.")
        },
        {
            level: 1,
            code: "EMPLOYEE_GARNISHMENT_INCORRECT_FORMULA",
            message: i18n.gettext("Can't calculate garnishment formula \"{1}\" for employee deduction \"{0}\"")
        },
        {
            level: 1,
            code: "WRONG_CUSTOM_DATE_FORMAT",
            message: i18n.gettext("{0} in 'Start Day Custom List' has wrong format. Expected {1}.")
        },
        {
            level: 1,
            code: "END_DATE_BEFORE_START_DATE",
            message: i18n.gettext("The plan's end date {0:date} is before start date {1:date}.")
        },
        {
            level: 1,
            code: "PREVIOUS_PLAN_ENDS_AFTER_NEW_START_DATE",
            message: i18n.gettext("Previous plan's end date {0:date} is after new plan's start date {1:date}.")
        },
        {
            level: 1,
            code: "NEW_PLAN_START_DATE_MUST_BE_AFTER_PREVIOUS_START_DATE",
            message: i18n.gettext("The new plan's start date {1:date} must be after the previous plan's start date {0:date}.")
        },
        {
            level: 1,
            code: "TIME_OFF_BEFORE_NEW_START_DATE",
            message: i18n.gettext("Start date {1:date} cannot be after time off date {0:date}.")
        },
        {
            level: 1,
            code: "TIME_OFF_AFTER_NEW_END_DATE",
            message: i18n.gettext("Active Time Offs exist after End Date {0:date}.")
        },
        {
            level: 1,
            code: "NEXT_PERIOD_STARTS_BEFORE_NEW_END_DATE",
            message: i18n.gettext("Start date {1:date} must be after previous period's end date {0:date}.")
        },
        {
            level: 1,
            code: "CANT_GENERATE_PERIOD_NUMBERS",
            message: i18n.gettext("Can't generate period numbers \"{0}\" for a pay frequency \"{1}\".")
        },
        {
            level: 1,
            code: "ORG_STRUCTURE_NOT_NULL_BUT_ORG_LINEAGE_IS_NULL",
            message: i18n.gettext("Field Org{0}_Structure is not null but Org{0}_Lineage is null")
        },
        {
            level: 1,
            code: "EMPLOYEE_SHOULD_HAVE_ACTIVE_BENEFITS_FOR_SELECTED_PERIOD",
            message: i18n.gettext("Employee {0} should have active benefit for selected period.")
        },
        {
            level: 1,
            code: "APPLICATION_ENDPOINT_ALREADY_EXISTS",
            message: i18n.gettext("Application endpoint already exists")
        },
        {
            level: 1,
            code: "REPORT_GENERATION_IS_IN_PROGRESS_STATE",
            message: i18n.gettext("Report \"{0}\" generation is in progress state.")
        },
        {
            level: 1,
            code: "QUESTION_ALREADY_ADDED_WITH_SUBSET",
            message: i18n.gettext("Question {0} is already added with subset.")
        },
        {
            level: 1,
            code: "TOO_MANY_BASE_RATE_DETAILS",
            message: i18n.gettext("Only one Certified Rate Detail with type Base is allowed. Position code: {0}")
        },
        {
            level: 1,
            code: "TOO_MANY_HOURS_PER_DAY",
            message: i18n.gettext("Total hours on day ({0}) can't be more than 24h.")
        },
        {
            level: 1,
            code: "DYNAMIC_GROUP_IS_IN_PROGRESS_STATE",
            message: i18n.gettext("Dynamic group recalculation is in progress state.")
        },
        {
            level: 1,
            code: "FORMULA_RESULT_TYPE_MAPPING_ERROR",
            message: i18n.gettext("Type cast error in formula: \"{0}\".<br>Expected type is \"{2}\" but get \"{1}\" in \"{3}\" benefit plan.")
        },
        {
            level: 1,
            code: "PAYROLL_IMPORT_ERROR_CAN_NOT_EXTRACT_VALUE",
            message: i18n.gettext("Can't extract value on row number: {0}, column number: {1} (column name \"{2}\").")
        },
        {
            level: 1,
            code: "CUSTOM_FIELD_VALUE_REQUIRED",
            message: i18n.gettext("Custom Value \"{0}\" should be specified.")
        },
        {
            level: 1,
            code: "JSON_PROPERTY_NOT_FOUND",
            message: i18n.gettext("Json property {0} was not found.")
        },
        {
            level: 1,
            code: "JSON_PROPERTY_IS_NULL",
            message: i18n.gettext("Json property {0} is null.")
        },
        {
            level: 1,
            code: "JSON_PROPERTY_IS_REQUIRED",
            message: i18n.gettext("Json property {0} is required.")
        },
        {
            level: 1,
            code: "INCORRECT_FIELD_TYPE",
            message: i18n.gettext("Can't process imported file. Incorrect data format. Field '{0}' should be of type '{1}'.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_FIELD_TYPE",
            message: i18n.gettext("Can't process imported file. Field type '{0}' is not supported and cannot be mapped to property '{1}'.")
        },
        {
            level: 1,
            code: "REQUIRED_FIELD_NOT_FOUND",
            message: i18n.gettext("Can't process imported file. Required field '{0}' was not found in the imported file.")
        },
        {
            level: 1,
            code: "PENTAHO_FAILED_QUERY",
            message: i18n.gettext("Error executing query inside of report.")
        },
        {
            level: 1,
            code: "SSN_IS_REQURED_FIELD",
            message: i18n.gettext("Social security number is required field.")
        },
        {
            level: 1,
            code: "DOB_IS_REQURED_FIELD",
            message: i18n.gettext("Date of birth is required field.")
        },
        {
            level: 1,
            code: "DEFAULT_CANDIDATE_STATUS_IS_NOT_SET",
            message: i18n.gettext("Can't add candidate. Candidate's default status is not set in Candidate Status user code table.")
        },
        {
            level: 1,
            code: "EMPLOYMENT_APPLICATION_WEBFORM_IS_NOT_SET",
            message: i18n.gettext("Employment application web form is not set.")
        },
        {
            level: 1,
            code: "EXTERNAL_SYSTEM_TAZWORKS_NOT_CONFIGURED",
            message: i18n.gettext("External system TazWorks is not configured.")
        },
        {
            level: 1,
            code: "DIF_EMPLOYEE_WAS_NOT_FOUND",
            message: i18n.gettext("No employee found. Employee - {0} with payroll number {1} was not found.")
        },
        {
            level: 1,
            code: "WRONG_EMPLOYEE_TIMESHEET_TYPE_CONFIGURATION",
            message: i18n.gettext("Wrong timesheet layout configuration. {1} timesheet types are available to employee ({0}). Only one timesheet layout should be available for an employee.")
        },
        {
            level: 1,
            code: "EMPLOYER_AMOUNT_INCORRECT_FORMULA",
            message: i18n.gettext("Incorrect formula. Employer amount formula \"{1}\" is not valid in deduction \"{0}\".")
        },
        {
            level: 1,
            code: "INCOME_NO_GEOCODE",
            message: i18n.gettext("Work location {0} doesn't have geocode.")
        },
        {
            level: 1,
            code: "ADFS_CLIENT_ID_IS_NOT_SET_FOR_TENANT",
            message: i18n.gettext("ADFS client id is not set for tenant.")
        },
        {
            level: 1,
            code: "AT_LEAST_ONE_PHONE_MUST_EXIST_FOR_EMERGENCY_CONTACT",
            message: i18n.gettext("At list one phone number should exist for emergency contact.")
        },
        {
            level: 1,
            code: "EMPLOYEE_CLASS_INSTRUCTOR_MUST_BE_SET",
            message: i18n.gettext("Instructor must be set for Course Class \"{0}\".")
        },
        {
            level: 1,
            code: "TIME_OFF_TYPES_ALREADY_USED_IN_WORKFLOW",
            message: i18n.gettext("Time Off Type(s) \"{0}\" already used in \"{1}\".")
        },
        {
            level: 1,
            code: "EMPLOYEE_ASSIGNMENT_DETAIL_OVERLAPS_EXISTING_ONE",
            message: i18n.gettext("Hire date for the assignment detail overlaps time of existing detail.")
        },
        {
            level: 1,
            code: "CAN_NOT_CALCULATE_BENEFIT_PLAN_START_DATE",
            message: i18n.gettext("Can't calculate benefit plan start date.")
        },
        {
            level: 1,
            code: "CANNOT_UPDATE_OR_DELETE_APPROVED_TIMESHEET_TASKS",
            message: i18n.gettext("Cannot update or delete tasks from approved timesheet \"{0}\".")
        },
        {
            level: 1,
            code: "EMPLOYEE_DOES_NOT_MATCH_OVERTIME_RULES",
            message: i18n.gettext("Employee: {0} is not matching any of the rules configured for Overtime Code: {1}")
        },
        {
            level: 1,
            code: "EMPLOYEE_MATCHES_MULTIPLE_OVERTIME_RULES",
            message: i18n.gettext("Employee: {0} is matching more than one rule configured for Overtime Code: {1}")
        },
        {
            level: 1,
            code: "EMPLOYEE_DOES_NOT_HAVE_AGGREGATE_OVERTIME_RULE",
            message: i18n.gettext("Employee: {0} is covered by multiple overtime rules for the period {1} to {2}. Please configure the aggregate overtime rule using the code ' * '")
        },
        {
            level: 1,
            code: "EMPLOYEE_MATCHES_MULTIPLE_AGGREGATE_OVERTIME_RULE",
            message: i18n.gettext("Employee: {0} is covered by multiple aggregate overtime rules for the period {1} to {2}. Please leave just one aggregate rule.")
        },
        {
            level: 1,
            code: "EMPLOYEE_OVERTIME_RULES_HAVE_DIFFERENT_IS_COMP_TIME_FLAG",
            message: i18n.gettext("Employee: {0} has a combination of over time and comp time rules for the period {1} to {2}. Mixing these in a period is not allowed.")
        },
        {
            level: 1,
            code: "YEAR_END_NOT_DEFINED_FOR_WEEKLY_AND_BEWEEKLY_ACCRUAL_PERIODS",
            message: i18n.gettext("Both YearEnd Date and YearEnd Year should be defined for Weekly and Bi-Weekly accrual periods!")
        },
        {
            level: 1,
            code: "YEAR_END_NOT_DEFINED_FOR_FISCAL_ACCRUAL_METHOD_TYPES",
            message: i18n.gettext("YearEnd should be defined for Fiscal accrual method types!")
        },
        {
            level: 1,
            code: "YEAR_END_NOT_DEFINED_FOR_NON_ACCRUAL_METHOD_WITH_FISCAL_PERIOD_TYPE",
            message: i18n.gettext("YearEnd should be defined for Non-Accrual method type with Fiscal period type!")
        },
        {
            level: 1,
            code: "YEAR_END_NOT_ALIGN_WITH_WEEKLY_ACCRUAL_PERIOD",
            message: i18n.gettext("TimeOffPlanPeriod EndDate({0}, {1}) is not align with accrual period EndDate({2}) for a Weekly period on {3} year.")
        },
        {
            level: 1,
            code: "YEAR_END_NOT_ALIGN_WITH_BEWEEKLY_ACCRUAL_PERIOD",
            message: i18n.gettext("TimeOffPlanPeriod EndDate({0}, {1}) is not align with accrual period EndDate({2}) for a Bi-Weekly(isOddWeek={3}) period on {4} year.")
        },
        {
            level: 1,
            code: "BENEFIT_PLANS_HAVE_DIFFERENT_OPTIONS",
            message: i18n.gettext("Plan: {0} must have same option group / option name as Plan: {1} for auto rollover.")
        },
        {
            level: 1,
            code: "DYNAMIC_DAILY_RECALCULATED_GROUPS_MORE_THAN_FIVE",
            message: i18n.gettext("It's not allowed to have more than 5 daily recalculated groups per employer.")
        },
        {
            level: 1,
            code: "BENEFIT_PLAN_CALCULATION_IS_IN_PROGRESS_STATE",
            message: i18n.gettext("Benefit plan ({0}) is being processed and cannot be changed.")
        },
        {
            level: 1,
            code: "BENEFIT_PLAN_PROCESSING_ISSUE",
            message: i18n.gettext("An issue appeared during benefit plan processing.<br/>{0}")
        },
        {
            level: 1,
            code: "ENDPOINT_IT_RESERVED_BY_PREDEFINED_APPS",
            message: i18n.gettext("Endpoint {0} should be used just for marketplace/criterion apps.")
        },
        {
            level: 1,
            code: "NOT_ALLOWED_TO_CHANGE_ENDPOINT_FOR_PREDEFINED_APP",
            message: i18n.gettext("It's not allowed to change endpoint for marketplace/criterion app.")
        },
        {
            level: 1,
            code: "PERSON_CONTACT_SHOULD_BE_AT_LEAST_DEPENDENT_OR_EMERGENCY",
            message: i18n.gettext("Person contact should be at least dependent or emergency.")
        },
        {
            level: 1,
            code: "SQL_QUERY_IS_NOT_VALID",
            message: i18n.gettext("Can't process/validate SQL Query! {0}")
        },
        {
            level: 1,
            code: "EMPLOYEE_DELETION_HAS_PAYROLLS_TIMESHEETS",
            message: i18n.gettext("This employee cannot be deleted. This employee has records in a payroll batch and time greater than zero in a timesheet!")
        },
        {
            level: 1,
            code: "EMPLOYEE_DELETION_HAS_PAYROLLS",
            message: i18n.gettext("This employee cannot be deleted. This employee has records in a payroll batch!")
        },
        {
            level: 1,
            code: "EMPLOYEE_DELETION_HAS_TIMESHEETS",
            message: i18n.gettext("This employee cannot be deleted. This employee has time greater than zero in a timesheet!")
        },
        {
            level: 1,
            code: "NEGATIVE_CARRYOVER",
            message: i18n.gettext("Carryover must be >= 0.")
        },
        {
            level: 1,
            code: "NEGATIVE_CARRYOVER_EXPIRED",
            message: i18n.gettext("Carryover expired must be >= 0.")
        },
        {
            level: 1,
            code: "NEGATIVE_CARRYOVER_USED",
            message: i18n.gettext("Carryover used must be >= 0.")
        },
        {
            level: 1,
            code: "NEGATIVE_NET_NOT_ALLOWED_FOR_TIME_OFF_PLAN",
            message: i18n.gettext("Negative Net value is not allowed for this time off plan.")
        },
        {
            level: 1,
            code: "UNKNOWN_FILE_CONTENT",
            message: i18n.gettext("Unknown file content type. Expected {0}.")
        },
        {
            level: 1,
            code: "SYSTEM_ACCESS_DENIED",
            message: i18n.gettext("Access Denied.")
        },
        {
            level: 1,
            code: "SCORM_COURSE_CONTENT_TYPE_IS_REQUIRED",
            message: i18n.gettext("SCORM course content type is required.")
        },
        {
            level: 1,
            code: "SCORM_OR_AICC_COURSE_CONTENT_TYPE_IS_REQUIRED",
            message: i18n.gettext("SCORM or AICC course content type is required.")
        },
        {
            level: 1,
            code: "PAYROLL_CANT_HAVE_MULTIPLE_DEDUCTION_FOR_EMPLOYEE_DEDUCTION",
            message: i18n.gettext("Payroll can't have more than 1 deduction based on the same employee deduction.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_CALCULATION_METHOD_IN_DEDUCTION",
            message: i18n.gettext("Unsupported calculation method {0} in deduction {1}.")
        },
        {
            level: 1,
            code: "ONLY_ONE_ACTIVE_ASSIGNMENT_FOR_PRIMARY_ASSIGNMENT",
            message: i18n.gettext("It can be only 1 active assignment for a primary assignment.")
        },
        {
            level: 1,
            code: "IT_IS_POSSIBLE_TO_GROSS_UP_ONE_INCOME",
            message: i18n.gettext("It is possible to gross up just one income.")
        },
        {
            level: 1,
            code: "DETAIL_IS_NOT_FOUND_FOR_CODE_TABLE",
            message: i18n.gettext("Detail {0} is not found for code table {1}.")
        },
        {
            level: 1,
            code: "CODE_TABLE_IS_NOT_FOUND",
            message: i18n.gettext("Code table {0} is not found.")
        },
        {
            level: 1,
            code: "DEFAULT_CODE_TABLE_DETAIL_SHOULD_BE_DEFINED",
            message: i18n.gettext("The default detail for code table {0} should be defined.")
        },
        {
            level: 1,
            code: "CODE_TABLE_DETAIL_ATTRIBUTE_ONE_SHOULD_BE_INTEGER",
            message: i18n.gettext("The attribute 1 value '{0}' for detail {1} in code table {2} should be integer.")
        },
        {
            level: 1,
            code: "CODE_TABLE_DETAIL_ATTRIBUTE_ONE_SHOULD_BE_SET",
            message: i18n.gettext("The attribute 1 value for detail {0} in code table {1} should be set.")
        },
        {
            level: 1,
            code: "CODE_TABLE_DETAILS_ATTRIBUTE_TWO_SHOULD_BE_SET",
            message: i18n.gettext("The attribute 2 value for details in code table {0} should be set.")
        },
        {
            level: 1,
            code: "ASSIGNMENT_TERMINATION_CODE_TABLE_DETAIL_ATTRIBUTE_ONE_SHOULD_BE_SET",
            message: i18n.gettext("The attribute 1 value in detail in code table {0} should be set to 'T' for assignment termination.")
        },
        {
            level: 1,
            code: "FIELD_CAN_NOT_BE_EMPTY",
            message: i18n.gettext("Field '{0}' should not be empty.")
        },
        {
            level: 1,
            code: "EMPLOYEE_REVIEW_JOURNAL_DOES_NOT_HAVE_AN_ATTACHMENT",
            message: i18n.gettext("Employee review journal '{0}' doesn't have an attachment.")
        },
        {
            level: 1,
            code: "EMPLOYEE_REVIEW_JOURNAL_DOES_NOT_HAVE_AN_ATTACHMENT_NAME",
            message: i18n.gettext("Employee review journal '{0}' doesn't have an attachment name.")
        },
        {
            level: 1,
            code: "INVALID_ORG_STRUCTURE_NUMBER",
            message: i18n.gettext("Invalid org structure number: {0}")
        },
        {
            level: 1,
            code: "EMPLOYEE_COURSE_HAS_WRONG_COMPLETE_STATUS",
            message: i18n.gettext("Employee course '{0}' has wrong complete status '{1}'.")
        },
        {
            level: 1,
            code: "PERSON_SHOULD_HAVE_AT_LEAST_ONE_MAILING_ADDRESS",
            message: i18n.gettext("Can't remove person address '{0}' because there should be at least one mailing address.")
        },
        {
            level: 1,
            code: "PERSON_SHOULD_HAVE_AT_LEAST_ONE_PRIMARY_ADDRESS",
            message: i18n.gettext("Can't remove person address '{0}' because there should be at least one primary address.")
        },
        {
            level: 1,
            code: "API_IS_NOT_ALLOWED_TO_BE_USED_BY_SYSTEM_CALLS",
            message: i18n.gettext("This API is allowed to be used only by logged in person.")
        },
        {
            level: 1,
            code: "US_GEOCODE_SHOULD_BE_NINE_CHARACTERS_LONG",
            message: i18n.gettext("US geocode '{0}' should be 9 characters long.")
        },
        {
            level: 1,
            code: "NO_ONE_EMPLOYEE_WAS_FOUND_FOR_PERSON",
            message: i18n.gettext("No employee was found for person '{0}'.")
        },
        {
            level: 1,
            code: "US_GEOSTATE_SHOULD_BE_TWO_CHARACTERS_LONG",
            message: i18n.gettext("US geostate '{0}' should be 2 characters long.")
        },
        {
            level: 1,
            code: "US_GEOCNTY_SHOULD_BE_THREE_CHARACTERS_LONG",
            message: i18n.gettext("US geocnty '{0}' should be 3 characters long.")
        },
        {
            level: 1,
            code: "US_GEOCITY_SHOULD_BE_FOUR_CHARACTERS_LONG",
            message: i18n.gettext("US geocity '{0}' should be 4 characters long.")
        },
        {
            level: 1,
            code: "INTERNATIONAL_GEOCODE_SHOULD_BE_TWELVE_CHARACTERS_LONG",
            message: i18n.gettext("International geocode '{0}' should be 12 characters long.")
        },
        {
            level: 1,
            code: "INTERNATIONAL_COUNTRY_CODE_SHOULD_BE_THREE_CHARACTERS_LONG",
            message: i18n.gettext("International country code '{0}' should be 3 characters long.")
        },
        {
            level: 1,
            code: "INTERNATIONAL_STATE_CODE_SHOULD_BE_TWO_CHARACTERS_LONG",
            message: i18n.gettext("International state code '{0}' should be 2 characters long.")
        },
        {
            level: 1,
            code: "INTERNATIONAL_REGION_CODE_SHOULD_BE_THREE_CHARACTERS_LONG",
            message: i18n.gettext("International region code '{0}' should be 3 characters long.")
        },
        {
            level: 1,
            code: "INTERNATIONAL_CITY_CODE_SHOULD_BE_FOUR_CHARACTERS_LONG",
            message: i18n.gettext("International city code '{0}' should be 4 characters long.")
        },
        {
            level: 1,
            code: "ONLY_PENDING_APPROVAL_BATCH_CAN_BE_CALCULATED",
            message: i18n.gettext("Can't calculate batch {0}. Only batch in the 'PENDING_APPROVAL' status can be calculated.")
        },
        {
            level: 1,
            code: "ONLY_PENDING_APPROVAL_BATCH_CAN_BE_UPDATED",
            message: i18n.gettext("Can't update batch {0}. Only batch in the 'PENDING_APPROVAL' status can be updated.")
        },
        {
            level: 1,
            code: "ONLY_PENDING_APPROVAL_BATCH_CAN_BE_DELETED",
            message: i18n.gettext("Can't update batch {0}. Only batch in the 'PENDING_APPROVAL' status can be deleted.")
        },
        {
            level: 1,
            code: "NOT_FOUND_PRIMARY_ASSIGNMENT_FOR_PERSON",
            message: i18n.gettext("Person {0} doesn't have primary assignment on current date.")
        },
        {
            level: 1,
            code: "NOT_FOUND_PRIMARY_ASSIGNMENT_FOR_EMPLOYEE",
            message: i18n.gettext("Employee {0} doesn't have primary assignment on current date.")
        },
        {
            level: 1,
            code: "NOT_POSSIBLE_TO_REJECT_AUTO_APPROVE_TIME_OFF",
            message: i18n.gettext("It is not possible to reject time off for a timesheet where time off auto approve setting is checked.")
        },
        {
            level: 1,
            code: "QUARTER_CAN_NOT_BE_LESS_THAN_ONE_AND_GREATER_THAN_FOUR",
            message: i18n.gettext("Quarter can't be less than 1 and greater than 4.")
        },
        {
            level: 1,
            code: "PAYROLL_PERIODS_FOR_SCHEDULE_AND_YEAR_ALREADY_EXIST",
            message: i18n.gettext("Payroll periods for schedule '{0}' and year {1} already exist.")
        },
        {
            level: 1,
            code: "EMPLOYEE_CAN_NOT_HAVE_MORE_THAN_ONE_STARTED_TASK",
            message: i18n.gettext("Employee '{0}' can't have more than 1 started tasks.")
        },
        {
            level: 1,
            code: "YEAR_END_SHOULD_BE_SET_FOR_NON_ACCRUING_FISCAL_PLAN",
            message: i18n.gettext("Year end should be set for Non-Accruing Fiscal plan '{0}'.")
        },
        {
            level: 1,
            code: "NOTES_SHOULD_BE_SET_FOR_TIME_OFF_PLAN",
            message: i18n.gettext("Notes should be set for time off plan {0}.")
        },
        {
            level: 1,
            code: "NOT_ALLOWED_TO_UPDATE_APPROVED_TIME_OFF_FROM_ESS",
            message: i18n.gettext("It is not allowed to update approved time off from ESS.")
        },
        {
            level: 1,
            code: "NOT_ALLOWED_TO_UPDATE_SUBMITED_TIME_OFF_FROM_ESS",
            message: i18n.gettext("It is not allowed to update submitted time off from ESS.")
        },
        {
            level: 1,
            code: "END_TIME_SHOULD_BE_SET_FOR_PARTIAL_DAY_HOLIDAY",
            message: i18n.gettext("End time should be set for partial day holiday '{0}'.")
        },
        {
            level: 1,
            code: "NEW_HIRING_MANAGER_SHOULD_BE_DEFINED",
            message: i18n.gettext("New hiring manager should be defined.")
        },
        {
            level: 1,
            code: "NEW_RECRUITER_SHOULD_BE_DEFINED",
            message: i18n.gettext("New recruiter should be defined.")
        },
        {
            level: 1,
            code: "NEW_SUPERVISOR_SHOULD_BE_DEFINED",
            message: i18n.gettext("New supervisor should be defined.")
        },
        {
            level: 1,
            code: "BENEFIT_TERMINATION_FLAG_SHOULD_BE_DEFINED",
            message: i18n.gettext("Benefit termination flag should be defined.")
        },
        {
            level: 1,
            code: "EMPLOYEE_TERMINATION_DATE_SHOULD_BE_SET",
            message: i18n.gettext("Employee termination date should be set.")
        },
        {
            level: 1,
            code: "EMPLOYEE_TERMINATION_REASON_SHOULD_BE_SET",
            message: i18n.gettext("Employee termination reason should be set.")
        },
        {
            level: 1,
            code: "CARRYOVER_USED_CAN_NOT_BE_MORE_THAN_CARRYOVER",
            message: i18n.gettext("Carryover used '{0}' can't be more than carryover '{1}'.")
        },
        {
            level: 1,
            code: "ONLY_MANAGER_IS_ABLE_TO_EDIT_TIME_OFF",
            message: i18n.gettext("Only manager is able to edit time off in the 'Pending approval' or the 'Verified' status.")
        },
        {
            level: 1,
            code: "NOT_ALLOWED_TO_ADD_TIME_OFF_WITHOUT_DETAILS",
            message: i18n.gettext("It's not allowed to add time off without details.")
        },
        {
            level: 1,
            code: "NO_ACTIVE_ASSIGNMENT_DETAILS_FOR_ASSIGNMENT_IN_PERIOD",
            message: i18n.gettext("No active assignment details for assignment in period '{0}' - '{1}' for employee '{2}'.")
        },
        {
            level: 1,
            code: "ALLOCATION_SHOULD_BE_SET_FOR_AUTO_ALLOCATE_TASK",
            message: i18n.gettext("Allocation should be set to 'auto allocate' task '{0}'.")
        },
        {
            level: 1,
            code: "NOT_ALLOWED_TO_COMPLETE_NOT_TRANSMITTED_PAID_REVERSAL_BATCH",
            message: i18n.gettext("You are not allowed to complete the batch that was not transmitted and has the status deffer to 'Paid' and 'Reversal'.")
        },
        {
            level: 1,
            code: "TOTAL_DEPOSITS_AMOUNT_DOES_NOT_EQUAL_TO_NET_PAY",
            message: i18n.gettext("Total deposits amount {0} does not equal to net pay {1}.")
        },
        {
            level: 1,
            code: "BOTH_SALARY_AND_HOURLY_ASSIGNMENT_DETAILS_WERE_FOUND_FOR_SALARY_INCOME",
            message: i18n.gettext("Both Salary ({0}) and hourly ({1}) assignment details were found for Salary Income.")
        },
        {
            level: 1,
            code: "NOT_ALLOWED_TO_CALCULATE_ACCRUAL_FOR_NON_ACCRUAL_TIME_OFF_PLAN",
            message: i18n.gettext("It is not allowed to calculate accrued for non-accrual time off plan.")
        },
        {
            level: 1,
            code: "OPTIONS_SHOULD_BE_PROVIDED_FOR_PDF_REPORT",
            message: i18n.gettext("Options should be provided for PDF report '{0}'.")
        },
        {
            level: 1,
            code: "NOT_ALLOWED_TO_GENERATE_ACH_FOR_COMPLETED_BATCH",
            message: i18n.gettext("It is not allowed to generate ACH for already completed batch '{0}'.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_WEBFORM_TOKEN",
            message: i18n.gettext("Unsupported webform token '{0}'.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_ACCRUAL_PERIOD_FOR_A_FISCAL_PLAN",
            message: i18n.gettext("Unsupported accrual period '{0}' for a fiscal plan.")
        },
        {
            level: 1,
            code: "CAN_NOT_FIND_ACTIVE_ASSIGNMENT_BY_POSITION_CODE",
            message: i18n.gettext("Can't find active assignment for employee '{0}' by position code '{1}'.")
        },
        {
            level: 1,
            code: "CAN_NOT_HAVE_MORE_THAN_ONE_ACTIVE_ASSIGNMENT_WITH_SAME_POSITION_CODE",
            message: i18n.gettext("Employee '{0}' can't have more than 1 active assignment with the same position code {1}.")
        },
        {
            level: 1,
            code: "FILLABLE_PDF_OPTION_IS_REQUIRED",
            message: i18n.gettext("Option '{0}' should be set for '{1}' report.")
        },
        {
            level: 1,
            code: "FILE_KEY_IS_NOT_FOUND_IN_REQUEST_BODY",
            message: i18n.gettext("File key '{0}' is not found in request body.")
        },
        {
            level: 1,
            code: "ASSIGNMENT_CAN_NOT_HAVE_MORE_THAN_ONE_ACTIVE_DETAIL",
            message: i18n.gettext("Assignment for employee '{0}' can't have more than 1 active detail.")
        },
        {
            level: 1,
            code: "NOT_ALLOWED_TO_HAVE_ASSIGNMENTS_WITHOUT_DETAILS",
            message: i18n.gettext("It is not allowed to have assignments without details in the system for employee '{0}'.")
        },
        {
            level: 1,
            code: "PAY_DATE_CAN_NOT_BE_BEFORE_PERIODS_START_DATE",
            message: i18n.gettext("Pay date {0} can't be before period start date {1}.")
        },
        {
            level: 1,
            code: "ALL_DAYS_IN_WEEK_ARE_SET_AS_REGULAR_DAYS_CLOSED",
            message: i18n.gettext("All week days for '{0}' year are set as 'Regular Days Closed'.")
        },
        {
            level: 1,
            code: "REPORT_GENERATION_IS_NOT_IMPLEMENTED_FOR_YEAR",
            message: i18n.gettext("Report '{0}' generation is not implemented for year '{1}'.")
        },
        {
            level: 1,
            code: "REPORT_GENERATION_IS_NOT_IMPLEMENTED_FOR_REPORT_TYPE",
            message: i18n.gettext("Report '{0}' generation is not implemented for report type '{1}'.")
        },
        {
            level: 1,
            code: "REPORT_GENERATION_IS_NOT_IMPLEMENTED",
            message: i18n.gettext("Report generation is not implemented for '{0}'.")
        },
        {
            level: 1,
            code: "EITHER_COUNTRY_CODE_OR_PERSON_ID_SHOULD_BE_SET",
            message: i18n.gettext("Either 'countryCode' or 'personId' request parameter should be specified.")
        },
        {
            level: 1,
            code: "EITHER_ENTITY_TYPE_CD_OR_ENTITY_TYPE_CODE_SHOULD_BE_SET",
            message: i18n.gettext("Either 'entityTypeCd' or 'entityTypeCode' request parameter should be specified.")
        },
        {
            level: 1,
            code: "EMPLOYER_ID_REQUEST_PARAMETER_SHOULD_BE_SPECIFIED",
            message: i18n.gettext("'employerId' request parameter should be specified.")
        },
        {
            level: 1,
            code: "EITHER_START_DATE_OR_END_DATE_REQUEST_PARAMETER_SHOULD_BE_SET",
            message: i18n.gettext("Either 'startDate' or 'endDate' request parameter should be specified.")
        },
        {
            level: 1,
            code: "TIMESHEET_TYPE_ID_REQUEST_PARAMETER_SHOULD_BE_SET",
            message: i18n.gettext("'timesheetTypeId' request parameter should be set.")
        },
        {
            level: 1,
            code: "REPORT_GENERATION_IS_NOT_IMPLEMENTED_FOR_PROVIDED_SET_OF_PARAMETERS",
            message: i18n.gettext("Report generation is not implemented for '{0}' for selected set of parameters. Please check parameters.")
        },
        {
            level: 1,
            code: "PERSON_PREFERENCES_SHOULD_BE_SET_FOR_PERSON",
            message: i18n.gettext("Person preferences should be set for person {0}.")
        },
        {
            level: 1,
            code: "NOT_ALLOWED_TO_UPDATE_TERMINATED_BENEFIT",
            message: i18n.gettext("It is not allowed to update terminated benefit.")
        },
        {
            level: 1,
            code: "RECALL_FOR_NOT_APPROVED_ENTITY_SHOUD_NOT_GO_THROUGH_WORKFLOW",
            message: i18n.gettext("Recall for not approved entity should not go through the workflow.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_RECALL_REQUEST_TYPE",
            message: i18n.gettext("Unsupported recall request type '{0}'.")
        },
        {
            level: 1,
            code: "UNABLE_TO_PARSE_EMPLOYER_MATCH_FORMULA",
            message: i18n.gettext("Unable to parse employer match formula: {0}.")
        },
        {
            level: 1,
            code: "EXPECTED_ONE_ARGUMENT_FOR_OPERATION",
            message: i18n.gettext("Expected 1 argument for operation '{0}'.")
        },
        {
            level: 1,
            code: "EXPECTED_SEVERAL_ARGUMENT_FOR_OPERATION",
            message: i18n.gettext("Expected {1} arguments for operation '{0}'.")
        },
        {
            level: 1,
            code: "FUNCTION_IS_NOT_SUPPORTED",
            message: i18n.gettext("Function {0} is not supported.")
        },
        {
            level: 1,
            code: "SOURCE_DATA_CAN_BE_USED_JUST_FOR_PLAN_CALCULATIONS",
            message: i18n.gettext("Source data can be used just for plan calculations.")
        },
        {
            level: 1,
            code: "FUNCTIONS_WITH_ARGUMENTS_ARE_NOT_SUPPORTED",
            message: i18n.gettext("Functions with {0} arguments are not supported.")
        },
        {
            level: 1,
            code: "ILLEGAL_OPERATION_WITH_PARAMETERS",
            message: i18n.gettext("Illegal operation '{0}' with parameters: {1}.")
        },
        {
            level: 1,
            code: "EITHER_ACCRUED_OR_NET_SHOULD_BE_PROVIDED_IN_TEMPLATE",
            message: i18n.gettext("Either accrued or net should be provided in template.")
        },
        {
            level: 1,
            code: "EXPIRATION_DATE_CAN_NOT_BE_BEFORE_EFFECTIVE_DATE_FOR_ASSIGNMENT_DETAIL",
            message: i18n.gettext("Expiration date '{0}' can't be earlier than effective date '{1}' for assignment detail.")
        },
        {
            level: 1,
            code: "FOREIGN_KEY_SHOULD_BE_GREATER_THAN_ZERO",
            message: i18n.gettext("Foreign key '{0}'='{1}' should be > 0.")
        },
        {
            level: 1,
            code: "NOT_FOUND_EMPLOYER_IN_THE_SYSTEM_BY_LEGAL_NAME",
            message: i18n.gettext("Employer is not found in the system by legal name: '{0}'.")
        },
        {
            level: 1,
            code: "NOT_POSSIBLE_TO_CREATE_ASSIGNMENT_WITHOUT_DETAILS",
            message: i18n.gettext("It is not possible to create assignment without details.")
        },
        {
            level: 1,
            code: "REPORT_ID_OR_NAME_IS_REQUIRED_AS_REQUEST_PARAMETER",
            message: i18n.gettext("Report id or name is required as request parameter.")
        },
        {
            level: 1,
            code: "FIELD_IS_NOT_FOUND_IN_INSTANCE",
            message: i18n.gettext("Field '{0}' is not found in instance '{1}'")
        },
        {
            level: 1,
            code: "NOT_FOUND_ACTIVE_PRIMARY_ASSIGNMENT_FOR_EMPLOYEE",
            message: i18n.gettext("Active primary assignment is not found for employee: '{0}'.")
        },
        {
            level: 1,
            code: "NOT_FOUND_PRIMARY_ASSIGNMENT_FOR_EMPLOYEE_AT_DATE",
            message: i18n.gettext("Primary assignment is not found for employee: '{0}' on date '{1}'.")
        },
        {
            level: 1,
            code: "NOT_FOUND_ASSIGNMENT_FOR_EMPLOYEE_AT_DATE",
            message: i18n.gettext("Assignment is not found for employee: '{0}' on date '{1}'.")
        },
        {
            level: 1,
            code: "NOT_FOUND_PRIMARY_ASSIGNMENT_FOR_EMPLOYEE_IN_PERIOD",
            message: i18n.gettext("Primary assignment is not found for employee: '{0}' in period from '{1}' to '{2}'.")
        },
        {
            level: 1,
            code: "ACCOUNT_IS_MANAGED_BY_EXTERNAL_SYSTEM",
            message: i18n.gettext("This account is managed by external system, please reach out to your system administrator.")
        },
        {
            level: 1,
            code: "IN_OUT_IS_NOT_SUPPORTED_FOR_TIMESHEET_WITH_THE_MANUAL_ENTRY_TYPE",
            message: i18n.gettext("IN/OUT is not supported for a timesheet with the Manual Day entry type.")
        },
        {
            level: 1,
            code: "NOT_ALLOWED_TO_DELETE_UNAVAILABLE_BLOCK_CREATED_WITH_TIME_OFF",
            message: i18n.gettext("It is not allowed to delete unavailable block created with time off.")
        },
        {
            level: 1,
            code: "INVOCATION_SHOULD_BE_SET_IN_MANIFEST_FILE",
            message: i18n.gettext("Invocation should be set in Manifest file.")
        },
        {
            level: 1,
            code: "EMPLOYER_DOES_NOT_HAVE_ACTIVE_PRIMARY_WORK_LOCATION",
            message: i18n.gettext("Employer '{0}' doesn't have active primary work location.")
        },
        {
            level: 1,
            code: "EMPLOYEE_DOES_NOT_HAVE_TIME_OFF_PLAN_OF_TYPE",
            message: i18n.gettext("Employee '{0}' doesn't have time off plan of type '{1}'.")
        },
        {
            level: 1,
            code: "EMPLOYEE_DOES_NOT_HAVE_TIME_OFF_PLAN_OF_TYPE_ON_DATE",
            message: i18n.gettext("Employee '{0}' doesn't have time off plan of type '{1}' on date '{2}'.")
        },
        {
            level: 1,
            code: "PROPERTY_MUST_BE",
            message: i18n.gettext("Property '{0}' must be '{1}'.")
        },
        {
            level: 1,
            code: "PROPERTY_NOT_FOUND",
            message: i18n.gettext("Property '{0}' is not found.")
        },
        {
            level: 1,
            code: "INVALID_SORT_PARAMETER",
            message: i18n.gettext("The 'sort' parameter is invalid: {0}.")
        },
        {
            level: 1,
            code: "WORK_LOCATION_IS_NOT_ASSIGNED_TO_EMPLOYER",
            message: i18n.gettext("Work location '{0}' is not assigned to employer '{1}'.")
        },
        {
            level: 1,
            code: "TIME_OFF_PLAN_IS_NOT_FOUND_BY_EMPLOYER_CODE_AND_IS_ACTIVE",
            message: i18n.gettext("Time off plan is not found by employer: '{0}', plan code: '{1}', is active: {2}")
        },
        {
            level: 1,
            code: "BANK_ACCOUNT_ID_IS_NOT_CONFIGURED_IN_PAYROLL_SETTINGS",
            message: i18n.gettext("Bank Account ID is not configured in Payroll Settings for employer {0}. Attribute 2 in payroll settings should contain bank account id.")
        },
        {
            level: 1,
            code: "ESS_LINK_URL_SHOULD_BE_SET_AS_SAML2",
            message: i18n.gettext("Ess link '{0}' url should be set as SAML2 to trigger this API.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_GEOCODE_FORMAT",
            message: i18n.gettext("Unsupported geocode format. Geocode should be 9 characters long for US or 12 characters long for International taxes.")
        },
        {
            level: 1,
            code: "COURSE_IS_NOT_ASSIGNED_TO_EMPLOYEE",
            message: i18n.gettext("Course '{0}' is not assigned to employee '{1}'.")
        },
        {
            level: 1,
            code: "ACCRUAL_START_DATE_CAN_NOT_BEFORE_EMPLOYEE_TIME_OFF_PLAN_START_DATE",
            message: i18n.gettext("Accrual start date '{0}' can't be before employee time off plan start date '{1}'.")
        },
        {
            level: 1,
            code: "ACCRUAL_END_DATE_CAN_NOT_BEFORE_EMPLOYEE_TIME_OFF_PLAN_START_DATE",
            message: i18n.gettext("Accrual end date '{0}' can't be before employee time off plan start date '{1}'.")
        },
        {
            level: 1,
            code: "ACCRUAL_PERIOD_END_DATE_CAN_NOT_BEFORE_EMPLOYEE_TIME_OFF_PLAN_START_DATE",
            message: i18n.gettext("Accrual period end date '{0}' can't be before employee time off plan start date '{1}'.")
        },
        {
            level: 1,
            code: "ACCRUAL_END_DATE_CAN_NOT_BEFORE_ACCRUAL_START_DATE",
            message: i18n.gettext("Accrual end date '{0}' can't be before accrual start date '{1}'.")
        },
        {
            level: 1,
            code: "ACCRUAL_PERIOD_END_DATE_CAN_NOT_BEFORE_ACCRUAL_PERIOD_START_DATE",
            message: i18n.gettext("Accrual period end date '{0}' can't be before accrual period start date '{1}'.")
        },
        {
            level: 1,
            code: "PUBLISH_SITE_SETTINGS_ARE_NOT_SET",
            message: i18n.gettext("Settings are not set for publish site '{0}'.")
        },
        {
            level: 1,
            code: "TWO_FA_IS_ALREADY_ACTIVATED_FOR_PERSON",
            message: i18n.gettext("2fa is already activated for person '{0}'.")
        },
        {
            level: 1,
            code: "SANDBOX_SYNCHRONIZATION_FOR_TENANT_IS_ALREADY_IN_PROGRESS",
            message: i18n.gettext("Sandbox synchronization for tenant '{0}' is already in progress.")
        },
        {
            level: 1,
            code: "SANDBOX_SYNCHRONIZATION_FOR_TENANT_CAN_BE_STARTED_ON_TIME_IN_24_HOURS",
            message: i18n.gettext("Sandbox synchronization for tenant '{0}' can't be started. You can make synchronization 1 time in 24 hours.")
        },
        {
            level: 1,
            code: "EMPLOYEE_CAN_NOT_HAVE_MORE_THAN_ONE_ACTIVE_DEDUCTION",
            message: i18n.gettext("Employee '{0}' can't have more than one active deduction with code '{1}'.")
        },
        {
            level: 1,
            code: "ITS_NOT_ALLOWED_TO_ACCRUE_INACTIVE_TIME_OFF_PLAN_FOR_EMPLOYEE",
            message: i18n.gettext("It is not allowed to accrue inactive time off plan '{0}' for employee '{1}'.")
        },
        {
            level: 1,
            code: "ITS_NOT_ALLOWED_TO_ACCRUE_PLAN_IN_CLOSED_PERIOD",
            message: i18n.gettext("It is not allowed to accrue time off plan '{0}' for employee '{1}' in closed period. Period start: '{2}', period end: '{3}'.")
        },
        {
            level: 1,
            code: "NOT_ALLOWED_TO_REMOVE_UNAPPROVED_TIME_OFF",
            message: i18n.gettext("It is not allowed to remove unapproved time off for employee '{0}'.")
        },
        {
            level: 1,
            code: "POSITION_SHOULD_BE_DEFINED_FOR_EMPLOYEE_FOR_EMPLOYER_POSITION_CONTROL_TRUE",
            message: i18n.gettext("Position should be defined for employee '{0}' since position control is set for employer '{1}'.")
        },
        {
            level: 1,
            code: "IT_IS_NOT_POSSIBLE_TO_CREATE_TIMESHEET_TASK_WITHOUT_DETAILS",
            message: i18n.gettext("It is not possible to create timesheet task without details.")
        },
        {
            level: 1,
            code: "IT_IS_NOT_POSSIBLE_TO_CREATE_TIMESHEET_TASK_WITH_MORE_THAN_ONE_DETAIL",
            message: i18n.gettext("It is not possible to create timesheet task with more than one detail.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_TIMESHEET_FREQUENCY_CODE",
            message: i18n.gettext("Unsupported timesheet frequency code: '{0}'.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_TIME_OFF_FREQUENCY_CODE",
            message: i18n.gettext("Unsupported time off frequency code: '{0}'.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_TIME_OFF_CALCULATION_TYPE_CODE",
            message: i18n.gettext("Unsupported time off calculation type code: '{0}'.")
        },
        {
            level: 1,
            code: "EMPLOYEE_CAN_NOT_BE_PUNCHED_DUE_TO_TIME_OVERLAPS",
            message: i18n.gettext("Employee '{0}' can't be punched in due to time overlaps.")
        },
        {
            level: 1,
            code: "EMPLOYER_FROM_PAY_GROUPS_SHEET_DOES_NOT_MATCH_EMPLOYER_IN_PAYROLL_SCHEDULE",
            message: i18n.gettext("Employer from 'Pay Groups' sheet does not match employer set for payroll schedule. Row: '{0}'.")
        },
        {
            level: 1,
            code: "NOT_ALLOWED_TO_HAVE_SEVERAL_BATCHES_WITH_SAME_NAME_IN_THE_SYSTEM",
            message: i18n.gettext("It is not allowed to have several batches with same name in the system. Batch name: '{0}'.")
        },
        {
            level: 1,
            code: "EMPLOYEE_ALREADY_HAS_STARTED_TASK_ON_DATE",
            message: i18n.gettext("Employee '{0}' has already started task on date: '{1}'.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_FILTER_PARAMETER",
            message: i18n.gettext("Unsupported filter parameter: '{0}'.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_SQL_OPERATOR",
            message: i18n.gettext("Unsupported SQL operator: '{0}'.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_FILTER_PARAMETER_TYPE",
            message: i18n.gettext("Unsupported filter parameter type: '{0}'.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_JOIN_PARAMETER_TYPE",
            message: i18n.gettext("Unsupported join parameter type: '{0}'.")
        },
        {
            level: 1,
            code: "COURSE_CLASS_SHOULD_BE_SET_FOR_COURSE",
            message: i18n.gettext("Course class should be set for course '{0}' for employee '{1}'.")
        },
        {
            level: 1,
            code: "DIAGNOSTIC_IS_IN_PROGRESS",
            message: i18n.gettext("Diagnostic is in progress.")
        },
        {
            level: 1,
            code: "NOT_ALLOWED_TO_APPROVE_NOT_PENDING_APPROVAL_BATCH",
            message: i18n.gettext("It is not allowed to approve the batch '{0}' that has the status deffer to 'Pending approval'.")
        },
        {
            level: 1,
            code: "ALLOWED_TO_RESET_JUST_APPROVED_TIMESHEETS",
            message: i18n.gettext("It is allowed to reset only approved timesheets.")
        },
        {
            level: 1,
            code: "CAN_NOT_FIND_EMPLOYEE_BY_SSN_FOR_EMPLOYER",
            message: i18n.gettext("Can't find employee by social security number '{0}' for employer '{1}'.")
        },
        {
            level: 1,
            code: "NOT_ALLOWED_TO_HAVE_SEVERAL_TAXES_ON_SAME_DATE_FOR_EMPLOYER",
            message: i18n.gettext("It is not allowed to have several taxes '{0}' on same date '{1}' for employer '{2}'.")
        },
        {
            level: 1,
            code: "AUTHORIZATION_TOKEN_IS_NOT_FOUND_IN_REQUEST",
            message: i18n.gettext("Authorization token is not found in request.")
        },
        {
            level: 1,
            code: "DO_NOT_HAVE_PENDING_CHECK_ON_DATES_FOR_DEDUCTIONS",
            message: i18n.gettext("You don't have pending checks which have 'Paydate' > 'Expiration date' for deductions.")
        },
        {
            level: 1,
            code: "TIMESHEET_ON_DATE_IS_NOT_FOUND_FOR_EMPLOYEE",
            message: i18n.gettext("Timesheet on date '{0}' is not found for employee '{1}'.")
        },
        {
            level: 1,
            code: "COURSE_REVIEW_CUSTOM_FORM_IS_NOT_SET_FOR_COURSE_CLASS",
            message: i18n.gettext("Course review custom form is not set for course class '{0}'.")
        },
        {
            level: 1,
            code: "EITHER_TASK_OR_TASK_GROUP_CAN_BE_SET_IN_EMPLOYEE_TASK",
            message: i18n.gettext("Either task or task group can be set in employee task for employee '{0}'.")
        },
        {
            level: 1,
            code: "EITHER_SCHEDULED_START_OR_SCHEDULED_END_SHOULD_BE_SET_FOR_WORK_PERIOD_EXCEPTION",
            message: i18n.gettext("Either scheduled start or scheduled end should be set for work period exception.")
        },
        {
            level: 1,
            code: "COLUMN_NUMBER_IS_NOT_DEFINED",
            message: i18n.gettext("Column number is not defined. Please check configuration.")
        },
        {
            level: 1,
            code: "JSON_ARRAY_IS_NOT_FOUND",
            message: i18n.gettext("Json array '{0}' is not found.")
        },
        {
            level: 1,
            code: "ELEMENT_IS_NOT_AN_INTEGER_VALUE_IN_ARRAY",
            message: i18n.gettext("Element '{0}' is not an integer value in array '{1}'.")
        },
        {
            level: 1,
            code: "JSON_OBJECT_IS_NOT_FOUND",
            message: i18n.gettext("JSON object '{0}' is not found.")
        },
        {
            level: 1,
            code: "MAX_RATE_SHOULD_BE_DEFINED_FOR_SALARY_GRADE",
            message: i18n.gettext("Max rate should be defined<br/>Employer: '{0}'<br/>Salary group: '{1}'<br/>Salary grade: '{2}'")
        },
        {
            level: 1,
            code: "STEP_SHOULD_BE_DEFINED_FOR_SALARY_GRADE",
            message: i18n.gettext("Step should be defined<br/>Employer: '{0}'<br/>Salary group: '{1}'<br/>Salary grade: '{2}'")
        },
        {
            level: 1,
            code: "EITHER_CODE_TABLE_IDS_OR_CODE_TABLE_NAMES_PARAMETER_SHOULD_BE_PROVIDED_IN_REQUEST",
            message: i18n.gettext("Either 'codeTableIds' or 'codeTableNames' parameter should be provided in request.")
        },
        {
            level: 1,
            code: "EITHER_PERSON_CONTACT_OR_EMPLOYE_BENEFIT_ID_OR_NO_ONE_PARAMETER_SHOULD_BE_PROVIDED_IN_REQUEST",
            message: i18n.gettext("Either 'personContactId' or 'employeeBenefitId' or no parameter should be provided in request.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_RECALL_ACTION",
            message: i18n.gettext("Unsupported recall action '{0}'.")
        },
        {
            level: 1,
            code: "OPTION_GROUP_SHOULD_BE_IN_RANGE",
            message: i18n.gettext("Option group '{0}' should be in range [1,4].")
        },
        {
            level: 1,
            code: "ASSIGNMENT_FOR_EMPLOYEE_SHOULD_HAVE_AT_LEAST_ONE_DETAIL",
            message: i18n.gettext("Assignment for employee '{0}' should have at least one detail.")
        },
        {
            level: 1,
            code: "PERSON_SHOULD_NOT_HAVE_MORE_THAN_ONE_PRIMARY_ADDRESS",
            message: i18n.gettext("Person '{0}' should not have more than one primary address.")
        },
        {
            level: 1,
            code: "MORE_THAN_ONE_PRIMARY_TIME_ZONE_IS_DEFINED_FOR_EMPLOYEE",
            message: i18n.gettext("More than one primary Time zone is defined for employee '{0}'.")
        },
        {
            level: 1,
            code: "EXTERNAL_SYSTEM_SHOULD_BE_SET_FOR_TRANSFER_TYPE_SCHEDULE_TASK_WITH_SFTP_RECIPIENT_TYPE",
            message: i18n.gettext("External system should be set for transfer type schedule task with SFTP recipient type.")
        },
        {
            level: 1,
            code: "EXTERNAL_SYSTEM_CAN_BE_DEFINED_JUST_FOR_TRANSFER_TYPE_SCHEDULE_TASK_WITH_SFTP_RECIPIENT_TYPE",
            message: i18n.gettext("External system can be defined just for transfer type schedule task with SFTP recipient type.")
        },
        {
            level: 1,
            code: "CAN_NOT_ACCESS_ASSIGNMENT_FOR_EMPLOYEE_BY_SECURITY_PROFILES",
            message: i18n.gettext("Can't access assignment for employee '{0}'. Please check your security profiles.")
        },
        {
            level: 1,
            code: "CAN_NOT_ACCESS_PERSON_FOR_EMPLOYEE_BY_SECURITY_PROFILES",
            message: i18n.gettext("Can't access person for employee '{0}'. Please check your security profiles.")
        },
        {
            level: 1,
            code: "CAN_NOT_ACCESS_EMPLOYEE_BY_SECURITY_PROFILES",
            message: i18n.gettext("Can't access employee '{0}'. Please check your security profiles.")
        },
        {
            level: 1,
            code: "CAN_NOT_ACCESS_TIMESHEET_BY_SECURITY_PROFILES",
            message: i18n.gettext("Can't access timesheet for employee '{0}'. Please check your security profiles.")
        },
        {
            level: 1,
            code: "CAN_NOT_ACCESS_TIME_OFF_ATTACHMENT_FOR_EMPLOYEE_BY_SECURITY_PROFILES",
            message: i18n.gettext("Can't access time off attachment for employee '{0}'. Please check your security profiles.")
        },
        {
            level: 1,
            code: "INSTRUCTOR_SHOULD_HAVE_EMAIL_SET",
            message: i18n.gettext("Instructor should have email set.")
        },
        {
            level: 1,
            code: "WORK_LOCATION_AREA_IS_NOT_FOUND_BY_CODE",
            message: i18n.gettext("Work location area is not found by code '{0}'.")
        },
        {
            level: 1,
            code: "STATIC_TOKEN_IS_NOT_VALID",
            message: i18n.gettext("Static token is not valid.")
        },
        {
            level: 1,
            code: "PAYROLLS_IN_COMPLETED_BATCH_CAN_BE_VOIDED",
            message: i18n.gettext("Payrolls in just completed batch can be voided.")
        },
        {
            level: 1,
            code: "IT_IS_NOT_ALLOWED_TO_REMOVE_APPROVED_TIME_OFF",
            message: i18n.gettext("It is not allowed to remove time off which is approved or in workflow queue for employee '{0}'.")
        },
        {
            level: 1,
            code: "IT_IS_NOT_ALLOWED_TO_START_TIMER_FOR_A_NOT_INCOME_TASK",
            message: i18n.gettext("It is not allowed to start timer for a not 'Income' task.")
        },
        {
            level: 1,
            code: "IT_IS_NOT_ALLOWED_TO_STOP_TIMER_FOR_A_NOT_INCOME_TASK",
            message: i18n.gettext("It is not allowed to stop timer for a not 'Income' task.")
        },
        {
            level: 1,
            code: "PERIOD_TYPE_SHOULD_BE_SET_FOR_NON_ACCRUING_TIME_OFF_PLAN",
            message: i18n.gettext("Period type should be set for Non-Accruing time off plan '{0}'.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_CONTENT_TYPE",
            message: i18n.gettext("Unsupported content type '{0}'.")
        },
        {
            level: 1,
            code: "START_STOP_IS_NOT_SUPPORTED_FOR_A_TIMESHEET_WITH_THE_MANUAL_DAY_ENTRY_TYPE",
            message: i18n.gettext("Start/Stop is not supported for a timesheet with the Manual Day entry type.")
        },
        {
            level: 1,
            code: "EMPLOYEE_IS_ALREADY_REGISTERED",
            message: i18n.gettext("Employee '{0}' is already registered.")
        },
        {
            level: 1,
            code: "RECEIPT_IS_NOT_SET_FOR_TRANSMISSION",
            message: i18n.gettext("Receipt is not set for aca transmission year '{0}'.")
        },
        {
            level: 1,
            code: "RESPONSE_RECEIPT_DIFFERS_WITH_ONE_WHICH_IS_SET_FOR_ACA_TRANSMISSION",
            message: i18n.gettext("Response receipt '{0}' differs with '{1}' which is set for aca transmission year '{2}'.")
        },
        {
            level: 1,
            code: "SECOND_FA_SEED_IS_NOT_SET_FOR_USER",
            message: i18n.gettext("2fa seed is not set for selected user.")
        },
        {
            level: 1,
            code: "ATTRIBUTE_FOR_SERVER_SHOULD_BE_SET",
            message: i18n.gettext("{0} for {1} server should be set in Tenant Authentication '{2}'.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_PAYCODE",
            message: i18n.gettext("Unsupported paycode: '{0}'.")
        },
        {
            level: 1,
            code: "ACCRUAL_PERIOD_IS_NOT_SUPPORTED",
            message: i18n.gettext("Accrual period is not supported for:<br/>Code: {0}<br/>Start day of week: {1}<br/>Is odd week: {2}<br/>Plan start date: {3}")
        },
        {
            level: 1,
            code: "PERSON_HAS_MORE_THAN_ONE_EMPLOYEE_THAT_BELONGS_TO_EMPLOYER",
            message: i18n.gettext("Person has more than one employee that belongs to employer '{0}'.")
        },
        {
            level: 1,
            code: "TENANT_IS_NOT_ALLOWED_TO_USE_THIRD_PARTY_AUTH_BUT_USER_IS_ALLOWED",
            message: i18n.gettext("Tenant is not allowed to use 3rd party auth, but user is allowed.")
        },
        {
            level: 1,
            code: "IT_IS_NOT_ALLOWED_TO_HAVE_MORE_THAN_ONE_APP_WITH_SAME_ENDPOINT",
            message: i18n.gettext("It is not allowed to have more than 1 app with the same endpoint '{0}'.")
        },
        {
            level: 1,
            code: "CAN_NOT_FIND_AN_APP_BY_ENDPOINT",
            message: i18n.gettext("Can't find an app by endpoint '{0}'.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_EVENT_TYPE",
            message: i18n.gettext("Unsupported event type '{0}'.")
        },
        {
            level: 1,
            code: "CAN_NOT_FIND_MANIFEST_BY_ENDPOINT",
            message: i18n.gettext("Can't find manifest by endpoint '{0}'.")
        },
        {
            level: 1,
            code: "BUTTON_NAME_SHOULD_BE_SET_IN_APP_TRIGGER_FOR_CUSTOM_BUTTON_INVOCATIONS",
            message: i18n.gettext("Button name should be set in app trigger for custom button invocations.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_PARAMETER_VALUE_TYPE",
            message: i18n.gettext("Unsupported parameter value type '{0}'.")
        },
        {
            level: 1,
            code: "APP_IS_ALREADY_REGISTERED",
            message: i18n.gettext("App '{0}' is already registered.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_ASSIGNMENT_ACTION_TYPE",
            message: i18n.gettext("Unsupported assignment action type '{0}'.")
        },
        {
            level: 1,
            code: "PAYCODE_CAN_NOT_BE_SPLITTED",
            message: i18n.gettext("{0} paycode can not be splitted.")
        },
        {
            level: 1,
            code: "AVERAGE_HOURS_SHOULD_BE_IN_RANGE",
            message: i18n.gettext("The averageHours '{0}' should be more than 0 and less or equal 24.")
        },
        {
            level: 1,
            code: "FTE_SHOULD_NOT_BE_NEGATIVE",
            message: i18n.gettext("FTE '{0}' should not be negative.")
        },
        {
            level: 1,
            code: "IT_IS_NOT_ALLOWED_TO_CREATE_NEW_ASSIGNMENT_DETAIL_BEFORE_FIRST_ASSIGNMENT_DETAIL",
            message: i18n.gettext("It is not allowed to create a new assignment detail before first assignment detail for employee '{0}'.")
        },
        {
            level: 1,
            code: "CAN_NOT_EXTRACT_CONTENT_TYPE_FROM_INPUT",
            message: i18n.gettext("Can't extract content type from input '{0}'.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_BASIC_OPERATION",
            message: i18n.gettext("Unsupported basic operation '{0}'.")
        },
        {
            level: 1,
            code: "EXPECTED_COUNT_OF_OBJECTS_FOR_BENEFIT_PLAN_BUT_FOUND",
            message: i18n.gettext("Expected '{0}' option objects for benefit plan '{1}' but '{2}' found.")
        },
        {
            level: 1,
            code: "OPTION_IS_NOT_DEFINED_IN_BENEFIT_PLAN",
            message: i18n.gettext("Option '{0}' is not defined in benefit plan '{1}'.")
        },
        {
            level: 1,
            code: "TOKEN_BENEFIT_OPTION_VALUE_IS_VALID_ONLY_FOR_NON_MANUAL_OPTION_GROUP",
            message: i18n.gettext("Token @benefitOptionValue('{0}', '{1}') is valid only for non-manual option group.")
        },
        {
            level: 1,
            code: "UNABLE_TO_ADD_BENEFIT_PLAN_TO_EMPLOYEE_WHICH_BELONGS_TO_ANOTHER_EMPLOYER",
            message: i18n.gettext("Unable to add benefit plan '{0}' to employee '{1}'. Benefit plan and employee belong to different employers.")
        },
        {
            level: 1,
            code: "NOT_ALLOWED_TO_CALCULATE_MANUALLY_OVERRIDDEEN_PLAN",
            message: i18n.gettext("It is not allowed to calculate manually overridden plan '{0}'.")
        },
        {
            level: 1,
            code: "THIS_CALCULATION_WORKS_ONLY_FOR_NEW_ADDED_BENEFIT_PLAN",
            message: i18n.gettext("This calculation works only for new added benefit plan.")
        },
        {
            level: 1,
            code: "POSITION_IS_FULLY_ASSIGNED",
            message: i18n.gettext("Position '{0}' is fully assigned.")
        },
        {
            level: 1,
            code: "DOCUMENT_DOES_NOT_CONTAIN_WEB_FORM",
            message: i18n.gettext("Document is not a web form.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_TYPE_OF_CERIDIAN_FREQUENCY",
            message: i18n.gettext("Unsupported type of Ceridian frequency '{0}'.")
        },
        {
            level: 1,
            code: "NO_ONE_CERTIFIED_RATE_DETAIL_WAS_CREATED",
            message: i18n.gettext("No certified rate detail was created.")
        },
        {
            level: 1,
            code: "EMPLOYEE_DOES_NOT_HAVE_STARTED_TIMESHEET_TASK",
            message: i18n.gettext("Employee '{0}' does not have started timesheet task.")
        },
        {
            level: 1,
            code: "TABLE_ACCESS_DENIED",
            message: i18n.gettext("You don't have access to this '{0}'. Please verify your security role permissions.")
        },
        {
            level: 1,
            code: "CAN_NOT_MODIFY_CODE_TABLE",
            message: i18n.gettext("Can't modify code table '{0}'. It is allowed to modify just custom code tables.")
        },
        {
            level: 1,
            code: "DEFAULT_DETAIL_FOR_CODE_TABLE_ALREADY_EXISTS",
            message: i18n.gettext("Default detail for code table '{0}' already exists.")
        },
        {
            level: 1,
            code: "INVALID_COLOR_FORMAT",
            message: i18n.gettext("Invalid color format: '{0}'.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_DEDUCTION_CALCULATION_METHOD_IN_DEDUCTION",
            message: i18n.gettext("Unsupported deduction calculation method '{0}' in deduction '{1}'.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_CUSTOM_FIELD_DATA_TYPE",
            message: i18n.gettext("Unsupported custom field data type '{0}'.")
        },
        {
            level: 1,
            code: "PAYROLL_IMPORT_HAS_TIMESHEETS_FROM_APPROVED_BATCHES",
            message: i18n.gettext("You can't proceed because there are already approved/paid batches containing data on the same timesheets.")
        },
        {
            level: 1,
            code: "INVALID_TIME_CLOCK_DEVICE_SERIAL_NUMBER",
            message: i18n.gettext("Invalid device serial number for Time Clock '{0}'.")
        },
        {
            level: 1,
            code: "MANUAL_VALUE_SHOULD_BE_DEFINED_FOR_MANUAL_OPTION_IN_PLAN_FOR_EMPLOYEE",
            message: i18n.gettext("Manual value should be defined for manual option '{0}' in plan '{1}' for employee '{2}'.")
        },
        {
            level: 1,
            code: "MANUAL_VALUE_SHOULD_BE_DEFINED_FOR_MANUAL_OPTION_IN_PLAN",
            message: i18n.gettext("Manual value should be defined for manual option '{0}' in plan '{1}'.")
        },
        {
            level: 1,
            code: "BENEFIT_PLAN_OPTION_SHOULD_BE_DEFINED_FOR_NON_MANUAL_OPTION_IN_PLAN_FOR_EMPLOYEE",
            message: i18n.gettext("Benefit plan option should be defined for non-manual option '{0}' in plan '{1}' for employee '{2}'.")
        },
        {
            level: 1,
            code: "BENEFIT_PLAN_OPTION_SHOULD_BE_DEFINED_FOR_NON_MANUAL_OPTION_IN_PLAN",
            message: i18n.gettext("Benefit plan option should be defined for non-manual option '{0}' in plan '{1}'.")
        },
        {
            level: 1,
            code: "VERIFIED_CREDENTIALS_EXTERNAL_SYSTEM_SHOULD_BE_SET_FOR_CANDIDATE_BACKGROUND",
            message: i18n.gettext("'Verified Credentials' external system should be set for candidate background.")
        },
        {
            level: 1,
            code: "EITHER_EMPLOYEE_NUMBER_OR_SOCIAL_SECURITY_NUMBER_SHOULD_BE_SET_IN_ROW_AND_FOUND_IN_THE_SYSTEM",
            message: i18n.gettext("Either employee number or social security number should be set in row '{0}' and found in the system.")
        },
        {
            level: 1,
            code: "COURSE_DATE_SHOULD_BE_SET_IN_COURSE_CLASS",
            message: i18n.gettext("Course date should be set in course class '{0}'.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_ENTITY_TYPE_CODE_FOR_CUSTOM_VALUE",
            message: i18n.gettext("Unsupported entity type code '{0}' for custom value. Allowed codes: '{1}'.")
        },
        {
            level: 1,
            code: "EITHER_PAYROLL_PERIOD_ID_OR_START_DATE_WITH_END_DATE_REQUEST_PARAMETERS_SHOULD_BE_SET",
            message: i18n.gettext("Either 'payrollPeriodId' or 'startDate' with 'endDate' request parameters should be specified.")
        },
        {
            level: 1,
            code: "EMPLOYEE_DOCUMENT_SHOULD_BE_A_DATA_FORM",
            message: i18n.gettext("Employee document '{0}' should be a data form.")
        },
        {
            level: 1,
            code: "EMPLOYEE_ONBOARDING_SHOULD_BE_A_DATA_FORM",
            message: i18n.gettext("Employee onboarding '{0}' should be a data form.")
        },
        {
            level: 1,
            code: "EMPLOYER_DOCUMENT_SHOULD_BE_A_DATA_FORM",
            message: i18n.gettext("Employer document '{0}' should be a data form.")
        },
        {
            level: 1,
            code: "ONBOARDING_DOCUMENT_UNKNOWN",
            message: i18n.gettext("Document for Onboarding '{0}' doesn't exist in the system")
        },
        {
            level: 1,
            code: "UNSUPPORTED_ORDER_DIRECTION_TYPE",
            message: i18n.gettext("Unsupported order direction type '{0}'. Supported direction types: '{1}'.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_FILTER_OPERATOR",
            message: i18n.gettext("Unsupported filter operator '{0}'. Supported filter operators: '{1}'.")
        },
        {
            level: 1,
            code: "FIELD_OPTIONS_SHOULD_BE_A_JSON_OBJECT",
            message: i18n.gettext("The 'options' field should be a JSON object.")
        },
        {
            level: 1,
            code: "EITHER_DATA_FORM_ID_OR_WEBFORM_ID_REQUEST_PARAMETER_SHOULD_BE_SET",
            message: i18n.gettext("Either 'dataformId' or 'webformId' request parameter should be specified.")
        },
        {
            level: 1,
            code: "EITHER_IS_SQL_OR_IS_MODULE_OR_IS_FORM_OR_IS_TABLE_REQUEST_PARAMETER_SHOULD_BE_SET",
            message: i18n.gettext("Either 'isSql' or 'isModule', or 'isForm', or 'isTable' request parameter should be specified.")
        },
        {
            level: 1,
            code: "COLUMN_ID_WAS_NOT_FOUND_IN_THE_DATA_MODULE",
            message: i18n.gettext("Column id '{0}' was not found in the Data Module.")
        },
        {
            level: 1,
            code: "COLUMN_ID_WAS_NOT_FOUND_IN_THE_DATA_TABLES",
            message: i18n.gettext("Column id '{0}' was not found in the Data Tables.")
        },
        {
            level: 1,
            code: "COLUMN_ID_WAS_NOT_FOUND_IN_WEBFORM",
            message: i18n.gettext("Column id '{0}' was not found in Webform.")
        },
        {
            level: 1,
            code: "DEDUCTED_MINUTES_GREATER_THAN_OVERTIME_MINUTES",
            message: i18n.gettext("Deducted minutes '{0}' > overtime minutes '{1}'.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_DEDUCTION_PAY_TYPE_IN_DEDUCTION",
            message: i18n.gettext("Unsupported deduction pay type '{0}' in deduction '{1}'.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_DEDUCTION_CALCULATION_METHOD",
            message: i18n.gettext("Unsupported deduction calculation method '{0}'.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_DEDUCTION_LIMIT_PERIOD",
            message: i18n.gettext("Unsupported deduction limit period '{0}'.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_FREQUENCY_TYPE",
            message: i18n.gettext("Unsupported frequency type '{0}'.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_PAYROLL_FREQUENCY_TYPE",
            message: i18n.gettext("Unsupported payroll frequency type '{0}'.")
        },
        {
            level: 1,
            code: "ACTIVE_WORKERS_COMPENSATION_WAS_NOT_FOUND_FOR_EMPLOYEE",
            message: i18n.gettext("Active Workers Compensation was not found for employee '{0}'.")
        },
        {
            level: 1,
            code: "NO_ONE_EMPLOYEE_WAS_FOUND_FOR_PERSON_AND_EMPLOYER",
            message: i18n.gettext("No employee was found for person '{0}' and employer '{1}'.")
        },
        {
            level: 1,
            code: "INVALID_AMOUNT_TYPE",
            message: i18n.gettext("Invalid amount type '{0}'.")
        },
        {
            level: 1,
            code: "OPTION_GROUP_HAS_WRONG_VALUE",
            message: i18n.gettext("Option group '{0}' has wrong value '{1}'.")
        },
        {
            level: 1,
            code: "CAN_NOT_ADD_BENEFIT_PLAN_TO_EMPLOYEE_DIFFERENT_EMPLOYER",
            message: i18n.gettext("Cannot add '{0}' benefit plan to employee '{1}'. Plan and employee are set for different employers.")
        },
        {
            level: 1,
            code: "DEDUCTION_IS_NOT_SET_FOR_EMPLOYER",
            message: i18n.gettext("Deduction '{0}' is not set for employer '{1}'.")
        },
        {
            level: 1,
            code: "EXPECTED_MANUAL_BENEFIT_PLAN_OPTION",
            message: i18n.gettext("Wrong benefit plan option. Manual benefit plan option is expected for Option Group '{0}'.")
        },
        {
            level: 1,
            code: "OPTION_GROUP_IS_NOT_SET_FOR_GROUP_NUMBER_IN_BENEFIT_PLAN",
            message: i18n.gettext("Option group '{0}' is not set for group number '{1}' in benefit plan '{2}'.")
        },
        {
            level: 1,
            code: "FIELD_POSITION_ID_ID_REQUIRED_SINCE_POSITION_CONTROL_IS_SET_FOR_EMPLOYER",
            message: i18n.gettext("The 'positionId' field is required since 'Position Control' is set for employer.")
        },
        {
            level: 1,
            code: "EMPLOYEE_IS_NOT_ACTIVE",
            message: i18n.gettext("Employee '{0}' is not active.")
        },
        {
            level: 1,
            code: "COMPLETED_DATE_SHOULD_BE_SET_FOR_COURSE_FOR_EMPLOYEE",
            message: i18n.gettext("Completed date should be set for course '{0}' for employee '{1}'.")
        },
        {
            level: 1,
            code: "SPOUSE_SOCIAL_SECURITY_NUMBER_SHOULD_BE_SET",
            message: i18n.gettext("Spouse's social security number should be set.")
        },
        {
            level: 1,
            code: "EITHER_EMPLOYEE_ID_OR_DEDUCTION_ID_SHOULD_BE_SET",
            message: i18n.gettext("Either 'employeeId' or 'deductionId' request parameter should be specified.")
        },
        {
            level: 1,
            code: "EMPLOYEE_AMOUNT_FOR_DEDUCTION_FOR_EMPLOYEE",
            message: i18n.gettext("Employee amount for deduction '{0}' for employee '{1}' should be numeric.")
        },
        {
            level: 1,
            code: "EMPLOYER_AMOUNT_FOR_DEDUCTION_FOR_EMPLOYEE",
            message: i18n.gettext("Employer amount for deduction '{0}' for employee '{1}' should be numeric.")
        },
        {
            level: 1,
            code: "WORKFLOW_CONFIGURATION_IS_NOT_SET_FOR_WEBFORM",
            message: i18n.gettext("Workflow configuration is not set for Webform '{0}'.")
        },
        {
            level: 1,
            code: "WORKFLOW_CONFIGURATION_IS_NOT_SET_FOR_DATAFORM",
            message: i18n.gettext("Workflow configuration is not set for Dataform '{0}'.")
        },
        {
            level: 1,
            code: "CAN_NOT_ADD_EMPLOYEE_TO_EMPLOYEE_GROUP_DIFFERENT_EMPLOYER",
            message: i18n.gettext("Cannot add employee '{0}' to employee group '{1}'. Employee and employee group are set for different employers.")
        },
        {
            level: 1,
            code: "EITHER_EMPLOYEE_ID_OR_INCOME_LIST_ID_SHOULD_BE_SET",
            message: i18n.gettext("Either 'employeeId' or 'incomeListId' request parameter should be specified.")
        },
        {
            level: 1,
            code: "EITHER_WEBFORM_OR_DATAFORM_SHOULD_BE_SET_IN_ONBOARDING_FOR_EMPLOYEE",
            message: i18n.gettext("Either Webform or Dataform should be set in Onboarding '{0}' for employee '{1}'.")
        },
        {
            level: 1,
            code: "JUST_INITIATOR_CAN_SUBMIT_THE_RECORD_BY_WORKFLOW",
            message: i18n.gettext("Only initiator can submit the record by workflow.")
        },
        {
            level: 1,
            code: "INCORRECT_WORKFLOW_SETTING_CAN_NOT_FIND_WORKFLOW_DETAIL_FOR_SEQUENCE",
            message: i18n.gettext("Incorrect workflow setting. Cannot find workflow detail for sequence '{0}'.")
        },
        {
            level: 1,
            code: "RECORD_STATE_FOR_THE_FIRST_WORKFLOW_STEP_SHOULD_HAVE_PROPER_STATE",
            message: i18n.gettext("Record state for the first workflow step should be in '{0}'. Found state: '{1}'")
        },
        {
            level: 1,
            code: "BENEFIT_PLANS_TYPE_DOES_NOT_EQUAL_OPEN_ENROLLMENTS_STEP_TYPE",
            message: i18n.gettext("Benefit plan type '{0}' does not equal to open enrollment step type '{1}' in step '{2}'.")
        },
        {
            level: 1,
            code: "RELATIONSHIP_CYCLE_IS_FOUND_FOR_EMPLOYEE",
            message: i18n.gettext("Relationship cycle is found for employee '{0}'.")
        },
        {
            level: 1,
            code: "EMPLOYEE_TERMINATION_IS_FAILED_TERMINATION_DATE_SHOULD_BE_SET",
            message: i18n.gettext("Employee '{0}' termination is failed. Termination Date should be set.")
        },
        {
            level: 1,
            code: "EMPLOYEE_IS_NOT_ALLOWED_TO_BE_SET_AS_A_SUPERVISOR_FOR_EMPLOYEE",
            message: i18n.gettext("Employee '{0}' is not allowed to be set as a supervisor for employee '{1}' in org structure number '{2}'. Allowed supervisors: '{3}'.")
        },
        {
            level: 1,
            code: "EMPLOYEES_SOCIAL_SECURITY_NUMBER_SHOULD_NOT_HAVE_LENGTH_MORE_THAN_ELEVEN",
            message: i18n.gettext("Employee's '{0}' social security number should not be longer than 11 characters.")
        },
        {
            level: 1,
            code: "SOCIAL_SECURITY_NUMBER_FOR_EMPLOYEES_PERSON_CONTACT_SHOULD_NOT_HAVE_LENGTH_MORE_THAN_ELEVEN",
            message: i18n.gettext("Employee '{0}' person contact's social security number should not be longer than 11 characters.")
        },
        {
            level: 1,
            code: "EMPLOYEES_LAST_NAME_SHOULD_NOT_HAVE_LENGTH_MORE_THAN_THIRTY",
            message: i18n.gettext("Employee's '{0}' last name should not be longer than 30 characters.")
        },
        {
            level: 1,
            code: "EMPLOYEES_MIDDLE_NAME_SHOULD_NOT_HAVE_LENGTH_MORE_THAN_THIRTY",
            message: i18n.gettext("Employee's '{0}' middle name should not be longer than 30 characters.")
        },
        {
            level: 1,
            code: "EMPLOYEES_FIRST_NAME_SHOULD_NOT_HAVE_LENGTH_MORE_THAN_THIRTY",
            message: i18n.gettext("Employee's '{0}' first name should not be longer than 30 characters.")
        },
        {
            level: 1,
            code: "EMPLOYEES_SUFFIX_SHOULD_NOT_HAVE_LENGTH_MORE_THAN_FOUR",
            message: i18n.gettext("Employee's '{0}' suffix should not be longer than 4 characters.")
        },
        {
            level: 1,
            code: "EMPLOYEES_GENDER_HAS_INVALID_FORMAT",
            message: i18n.gettext("Employee's '{0}' gender should have value either 'M' or 'F'.")
        },
        {
            level: 1,
            code: "EMPLOYEE_SHOULD_HAVE_MARITAL_STATUS_SET_REQUIRED_FOR_PUERTO_RICO",
            message: i18n.gettext("Employee '{0}' should have marital status set. It is required for Puerto Rico.")
        },
        {
            level: 1,
            code: "REQUEST_BODY_SHOULD_BE_JSON",
            message: i18n.gettext("Request body should be JSON.")
        },
        {
            level: 1,
            code: "REQUEST_BODY_SHOULD_BE_JSON_ARRAY",
            message: i18n.gettext("Request body should be JSON Array.")
        },
        {
            level: 1,
            code: "REQUEST_BODY_SHOULD_BE_A_MULTIPART_FORM_DATA",
            message: i18n.gettext("Request body should be a Multipart form data.")
        },
        {
            level: 1,
            code: "FIRST_EMPLOYEES_TAX_EFFECTIVE_DATE_SHOULD_BE_MORE_OR_EQUAL_EMPLOYEES_HIRE_DATE",
            message: i18n.gettext("First employee's tax effective date should be more or equal employee's hire date.<br/>Employee: '{0}'<br/>Tax number: '{1}'<br/>Geocode: '{2}'<br/>Schdist: '{3}'")
        },
        {
            level: 1,
            code: "TAX_INTERCEPTS_ALREADY_APPROVED_TAXES_BY_START_AND_END_DATES",
            message: i18n.gettext("Tax you're trying to approve intercepts already approved taxes by start and end dates.<br/>Tax number: '{0}'<br/>Geocode: '{1}'<br/>Schdist: '{2}'")
        },
        {
            level: 1,
            code: "TIME_OFF_PERIOD_IS_NOT_FOUND_FOR_ACCRUAL_DATE_AT_ROW",
            message: i18n.gettext("Time Off period is not found for accrual date at row '{0}',")
        },
        {
            level: 1,
            code: "CAN_NOT_FIND_EMPLOYEE_TIME_OFF_PLAN_AT_ROW",
            message: i18n.gettext("Cannot find employee time off plan at row '{0}'.")
        },
        {
            level: 1,
            code: "ACCRUAL_DATE_SHOULD_NOT_BE_BEFORE_RIME_OFF_PLAN_ACCRUAL_DATE_AT_ROW",
            message: i18n.gettext("The accrual date should not be before the time off plan accrual date at row '{0}'.")
        },
        {
            level: 1,
            code: "CAN_NOT_ACCESS_TIME_OFF_FOR_EMPLOYEE_BY_SECURITY_PROFILES",
            message: i18n.gettext("Can't access time off for employee '{0}'. Please check your security profiles.")
        },
        {
            level: 1,
            code: "IT_IS_NOT_ALLOWED_TO_HAVE_SEVERAL_TIME_OFF_PLANS_OF_SAME_TYPE_ON_SAME_DATE_FOR_EMPLOYEE",
            message: i18n.gettext("It is not allowed to have several time off plans of the same type '{0}' on the same date for employee '{1}'.")
        },
        {
            level: 1,
            code: "IT_IS_NOT_ALLOWED_TO_HAVE_SEVERAL_OPENED_TIME_OFF_PLANS_PERIODS",
            message: i18n.gettext("It is not allowed to have several open time off plan periods for plan '{0}', employee '{1}'.")
        },
        {
            level: 1,
            code: "JUST_ONE_TIME_OFF_PLAN_PERIOD_CAN_EXIST_FOR_NON_ACCRUING_TIME_OFF_PLAN_FOR_EMPLOYEE",
            message: i18n.gettext("Only one time off plan period can exist for non accruing time off plan '{0}' for employee '{1}'.")
        },
        {
            level: 1,
            code: "NOT_ALLOWED_TO_HAVE_TIME_OFF_WITHOUT_DETAILS_FOR_EMPLOYEE",
            message: i18n.gettext("It's not allowed to have time off without details for employee '{0}'.")
        },
        {
            level: 1,
            code: "CAN_NOT_ACCESS_TIMESHEET_FOR_EMPLOYEE_BY_SECURITY_PROFILES",
            message: i18n.gettext("Can't access timesheet for employee '{0}'. Please check your security profiles.")
        },
        {
            level: 1,
            code: "ERROR_IS_THROWN_EXTRACTING_ID_FOR_UNAVAILABLE_BLOCK",
            message: i18n.gettext("Error is thrown extracting id from '{0}' for unavailable block.")
        },
        {
            level: 1,
            code: "MULTIPLE_EMPLOYEES_FOUND_FOR_EMPLOYER_AND_PERSON",
            message: i18n.gettext("Multiple employees found for employer '{0}' and person '{1}'.")
        },
        {
            level: 1,
            code: "EMPLOYER_BANK_ACCOUNT_OFFSET_SHOULD_BE_GREATER_THAN_ZERO_AND_LESS_THAN_ELEVEN",
            message: i18n.gettext("Employer bank account offset should be greater than 0 and less than 11.")
        },
        {
            level: 1,
            code: "JUST_ONE_BENEFIT_OPTION_SHOULD_BE_SET_FOR_BENEFIT_PLAN_AND_OPTION",
            message: i18n.gettext("Only one benefit option should be set for benefit plan '{0}', option '{1}'.")
        },
        {
            level: 1,
            code: "JUST_ONE_BENEFIT_OPTION_SHOULD_BE_SET_FOR_BENEFIT_PLAN_OPTION_GROUP_AND_EMPLOYEE",
            message: i18n.gettext("Only one benefit option should be set for benefit plan '{0}', option group '{1}', employee '{2}'.")
        },
        {
            level: 1,
            code: "BENEFIT_PLAN_IS_NOT_FOUND_FOR_EMPLOYER_BY_CODE",
            message: i18n.gettext("Benefit plan is not found for employer '{0}' by code '{1}'.")
        },
        {
            level: 1,
            code: "IT_IS_NOT_ALLOWED_TO_ADD_A_NEW_INACTIVE_EMPLOYER",
            message: i18n.gettext("It is not allowed to add new inactive employer.")
        },
        {
            level: 1,
            code: "INSTRUCTORS_ACTION_IS_NOT_ALLOWED",
            message: i18n.gettext("Instructor's action '{0}' is not allowed.")
        },
        {
            level: 1,
            code: "COURSE_CONTENT_TYPE_IS_NOT_ALLOWED",
            message: i18n.gettext("Course content type '{0}' is not allowed.")
        },
        {
            level: 1,
            code: "COURSE_DOES_NOT_CONTAIN_DOCUMENT",
            message: i18n.gettext("Course '{0}' does not contain document.")
        },
        {
            level: 1,
            code: "IT_IS_NOT_ALLOWED_TO_HAVE_INCOME_WITH_PAY_TYPE",
            message: i18n.gettext("It is not allowed to have income with pay type '{0}'.")
        },
        {
            level: 1,
            code: "CANDIDATES_LIST_SHOULD_NOT_BE_EMPTY",
            message: i18n.gettext("Candidates list should not be empty.")
        },
        {
            level: 1,
            code: "IT_IS_ALLOWED_TO_PROCESS_CANDIDATES_JUST_FOR_ONE_EMPLOYER_PER_REQUEST",
            message: i18n.gettext("It is allowed to process candidates only for one employer per request.")
        },
        {
            level: 1,
            code: "IT_IS_ALLOWED_TO_PROCESS_CANDIDATES_JUST_FOR_ONE_JOB_POSTING_PER_REQUEST",
            message: i18n.gettext("It is allowed to process candidates only for one job posting per request.")
        },
        {
            level: 1,
            code: "RECRUITING_MASS_REJECTION_EMAIL_SHOULD_BE_ADDED_TO_EMAIL_LAYOUTS",
            message: i18n.gettext("Recruiting mass rejection email should be added to email layouts.")
        },
        {
            level: 1,
            code: "CANDIDATE_DOCUMENT_IS_ALREADY_SUBMITTED",
            message: i18n.gettext("Candidate document is already submitted.")
        },
        {
            level: 1,
            code: "CANDIDATE_DOCUMENT_IS_NOT_A_COMPANY_FORM",
            message: i18n.gettext("Candidate document is not a company form.")
        },
        {
            level: 1,
            code: "FIELD_IS_REQUIRED_IN_WEB_FORM",
            message: i18n.gettext("Field '{0}' is required in Web form.")
        },
        {
            level: 1,
            code: "NO_ONE_ACTIVE_BENEFIT_PLAN_IS_FOUND_FOR_OPEN_ENROLLMENT_STEP_BY_BENEFIT_TYPE",
            message: i18n.gettext("No active benefit plan is found for open enrollment step '{0}' by benefit type '{1}'.")
        },
        {
            level: 1,
            code: "PAY_GROUP_IS_NOT_SET_FOR_EMPLOYEE",
            message: i18n.gettext("Pay group '{0}' is not set for employee '{1}'.")
        },
        {
            level: 1,
            code: "NO_ONE_PAY_GROUP_IS_SET_FOR_EMPLOYEE",
            message: i18n.gettext("Pay group is not set for employee '{0}'.")
        },
        {
            level: 1,
            code: "NOT_MORE_THAN_ONE_PAY_GROUP_SHOULD_BE_SET_FOR_EMPLOYEE",
            message: i18n.gettext("Not more than one pay group should be set for employee '{0}'.")
        },
        {
            level: 1,
            code: "EITHER_EMPLOYER_ID_OR_POSITION_ID_OR_EMPLOYEE_ID_SHOULD_BE_SET",
            message: i18n.gettext("Either 'employerId' or 'positionId' or 'employeeId' request parameter should be specified.")
        },
        {
            level: 1,
            code: "CAN_NOT_ACCESS_POSITION_BY_SECURITY_PROFILES",
            message: i18n.gettext("Cannot access position. Please check your security profiles.")
        },
        {
            level: 1,
            code: "EMPLOYER_NAME_TERMINATION_DATE_AND_TERMINATION_REASON_SHOULD_BE_SPECIFIED_IN_CASE_OF_EMPLOYERS_TERMINATION",
            message: i18n.gettext("Employer name, termination date and termination reason should be specified in case of employer's termination.")
        },
        {
            level: 1,
            code: "NO_OCCURRENCES_FOUND_FOR_SHIFT",
            message: i18n.gettext("No occurrences found for shift '{0}'.")
        },
        {
            level: 1,
            code: "CAN_NOT_READ_VALUE_FOR_HEADER_ELEMENT_IN_TEMPLATE",
            message: i18n.gettext("Cannot read value for header element '{0}' in template.")
        },
        {
            level: 1,
            code: "CAN_NOT_LIST_DETAILED_REVIEWS_FOR_AGGREGATED_OPTION_TURNED_ON",
            message: i18n.gettext("Cannot list detailed reviews for aggregated option turned on.")
        },
        {
            level: 1,
            code: "EMPLOYEES_REVIEW_JOURNAL_DOES_NOT_HAVE_ATTACHMENT_SET_FOR_EMPLOYEE",
            message: i18n.gettext("Employee's review journal '{0}' does not have attachment set for employee '{1}'.")
        },
        {
            level: 1,
            code: "EMPLOYEES_REVIEW_JOURNAL_DOES_NOT_HAVE_ATTACHMENT_NAME_SET_FOR_EMPLOYEE",
            message: i18n.gettext("Employee's review journal '{0}' does not have attachment name set for employee '{1}'.")
        },
        {
            level: 1,
            code: "BENEFIT_PLAN_DOES_NOT_HAVE_DOCUMENT_FILE_NAME_SET",
            message: i18n.gettext("Benefit plan '{0}' does not have document file name set.")
        },
        {
            level: 1,
            code: "EITHER_TIMESHEET_ID_OR_TIMESHEET_TYPE_ID_SHOULD_BE_SET",
            message: i18n.gettext("Either 'timesheetId' or 'timesheetTypeId' request parameter should be specified.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_TIMESHEET_FORMAT",
            message: i18n.gettext("Unsupported timesheet format '{0}'.")
        },
        {
            level: 1,
            code: "EITHER_EMPLOYEE_GROUP_IDS_OR_EMPLOYEE_ID_SHOULD_BE_SET",
            message: i18n.gettext("Either 'employeeGroupIds' or 'employeeId' request parameter should be specified.")
        },
        {
            level: 1,
            code: "EITHER_BUTTON_CD_OR_BUTTON_NAME_SHOULD_BE_SET",
            message: i18n.gettext("Either 'buttonCd' or 'buttonName' request parameter should be specified.")
        },
        {
            level: 1,
            code: "EXTERNAL_SYSTEM_IS_NOT_SET",
            message: i18n.gettext("External system '{0}' is not set.")
        },
        {
            level: 1,
            code: "FILE_IDENTIFIER_HAS_EXPIRED",
            message: i18n.gettext("File identifier has expired.")
        },
        {
            level: 1,
            code: "EITHER_CREDIT_OR_DEBIT_AMOUNT_SHOULD_BE_SET",
            message: i18n.gettext("Either credit or debit amount should be set.")
        },
        {
            level: 1,
            code: "FOR_INTERFACE_FILE_ONLY_EXPORT_TO_FILE_URL_SHOULD_BE_USED",
            message: i18n.gettext("For the 'File' interface only export to file URL should be used.")
        },
        {
            level: 1,
            code: "REVIEW_PERIOD_IS_NOT_FOUND_FOR_EMPLOYEE",
            message: i18n.gettext("Review period '{0}' is not found for employee '{1}'.")
        },
        {
            level: 1,
            code: "WORKFLOW_IS_NOT_FOUND_FOR_EMPLOYEE",
            message: i18n.gettext("Workflow '{0}' is not found for employee '{1}'.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_DATA_FORM_FIELD_TYPE",
            message: i18n.gettext("Unsupported Data Form field type '{0}'.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_WEB_FORM_FIELD_TYPE",
            message: i18n.gettext("Unsupported Web Form field type '{0}'.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_COLUMN_TYPE",
            message: i18n.gettext("Unsupported column type '{0}'.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_CELL_TYPE_IS_FOUND",
            message: i18n.gettext("Unsupported cell type is found. Sheet: '{0}'. Row: '{1}'. Column: '{2}'. Type: '{3}'.")
        },
        {
            level: 1,
            code: "CELL_VALUE_IS_REQUIRED_AND_SHOULD_BE_FILLED",
            message: i18n.gettext("Cell value is required and should be filled. Sheet: '{0}'. Row: '{1}'. Column: '{2}'.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_CELL_VALUE_IS_FOUND",
            message: i18n.gettext("Unsupported cell value is found. Sheet: '{0}'. Row: '{1}'. Column: '{2}'.")
        },
        {
            level: 1,
            code: "IT_IS_NOT_ALLOWED_TO_REMOVE_APPROVED_OR_PENDING_APPROVAL_TIMESHEET_TASK",
            message: i18n.gettext("It is not allowed to remove approved or pending approval timesheet task.")
        },
        {
            level: 1,
            code: "API_IS_ALLOWED_TO_BE_USED_ONLY_FOR_HORIZONTAL_TIMESHEETS",
            message: i18n.gettext("This API is allowed to be used only for horizontal timesheets.")
        },
        {
            level: 1,
            code: "API_IS_ALLOWED_TO_BE_USED_ONLY_FOR_VERTICAL_TIMESHEETS",
            message: i18n.gettext("This API is allowed to be used only for vertical timesheets.")
        },
        {
            level: 1,
            code: "IT_IS_NOT_ALLOWED_TO_REMOVE_APPROVED_TIMESHEET_TASK_DETAIL",
            message: i18n.gettext("It is not allowed to remove approved timesheet task detail for employee '{0}'.")
        },
        {
            level: 1,
            code: "IT_IS_NOT_ALLOWED_TO_REMOVE_SUBMITTED_TIMESHEET_TASK_DETAIL",
            message: i18n.gettext("It is not allowed to remove submitted timesheet task detail for employee '{0}'.")
        },
        {
            level: 1,
            code: "IT_IS_NOT_POSSIBLE_TO_HAVE_TIMESHEET_TASK_WITHOUT_DETAILS_FOR_EMPLOYEE",
            message: i18n.gettext("It is not possible to have timesheet task without details for employee '{0}'.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_PAYCODE_DETAIL_STRUCTURE_IS_REQUESTED",
            message: i18n.gettext("Unsupported paycode detail structure is requested.")
        },
        {
            level: 1,
            code: "TIMESHEET_TASK_DETAILS_DATE_IS_NOT_IN_RANGE_OF_TIMESHEETS_START_AND_END_DATES",
            message: i18n.gettext("Timesheet task details' date '{0}' is not in range of timesheet start and end dates: '{1}', '{2}'")
        },
        {
            level: 1,
            code: "THE_INDEED_TOKEN_IS_EXPIRED",
            message: i18n.gettext("The indeed token is expired.")
        },
        {
            level: 1,
            code: "CAN_NOT_IDENTIFY_TENANT_BY_REQUEST",
            message: i18n.gettext("Cannot identify tenant by request.")
        },
        {
            level: 1,
            code: "ENTER_INSTRUCTORS_PASSWORD",
            message: i18n.gettext("Enter instructor's password.")
        },
        {
            level: 1,
            code: "ENTER_INSTRUCTORS_EMAIL",
            message: i18n.gettext("Enter instructor's email.")
        },
        {
            level: 1,
            code: "INSTRUCTORS_ACTION_DOES_NOT_EXIST",
            message: i18n.gettext("Instructor's action '{0}' doesn't exist.")
        },
        {
            level: 1,
            code: "PASSWORD_CHANGE_IS_ALLOWED_JUST_FOR_EXTERNAL_INSTRUCTORS",
            message: i18n.gettext("Password is allowed only for external instructors.")
        },
        {
            level: 1,
            code: "API_REQUEST_SHOULD_CONTAIN_INFORMATION_ABOUT_AUTHORIZED_INSTRUCTOR",
            message: i18n.gettext("API request should contain information about authorized instructor.")
        },
        {
            level: 1,
            code: "API_REQUEST_SHOULD_CONTAIN_INFORMATION_ABOUT_AUTHORIZED_PERSON",
            message: i18n.gettext("API request should contain information about authorized person.")
        },
        {
            level: 1,
            code: "DOCUMENT_TYPE_SHOULD_BE_SET_FOR_QUESTION",
            message: i18n.gettext("Document type should be set for question '{0}'.")
        },
        {
            level: 1,
            code: "CAN_NOT_PARSE_FIELD_AS_TYPE",
            message: i18n.gettext("Cannot parse field '{0}' as type '{1}'.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_TIMESTAMP_FORMAT_FOR_VALUE",
            message: i18n.gettext("Unsupported Timestamp format for value '{0}'.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_LOCAL_TIME_FORMAT_FOR_VALUE",
            message: i18n.gettext("Unsupported LocalTime format for value '{0}'.")
        },
        {
            level: 1,
            code: "PROPERTY_SHOULD_CONTAIN_BINARY_VALUE",
            message: i18n.gettext("Property '{0}' should contain binary value ([01]+) but value '{1}' is found.")
        },
        {
            level: 1,
            code: "BINARY_INT_SIZE_IS_NOT_VALID",
            message: i18n.gettext("Binary Int size is not valid. Expected length '{0}' but '{1}' is found.")
        },
        {
            level: 1,
            code: "PROPERTY_OP_SHOULD_NOT_BE_NULL",
            message: i18n.gettext("Property 'op' should not be 'null'.")
        },
        {
            level: 1,
            code: "UNEXPECTED_JSON_NODE_TYPE_FOR_VALUE",
            message: i18n.gettext("Unexpected JSON Node type for value '{0}'.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_EXPRESSION_BUILDER_OPERATION",
            message: i18n.gettext("Unsupported operation '{0}'.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_EXPRESSION_BUILDER_CONDITION_TYPE",
            message: i18n.gettext("Unsupported condition type '{0}'.")
        },
        {
            level: 1,
            code: "PERSON_IS_NOT_SET_FOR_TENANT",
            message: i18n.gettext("Person is not set for tenant.")
        },
        {
            level: 1,
            code: "COOKIES_WERE_NOT_FOUND_IN_REQUEST",
            message: i18n.gettext("'{0}' cookies were not found in request.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_PDF_FIELD_TYPE",
            message: i18n.gettext("Unsupported PDF field type '{0}'.")
        },
        {
            level: 1,
            code: "IMPORT_TEMPLATE_IS_BROKEN_CAN_NOT_FIND_A_TAX_MAPPING_BY_TAX_NAME",
            message: i18n.gettext("Import template is broken. Cannot find a tax mapping by tax name: '{0}'.")
        },
        {
            level: 1,
            code: "OVERTIME_DETAIL_IS_OUT_OF_SHIFT_RATE_RANGE",
            message: i18n.gettext("Overtime detail is out of shift rate range.")
        },
        {
            level: 1,
            code: "EMPLOYEE_IS_NOT_ALLOWED_TO_BE_SET_IN_ORG_STRUCTURE",
            message: i18n.gettext("Employee '{0}' is not allowed to be set in org structure.")
        },
        {
            level: 1,
            code: "POSITION_IS_NOT_ALLOWED_TO_BE_SET_IN_ORG_STRUCTURE",
            message: i18n.gettext("Position '{0}' is not allowed to be set in org structure.")
        },
        {
            level: 1,
            code: "EMPLOYEE_BELONGS_TO_POSITION_REPORTING_STRUCTURE",
            message: i18n.gettext("Employee '{0}' belongs to Position Reporting Structure.")
        },
        {
            level: 1,
            code: "CYCLED_NODES_FOUND_IN_ORG_STRUCTURE",
            message: i18n.gettext("Cycled nodes found in org structure: '{0}'")
        },
        {
            level: 1,
            code: "UNSUPPORTED_OVERTIME_FUNCTION",
            message: i18n.gettext("Unsupported overtime function '{0}'.")
        },
        {
            level: 1,
            code: "START_AND_END_TIME_SHOULD_BE_SET_IN_HOLIDAY_DETAIL_FOR_ALL_DAY_OPTION_TURNED_OFF",
            message: i18n.gettext("Start and end time should be set in holiday detail in order to turn off the 'All Day' option.")
        },
        {
            level: 1,
            code: "HOURLY_SALARY_OR_UNITS_CALCULATION_METHOD_SHOULD_BE_SET_FOR_THE_INCOME_PAYCODE",
            message: i18n.gettext("Hourly, Salary or Units calculation method should be set for the 'Income' paycode.")
        },
        {
            level: 1,
            code: "HOURLY_CALCULATION_METHOD_SHOULD_BE_SET_FOR_THE_BREAK_PAYCODE",
            message: i18n.gettext("Hourly calculation method should be set for the 'Break' paycode.")
        },
        {
            level: 1,
            code: "IMPORT_TEMPLATE_MUST_INCLUDE_EITHER_EMPLOYEE_NUMBER_OR_SSN_COLUMN",
            message: i18n.gettext("Import template must include either 'Employee Number' or 'Social Security Number' column.")
        },
        {
            level: 1,
            code: "CAN_NOT_ADD_INCOME_FOR_MULTIPLE_SECONDARY_ASSIGNMENTS_WITH_SAME_TITLE_TO_EMPLOYEE",
            message: i18n.gettext("Cannot add income for multiple secondary assignments with the same title to employee '{0}'.")
        },
        {
            level: 1,
            code: "CAN_NOT_FIND_ACTIVE_DEDUCTION_FOR_EMPLOYEE",
            message: i18n.gettext("Cannot find active deduction '{0}' for employee '{1}'.")
        },
        {
            level: 1,
            code: "CAN_NOT_GET_TAXABLE_WAGES_AMOUNT_ON_TAXES_SHEET",
            message: i18n.gettext("Cannot get taxable wages amount on taxes sheet. Row: '{0}'. Column: '{1}'.")
        },
        {
            level: 1,
            code: "CAN_NOT_GET_SUBJECT_WAGES_AMOUNT_ON_TAXES_SHEET",
            message: i18n.gettext("Cannot get subject wages amount on taxes sheet. Row: '{0}'. Column: '{1}'.")
        },
        {
            level: 1,
            code: "CAN_NOT_CONVERT_TAX_NUMBER_IT_SHOULD_BE_NUMERIC",
            message: i18n.gettext("Cannot convert tax number '{0}'. It should have a numeric value.")
        },
        {
            level: 1,
            code: "THERE_IS_NO_TAX_FOUND_BY_DESCRIPTION",
            message: i18n.gettext("There is no tax found by description '{0}'.")
        },
        {
            level: 1,
            code: "PERSON_NO_RESIDENT_GEOCODE",
            message: i18n.gettext("Person {0} doesn't have resident geocode.")
        },
        {
            level: 1,
            code: "CAN_NOT_FIND_PERSON_CONTACT_FOR_PERSON_BY_SSN",
            message: i18n.gettext("Cannot find person contact for person '{0}' by Social Security Number '{1}'.")
        },
        {
            level: 1,
            code: "CAN_NOT_FIND_PERSON_CONTACT_FOR_PERSON_BY_NAME",
            message: i18n.gettext("Cannot find person contact for person '{0}' by name '{1}'.")
        },
        {
            level: 1,
            code: "EITHER_PERSON_CONTACT_SSN_OR_NAME_SHOULD_BE_SET_IN_TEMPLATE_FOR_PERSON",
            message: i18n.gettext("Either person contact ssn or name should be provided in template for person '{0}'.")
        },
        {
            level: 1,
            code: "SECURITY_PROFILES_FOR_PERSON_SHOULD_BE_SET",
            message: i18n.gettext("Security profiles for person '{0}' should be set.")
        },
        {
            level: 1,
            code: "SEARCHSTR_REQUEST_PARAMETER_SHOULD_BE_SPECIFIED",
            message: i18n.gettext("'searchStr' request parameter should be specified.")
        },
        {
            level: 1,
            code: "CAN_NOT_ACCESS_PERSON_OR_TIMEZONE_FOR_EMPLOYEE_BY_SECURITY_PROFILES",
            message: i18n.gettext("Can't access person or time zone for employee '{0}'. Please check your security profiles.")
        },
        {
            level: 1,
            code: "CAN_NOT_FIND_PERSON_BY_SOCIAL_SECURITY_NUMBER",
            message: i18n.gettext("Cannot find person by Social Security Number '{0}'.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_PERFORMANCE_REVIEW_FREQUENCY_CODE",
            message: i18n.gettext("Unsupported performance review frequency code: '{0}'.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_REVIEW_TYPE",
            message: i18n.gettext("Unsupported review type code: '{0}'.")
        },
        {
            level: 1,
            code: "IT_IS_NOT_ALLOWED_TO_UPDATE_STANDARD_REPORT",
            message: i18n.gettext("It is not allowed to update standard report '{0}'.")
        },
        {
            level: 1,
            code: "REPORTS_FILE_NAME_SHOULD_NOT_BE_EMPTY",
            message: i18n.gettext("Report's file name should not be empty.")
        },
        {
            level: 1,
            code: "REPORT_IS_NOT_FOUND_BY_FILE_NAME",
            message: i18n.gettext("Report is not found by file name '{0}'.")
        },
        {
            level: 1,
            code: "EXPECTED_REPORT_ORDER_BY_KEY_IS_NOT_FOUND_IN_ALLOWED_ORDER_BY_OPTIONS_LIST",
            message: i18n.gettext("Expected report orderBy key '{0}' is not found in allowed orderBy options list '{1}'.")
        },
        {
            level: 1,
            code: "EXPECTED_REPORT_GROUP_BY_KEY_IS_NOT_FOUND_IN_ALLOWED_GROUP_BY_OPTIONS_LIST",
            message: i18n.gettext("Expected report groupBy key '{0}' is not found in allowed groupBy options list '{1}'.")
        },
        {
            level: 1,
            code: "EXPECTED_REPORT_ORDER_BY_PARAMETERS_SIZE_DOES_NOT_EQUAL_ACTUAL",
            message: i18n.gettext("Expected report orderBy parameters size '{0}' does not equal actual '{1}'.")
        },
        {
            level: 1,
            code: "EXPECTED_REPORT_GROUP_BY_PARAMETERS_SIZE_DOES_NOT_EQUAL_ACTUAL",
            message: i18n.gettext("Expected report groupBy parameters size '{0}' does not equal actual '{1}'.")
        },
        {
            level: 1,
            code: "CAN_NOT_PARSE_FILTER_VALUE_AS_BOOLEAN",
            message: i18n.gettext("Cannot parse '{0}' filter value as Boolean.")
        },
        {
            level: 1,
            code: "CAN_NOT_PARSE_FILTER_VALUE_AS_INTEGER",
            message: i18n.gettext("Cannot parse '{0}' filter value as Integer.")
        },
        {
            level: 1,
            code: "CAN_NOT_PARSE_FILTER_VALUE_AS_DOUBLE",
            message: i18n.gettext("Cannot parse '{0}' filter value as Double.")
        },
        {
            level: 1,
            code: "CAN_NOT_PARSE_FILTER_VALUE_AS_CODE_TABLE_DETAIL_VALUE",
            message: i18n.gettext("Cannot parse '{0}' filter value as Code Table Detail value.")
        },
        {
            level: 1,
            code: "CAN_NOT_PARSE_FILTER_VALUE_AS_TYPE",
            message: i18n.gettext("Cannot parse '{0}' filter value as '{1}' type.")
        },
        {
            level: 1,
            code: "ACCESS_DENIED_IT_IS_NOT_ALLOWED_TO_RUN_REPORTS_GENERATION_FOR_EMPLOYEE",
            message: i18n.gettext("Access denied. It is not allowed to run report generation for employee '{0}'.")
        },
        {
            level: 1,
            code: "NEXT_REVIEW_DATE_SHOULD_BE_SET_FOR_REVIEWED_EMPLOYEE",
            message: i18n.gettext("Next review date should be set for reviewed employee '{0}'.")
        },
        {
            level: 1,
            code: "NO_ONE_SUPERVISOR_IS_FOUND_FOR_RERVIEW_PERIOD",
            message: i18n.gettext("No supervisor is found for review period.")
        },
        {
            level: 1,
            code: "JUST_SELF_AND_MANAGER_REVIEW_TYPES_ARE_SUPPORTED_BY_NON_360_REVIEWS",
            message: i18n.gettext("Only 'Self' and 'Manager' review types are supported by non-360 reviews.")
        },
        {
            level: 1,
            code: "WORKFLOW_SHOULD_BE_CONFIGURED_FOR_REVIEW_PERIOD",
            message: i18n.gettext("Workflow should be configured for review period '{0}'.")
        },
        {
            level: 1,
            code: "PERIOD_END_SHOULD_BE_DEFINED_IN_REVIEW_PERIOD",
            message: i18n.gettext("Period end should be defined in review period '{0}'.")
        },
        {
            level: 1,
            code: "DURATION_SHOULD_BE_SET_IN_REVIEW_PERIOD_OF_TYPE",
            message: i18n.gettext("Duration should be set in review period '{0}' of '{1}' type.")
        },
        {
            level: 1,
            code: "PERIOD_START_DATE_WAS_NOT_CALCULATED_FOR_EMPLOYEE",
            message: i18n.gettext("Period start date was not calculated for employee '{0}'. Please check formula.")
        },
        {
            level: 1,
            code: "TIME_FORMAT_IS_NOT_VALID_FOR_RULE",
            message: i18n.gettext("Time format '{0}' is not valid  for rule '{1}'. Hours should be in range [0,23], minutes should be in range [0,59].")
        },
        {
            level: 1,
            code: "TOTAL_HOURS_FORMAT_IS_NOT_VALID_FOR_RULE",
            message: i18n.gettext("Total hours format '{0}' is not valid for rule '{1}'.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_RULE",
            message: i18n.gettext("Unsupported rule '{0}'.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_VALUE_FOR_GRADE_TYPE",
            message: i18n.gettext("Unsupported value '{0}' for grade type. It should be 0 for Grade-Step or 1 for Grade-Only.")
        },
        {
            level: 1,
            code: "SANDBOX_IS_NOT_SET_FOR_TENANT",
            message: i18n.gettext("Sandbox is not set for your tenant.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_RECURRENCE_TYPE_IN_SCHEDULE",
            message: i18n.gettext("Unsupported recurrence type '{0}' in schedule '{1}'.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_TASK_TYPE_IN_SCHEDULE",
            message: i18n.gettext("Unsupported task type '{0}' in schedule '{1}'.")
        },
        {
            level: 1,
            code: "REPORT_SHOULD_BE_SET_IN_TASK_FOR_SCHEDULE",
            message: i18n.gettext("Report should be set in task for schedule '{0}'.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_RECIPIENT_TYPE_IN_SCHEDULE",
            message: i18n.gettext("Unsupported recipient type '{0}' in schedule '{1}'.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_SYSTEM_TASK_TYPE_IN_SCHEDULE",
            message: i18n.gettext("Unsupported system task type '{0}' in schedule '{1}'.")
        },
        {
            level: 1,
            code: "MONTH_SHOULD_BE_SET_IN_SCHEDULE",
            message: i18n.gettext("Month should be set in schedule '{0}'.")
        },
        {
            level: 1,
            code: "MONTH_DAY_SHOULD_BE_SET_IN_SCHEDULE",
            message: i18n.gettext("Month day should be set in schedule '{0}'.")
        },
        {
            level: 1,
            code: "NO_ACCESS_TO_REQUIRED_FIELDS",
            message: i18n.gettext("You don't have access to required '{0}' fields. Please verify your security role permissions.")
        },
        {
            level: 1,
            code: "YOU_ARE_NOT_ALLOWED_TO_MEMORIZE_REPORT",
            message: i18n.gettext("You are not allowed to memorize report '{0}'. Please verify your security role permissions.")
        },
        {
            level: 1,
            code: "FILE_WAS_NOT_UPLOADED_TO_TARGET_SERVER",
            message: i18n.gettext("File '{0}' was not uploaded to target server")
        },
        {
            level: 1,
            code: "DIRECTORY_PATH_WAS_NOT_FOUND_ON_TARGET_SERVER",
            message: i18n.gettext("Directory path '{0}' was not found on target server")
        },
        {
            level: 1,
            code: "SHIFT_RATE_DETAIL_START_TIME_SHOULD_BE_BEFORE_END_TIME",
            message: i18n.gettext("Shift rate detail start time '{0}' should be before end time '{1}'.")
        },
        {
            level: 1,
            code: "WRONG_FIELDS_AND_TABLES_SEQUENCE",
            message: i18n.gettext("Wrong fields and tables sequence.")
        },
        {
            level: 1,
            code: "SECOND_FA_SEED_IS_NOT_SET",
            message: i18n.gettext("2fa seed is not set.")
        },
        {
            level: 1,
            code: "COUNTRY_SHOULD_BE_SET_IN_WORK_LOCATION",
            message: i18n.gettext("Country should be set in work location '{0}'.")
        },
        {
            level: 1,
            code: "WRONG_TABLE_ALIAS_FORMAT",
            message: i18n.gettext("Wrong table alias '{0}' format.")
        },
        {
            level: 1,
            code: "VALUE_DOES_NOT_MATCH_VALIDATION_FORMULA",
            message: i18n.gettext("Value '{0}' does not match validation formula '{1}'.")
        },
        {
            level: 1,
            code: "GEOCODE_SHOULD_BE_SET_FOR_TAX_COLUMN",
            message: i18n.gettext("Geocode should be set for tax column '{0}'.")
        },
        {
            level: 1,
            code: "SCHDIST_SHOULD_BE_SET_FOR_TAX_COLUMN",
            message: i18n.gettext("Schdist should be set for tax column '{0}'.")
        },
        {
            level: 1,
            code: "UNABLE_TO_READ_HEADER_ON_TAXES_SHEET_STARTING_COLUMN",
            message: i18n.gettext("Unable to read header on the 'Taxes' sheet starting '{0}' column.")
        },
        {
            level: 1,
            code: "EITHER_IS_IN_WITH_TIME_OR_HOURS_REQUEST_PARAMETERS_SHOULD_BE_SET",
            message: i18n.gettext("Either 'isIn' with 'time' or 'hours' request parameters should be specified.")
        },
        {
            level: 1,
            code: "EMPLOYEE_CAN_NOT_BE_PUNCHED_OUT",
            message: i18n.gettext("Employee '{0}' can not be punched out.")
        },
        {
            level: 1,
            code: "ASSIGNMENT_IS_NOT_FOUND_FOR_EMPLOYEE",
            message: i18n.gettext("Assignment '{0}' is not found for employee '{1}'.")
        },
        {
            level: 1,
            code: "PAYCODE_IS_NOT_FOUND_FOR_EMPLOYEE",
            message: i18n.gettext("Paycode '{0}' is not found for employee '{1}'.")
        },
        {
            level: 1,
            code: "IT_IS_NOT_ALLOWED_TO_REMOVE_SYSTEM_TE_DEDUCTION",
            message: i18n.gettext("It is not allowed to remove system TeDeduction.")
        },
        {
            level: 1,
            code: "IT_IS_NOT_ALLOWED_TO_UPDATE_SYSTEM_TE_DEDUCTION",
            message: i18n.gettext("It is not allowed to update system TeDeduction.")
        },
        {
            level: 1,
            code: "MAX_AMOUNT_SHOULD_BE_SET_IN_CUSTOM_TE_DEDUCTION",
            message: i18n.gettext("'Max amount' should be set in custom TeDeduction.")
        },
        {
            level: 1,
            code: "IT_IS_NOT_ALLOWED_TO_REMOVE_SYSTEM_TE_INCOME",
            message: i18n.gettext("It is not allowed to remove system TeIncome.")
        },
        {
            level: 1,
            code: "IT_IS_NOT_ALLOWED_TO_UPDATE_SYSTEM_TE_INCOME",
            message: i18n.gettext("It is not allowed to update system TeIncome.")
        },
        {
            level: 1,
            code: "COMP_TYPE_SHOULD_BE_SET_IN_CUSTOM_TE_INCOME",
            message: i18n.gettext("'Comp type' should be set in custom TeIncome.")
        },
        {
            level: 1,
            code: "NOT_ALL_REQUIRED_PARAMETERS_WERE_FOUND_FOR_EMPLOYEE_TERMINATION",
            message: i18n.gettext("Not all required parameters were found for employee termination. '{0}' needed.")
        },
        {
            level: 1,
            code: "START_AMOUNT_IS_REQUIRED_IN_TE_TAX_RATE",
            message: i18n.gettext("'start amount' is required in TeTaxRate.")
        },
        {
            level: 1,
            code: "IT_IS_NOT_ALLOWED_TO_ADD_TIME_OFF_PLAN_TO_EMPLOYEE",
            message: i18n.gettext("It is not allowed to add time off plan '{0}' to employee '{1}'.")
        },
        {
            level: 1,
            code: "TIME_OFF_PLAN_DOES_NOT_HAVE_OPENED_PERIODS_FOR_EMPLOYEE",
            message: i18n.gettext("Time off plan '{0}' does not have open periods for employee '{1}'.")
        },
        {
            level: 1,
            code: "ACCRUAL_DATE_SHOULD_BE_SET_FOR_ACCRUING_PLAN_FOR_EMPLOYEE",
            message: i18n.gettext("Accrual date should be set for accruing plan '{0}' for employee '{1}'.")
        },
        {
            level: 1,
            code: "TIMESHEET_CAN_NOT_START_ON_DATE_BY_PAY_GROUP_AND_FREQUENCY",
            message: i18n.gettext("Timesheet can't start on '{0}'<br/>Pay group day of month: '{1}'<br/>Frequency: '{2}'")
        },
        {
            level: 1,
            code: "IT_IS_NOT_ALLOWED_TO_DEFINE_ACCRUAL_PERIODS_FOR_TIME_OFF_PLAN_OF_ACCRUAL_PERIOD_CODE",
            message: i18n.gettext("It is not allowed to define accrual periods for time off plan of accrual period code '{0}'.")
        },
        {
            level: 1,
            code: "IT_IS_NOT_ALLOWED_TO_DEFINE_ACCRUAL_PERIODS_FOR_TIME_OFF_PLAN_OF_ACCRUAL_METHOD_TYPE_CODE",
            message: i18n.gettext("It is not allowed to define accrual periods for time off plan of accrual method type code '{0}'.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_SET_OF_PARAMETERS_FOR_ACCRUAL_ANNUAL_PERIODS_DEFINING",
            message: i18n.gettext("Unsupported set of parameters for accrual annual periods definition<br/>Accrual method type code: '{0}'<br/>Year end day: '{1}'<br/>Year end month: '{2}'")
        },
        {
            level: 1,
            code: "TIME_OFF_PLAN_YEAR_END_CONFIGURATION_ISSUE",
            message: i18n.gettext("Time off plan configuration issue. Year end '{0}' should have '{1}' end day of week, but '{2}' is found.")
        },
        {
            level: 1,
            code: "TIME_OFF_PLAN_PERIOD_END_DATES_DAY_OF_WEEK_DOES_NOT_ALIGN_WITH_ACCRUAL_PERIOD_END_DATE_DAY_OF_WEEK_FOR_WEEKLY_PERIOD",
            message: i18n.gettext("Time off plan period end date '{0}' day of week '{1}' does not align with accrual period end date day of week '{2}' for a weekly period.")
        },
        {
            level: 1,
            code: "BI_WEEKLY_TIME_OFF_PLAN_YEAR_END_CONFIGURATION_ISSUE",
            message: i18n.gettext("Bi-Weekly time off plan configuration issue. Year end '{0}' should have day of week '{1}' with 'Is Odd Week' set to '{2}', but has day of week '{3}' with 'Is Odd Week' set to '{4}'.")
        },
        {
            level: 1,
            code: "BI_WEEKLY_TIME_OFF_PLAN_PERIOD_YEAR_END_CONFIGURATION_ISSUE_BY_ACCRUAL_PERIODS_END_DATE",
            message: i18n.gettext("Time off plan period end date '{0}' day of week '{1}' does not align with accrual period end date day of week '{2}' for a Bi-Weekly period with 'Is Odd Week' option set to '{3}' in '{4}' year.")
        },
        {
            level: 1,
            code: "TIME_OFF_PLAN_PERIOD_END_DATE_DOES_NOT_ALIGN_WITH_ACCRUAL_PERIOD_END_DATE_IN_AN_ANNUAL_PERIOD",
            message: i18n.gettext("Time off plan period end date '{0}' does not align with accrual period end date '{1}' in an annual period.")
        },
        {
            level: 1,
            code: "IT_IS_NOT_ALLOWED_TO_REMOVE_CLOSED_TIME_OFF_PLAN_PERIOD_FOR_PLAN",
            message: i18n.gettext("It is not allowed to remove closed time off plan period for plan '{0}'.")
        },
        {
            level: 1,
            code: "TOTAL_ACCRUED_VALUE_SHOULD_NOT_BE_LESS_THAN_ZERO",
            message: i18n.gettext("Total accrued value '{0}' should not be less than 0.")
        },
        {
            level: 1,
            code: "IT_IS_NOT_ALLOWED_TO_HAVE_AN_ACCRUAL_DATE_BEFORE_PERIODS_START_DATE",
            message: i18n.gettext("It is not allowed to have an accrual date '{0}' before period start date '{1}'.")
        },
        {
            level: 1,
            code: "ACCRUAL_DATE_SHOULD_BE_IN_PERIODS_DATE_RANGE_BETWEEN_PERIODS_DATES",
            message: i18n.gettext("Accrual date '{0}' should be in period date range between '{1}' and '{2}'.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_TIME_OFF_PLANS_METHOD_TYPE_WITH_YEAR",
            message: i18n.gettext("Unsupported time off plan method type '{0}' with year '{1}'.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_YEAR_END_FORMAT",
            message: i18n.gettext("Unsupported year end format for '{0}'. Pattern should be 'MM-dd'.")
        },
        {
            level: 1,
            code: "IT_IS_NOT_ALLOWED_TO_ACCRUE_TIME_OFF_PLAN_TO_PREVIOUS_DATES",
            message: i18n.gettext("It is not allowed to accrue time off plan to previous dates. Last accrual date: '{0}'. Selected accrual date: '{1}'.")
        },
        {
            level: 1,
            code: "START_DATE_CUSTOM_ID_SHOULD_BE_SET_IN_TIMESHEET_LAYOUT_FOR_CUSTOM_FREQUENCY",
            message: i18n.gettext("'Start date custom id' should be set in timesheet layout for custom frequency.")
        },
        {
            level: 1,
            code: "TIMESHEET_CAN_NOT_HAVE_END_DATE_FOR_PAY_GROUP_DAY_OF_MONTH_AND_FREQUENCY",
            message: i18n.gettext("Timesheet cannot have end date '{0}' for pay group day of month set to '{1}' with '{2}' frequency.")
        },
        {
            level: 1,
            code: "TIMESHEET_CAN_NOT_HAVE_START_DATE_FOR_PAY_GROUP_DAY_OF_MONTH_AND_FREQUENCY",
            message: i18n.gettext("Timesheet cannot have start date '{0}' for pay group day of month set to '{1}' with '{2}' frequency.")
        },
        {
            level: 1,
            code: "NEXT_TIMESHEET_CAN_NOT_HAVE_START_DATE_FOR_PAY_GROUP_DAY_OF_MONTH_AND_FREQUENCY",
            message: i18n.gettext("Next timesheet cannot have start date '{0}' for pay group day of month set to '{1}' with '{2}' frequency.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_TIMESHEET_LAYOUT_TYPE_IS_SET_IN_LAYOUT",
            message: i18n.gettext("Unsupported timesheet layout type is set '{0}' in layout '{1}'.")
        },
        {
            level: 1,
            code: "AUTO_ALLOCATE_TASKS_LIST_SHOULD_NOT_BE_EMPTY",
            message: i18n.gettext("Auto allocate tasks list should not be empty.")
        },
        {
            level: 1,
            code: "IT_IS_NOT_ALLOWED_TO_HAVE_MORE_THAN_ONE_TIMESHEET_TASK_DETAIL_FOR_SAME_TIME_OFF_TASK_DETAIL",
            message: i18n.gettext("It is not allowed to have more than one timesheet task detail for the same time off task detail.")
        },
        {
            level: 1,
            code: "EMPLOYEE_CAN_NOT_HAVE_MORE_THAN_ONE_STARTED_BREAK",
            message: i18n.gettext("Employee '{0}' can't have more than 1 started breaks.")
        },
        {
            level: 1,
            code: "EMPLOYEES_TIMESHEET_CAN_NOT_HAVE_MORE_THAN_ONE_NON_STARTED_TASKS_ON_SAME_DATE",
            message: i18n.gettext("Timesheet of employee '{0}' cannot have more than 1 non-started tasks on the same date '{1}'.")
        },
        {
            level: 1,
            code: "CAN_NOT_FIND_TIMESHEET_FOR_EMPLOYEE",
            message: i18n.gettext("Cannot find timesheet for employee '{0}'.")
        },
        {
            level: 1,
            code: "CURRENT_TIMESHEET_SHOULD_NOT_BE_THE_LAST_TIMESHEET_FOR_EMPLOYEE",
            message: i18n.gettext("Current timesheet should not be the last timesheet for employee '{0}'.")
        },
        {
            level: 1,
            code: "ONLY_ONE_TIMESHEET_TASK_DETAIL_CAN_BE_ADDED_TO_TIMESHET_TASK_PER_DATE_FOR_EMPLOYEE",
            message: i18n.gettext("Only one timesheet task detail can be added to timesheet task per date '{0}' for employee '{1}'.")
        },
        {
            level: 1,
            code: "CAN_NOT_STOP_NOT_STARTED_TIMER_IN_TIMESHEET",
            message: i18n.gettext("Cannot stop timer in timesheet. It was not started.")
        },
        {
            level: 1,
            code: "TIMERS_STOP_TIME_CAN_NOT_BE_LESS_THAN_START_TIME",
            message: i18n.gettext("Timer's stop time '{0}' cannot be less than start time '{1}'.")
        },
        {
            level: 1,
            code: "TOKEN_IS_NOT_SUPPORTED_BY_EXPRESSION_BUILDER",
            message: i18n.gettext("Token '{0}' is not supported by expression builder.")
        },
        {
            level: 1,
            code: "CREATE_STATIC_TOKEN_TO_USE_TRANSFORMATIONS",
            message: i18n.gettext("Please create static token to use transformations.")
        },
        {
            level: 1,
            code: "CREATE_STATIC_TOKEN_TO_USE_VERTEX_PROXY",
            message: i18n.gettext("Please create static token to use Vetrex proxy.")
        },
        {
            level: 1,
            code: "THE_DIRECTORIES_TREE_CAN_NOT_BE_BUILT",
            message: i18n.gettext("The directories tree cannot be built.")
        },
        {
            level: 1,
            code: "CYCLE_IS_DETECTED_WHILE_BUILDING_DIRECTORIES_TREE",
            message: i18n.gettext("Cycle is detected while building directories tree.")
        },
        {
            level: 1,
            code: "CAN_NOT_REMOVE_ITEM_IN_DIRECTORIES_TREE",
            message: i18n.gettext("Cannot remove item in directories tree.")
        },
        {
            level: 1,
            code: "CUSTOM_VALUE_WITH_LABEL_TWN_SHOULD_BE_SET_FOR_EMPLOYER",
            message: i18n.gettext("Custom value with label 'TWN' should be set for employer '{0}'.")
        },
        {
            level: 1,
            code: "VALUE_SHOULD_NOT_BE_LONGER_THAN_SPECIFIED_CHARACTERS",
            message: i18n.gettext("Value '{0}' should not be longer than '{1}' characters.")
        },
        {
            level: 1,
            code: "EMPLOYEE_DOES_NOT_HAVE_ANY_PAYROLLS",
            message: i18n.gettext("Employee '{0} 'does not have any payrolls.")
        },
        {
            level: 1,
            code: "UNEXPECTED_CELL_TYPE_IS_FOUND",
            message: i18n.gettext("Unexpected cell type is found. Sheet: '{0}'. Row: '{1}'. Column: '{2}'.")
        },
        {
            level: 1,
            code: "UNEXPECTED_CELL_VALUE_IS_FOUND",
            message: i18n.gettext("Unexpected cell value is found. Sheet: '{0}'. Row: '{1}'. Column: '{2}'.")
        },
        {
            level: 1,
            code: "TOTAL_SPLITTED_MINUTES_SHOULD_EQUAL_OR_BE_LESS_THAN_TRACKED_MINUTES",
            message: i18n.gettext("Total splitted minutes '{0}' should equal or be less than tracked minutes '{1}'.")
        },
        {
            level: 1,
            code: "TIMERS_STOPPED_TIME_DATE_DOES_NOT_EQUAL_STARTED_TIME_DATE",
            message: i18n.gettext("Timer's stopped time date '{0}' does not equal to started time date '{1}'.")
        },
        {
            level: 1,
            code: "TIMESHEETS_END_DATE_CAN_NOT_BE_BEFORE_START_DATE_FOR_EMPLOYEE",
            message: i18n.gettext("Timesheet's end date '{0}' cannot be before start date '{1}' for employee '{2}'.")
        },
        {
            level: 1,
            code: "IT_IS_NOT_ALLOWED_TO_STOP_TIMER_FOR_A_TIMESHEET_IN_STATUS_FOR_EMPLOYEE",
            message: i18n.gettext("It is not allowed to stop timer for a timesheet in '{0}' status for employee '{1}'.")
        },
        {
            level: 1,
            code: "IT_IS_ALLOWED_TO_STOP_THE_TIMER_ONLY_FOR_REGULAR_HOURS_AND_BREAK_PAYCODES",
            message: i18n.gettext("It is allowed to stop the timer only for 'Regular hours' or 'Break' paycodes.")
        },
        {
            level: 1,
            code: "OBLIGEES_SSN_SHOULD_NOT_HAVE_LENGTH_MORE_THAN_11",
            message: i18n.gettext("Obligee's SSN '{0}' should not be longer than 11 characters.")
        },
        {
            level: 1,
            code: "OBLIGEES_FIRST_NAME_SHOULD_NOT_HAVE_LENGTH_MORE_THAN_25",
            message: i18n.gettext("Obligee's first name '{0}' should not be longer than 25 characters.")
        },
        {
            level: 1,
            code: "OBLIGEES_LAST_NAME_SHOULD_NOT_HAVE_LENGTH_MORE_THAN_35",
            message: i18n.gettext("Obligee's last name '{0}' should not be longer than 35 characters.")
        },
        {
            level: 1,
            code: "OBLIGEES_MIDDLE_NAME_SHOULD_NOT_HAVE_LENGTH_MORE_THAN_25",
            message: i18n.gettext("Obligee's middle name '{0}' should not be longer than 25 characters.")
        },
        {
            level: 1,
            code: "PAYEES_NAME_SHOULD_NOT_HAVE_LENGTH_MORE_THAN_30",
            message: i18n.gettext("Payees's name '{0}' should not be longer than 30 characters.")
        },
        {
            level: 1,
            code: "PAYEES_ALTERNAME_NAME_SHOULD_NOT_HAVE_LENGTH_MORE_THAN_30",
            message: i18n.gettext("Payees's alternate name '{0}' should not be longer than 30 characters.")
        },
        {
            level: 1,
            code: "PAYEES_CODE_SHOULD_NOT_HAVE_LENGTH_MORE_THAN_9",
            message: i18n.gettext("Payees's code '{0}' should not be longer than 9 characters.")
        },
        {
            level: 1,
            code: "PAYEES_ADRRESS_1_SHOULD_NOT_HAVE_LENGTH_MORE_THAN_30",
            message: i18n.gettext("Payees's address 1 '{0}' should not be longer than 30 characters.")
        },
        {
            level: 1,
            code: "PAYEES_ADRRESS_2_SHOULD_NOT_HAVE_LENGTH_MORE_THAN_30",
            message: i18n.gettext("Payees's address 2 '{0}' should not be longer than 30 characters.")
        },
        {
            level: 1,
            code: "PAYEES_CITY_SHOULD_NOT_HAVE_LENGTH_MORE_THAN_22",
            message: i18n.gettext("Payees's city '{0}' should not be longer than 22 characters.")
        },
        {
            level: 1,
            code: "PAYEES_STATE_SHOULD_NOT_HAVE_LENGTH_MORE_THAN_2",
            message: i18n.gettext("Payees's state '{0}' should not be longer than 2 characters.")
        },
        {
            level: 1,
            code: "PAYEES_ZIP_CODE_IS_REQUIRED",
            message: i18n.gettext("Payees's zip code is required.")
        },
        {
            level: 1,
            code: "PAYEES_ZIPCODE_SHOULD_NOT_HAVE_LENGTH_MORE_THAN_5",
            message: i18n.gettext("Payees's zip code '{0}' should not be longer than 5 characters.")
        },
        {
            level: 1,
            code: "PAYEES_ZIPEXT_SHOULD_NOT_HAVE_LENGTH_MORE_THAN_4",
            message: i18n.gettext("Payees's zip ext '{0}' should not be longer than 4 characters.")
        },
        {
            level: 1,
            code: "EMPLOYERS_BANK_NAME_SHOULD_NOT_HAVE_LENGTH_MORE_THAN_30",
            message: i18n.gettext("Employer's bank name '{0}' should not be longer than 30 characters.")
        },
        {
            level: 1,
            code: "EMPLOYERS_BANK_ACCOUNT_SHOULD_NOT_HAVE_LENGTH_MORE_THAN_17",
            message: i18n.gettext("Employer's bank account '{0}' should not be longer than 17 characters.")
        },
        {
            level: 1,
            code: "EMPLOYERS_BANK_ROUTING_NUMBER_SHOULD_NOT_HAVE_LENGTH_MORE_THAN_9",
            message: i18n.gettext("Employer's bank routing number '{0}' should not be longer than 9 characters.")
        },
        {
            level: 1,
            code: "WAGE_ORDERS_JURISDICTION_STATE_SHOULD_NOT_HAVE_LENGTH_MORE_THAN_2",
            message: i18n.gettext("Wage order's jurisdiction state '{0}' should not be longer than 2 characters.")
        },
        {
            level: 1,
            code: "WAGE_ORDERS_JURISDICTION_COUNTY_SHOULD_NOT_HAVE_LENGTH_MORE_THAN_22",
            message: i18n.gettext("Wage order's jurisdiction county '{0}' should not be longer than 22 characters.")
        },
        {
            level: 1,
            code: "WAGE_ORDERS_FIPS_CODE_SHOULD_NOT_HAVE_LENGTH_MORE_THAN_7",
            message: i18n.gettext("Wage order's fips code '{0}' should not be longer than 7 characters.")
        },
        {
            level: 1,
            code: "WAGE_ORDERS_MEMO_1_SHOULD_NOT_HAVE_LENGTH_MORE_THAN_40",
            message: i18n.gettext("Wage order's memo 1 '{0}' should not be longer than 40 characters.")
        },
        {
            level: 1,
            code: "WAGE_ORDERS_MEMO_2_SHOULD_NOT_HAVE_LENGTH_MORE_THAN_40",
            message: i18n.gettext("Wage order's memo 2 '{0}' should not be longer than 40 characters.")
        },
        {
            level: 1,
            code: "WEB_FORM_FIELD_OF_IMAGE_TYPE_SHOULD_CONTAIN_DATA_PROPERTY",
            message: i18n.gettext("Webform field of the 'Image' type should contain the 'data' property.")
        },
        {
            level: 1,
            code: "RADIOBUTTON_VALUE_WAS_NOT_FOUND_FOR_WIDGET",
            message: i18n.gettext("RadioButton value was not found for widget '{0}'.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_WIDGET_TYPE",
            message: i18n.gettext("Unsupported widget type '{0}'.")
        },
        {
            level: 1,
            code: "POSTAL_CODE_SHOULD_HAVE_LENGTH_EITHER_5_OR_9",
            message: i18n.gettext("Postal code '{0}' should be either 5 or 9 characters long.")
        },
        {
            level: 1,
            code: "UNABLE_TO_DELETE_USED_WORKFLOW",
            message: i18n.gettext("Unable to delete workflow '{0}'. It's currently in use, there are some records in queue.")
        },
        {
            level: 1,
            code: "THE_WORKFLOW_DETAIL_SEQUENCE_CAN_NOT_BE_LESS_THAN_1",
            message: i18n.gettext("The workflow detail sequence cannot be less than 1.")
        },
        {
            level: 1,
            code: "THE_FIRST_WORKFLOW_DETAIL_MUST_BE_CREATED_FOR_WORKFLOW_ACTOR_WITH_STATUS",
            message: i18n.gettext("The first workflow detail must be created for workflow actor '{0}' with '{1}' status.")
        },
        {
            level: 1,
            code: "ONLY_FIRST_WORKFLOW_DETAIL_CAN_BE_CREATED_FOR_ACTOR_WITH_STATUS",
            message: i18n.gettext("Only first workflow detail can be created for actor '{0}' with '{1}' status.")
        },
        {
            level: 1,
            code: "ONLY_FIRST_WORKFLOW_DETAIL_CAN_BE_CREATED_FOR_STATUS",
            message: i18n.gettext("Only first workflow detail can be created for '{0}' status.")
        },
        {
            level: 1,
            code: "ORG_TYPE_SHOULD_BE_DEFINED_FOR_WORKFLOW_DETAIL_OF_ACTOR_TYPE",
            message: i18n.gettext("Org type should be defined for workflow detail of actor type '{0}'.")
        },
        {
            level: 1,
            code: "ORG_LEVEL_SHOULD_BE_DEFINED_FOR_WORKFLOW_DETAIL_OF_ACTOR_TYPE",
            message: i18n.gettext("Org level should be defined for workflow detail of actor type '{0}'.")
        },
        {
            level: 1,
            code: "POSITION_SHOULD_BE_DEFINED_FOR_WORKFLOW_DETAIL_OF_ACTOR_TYPE",
            message: i18n.gettext("Position should be defined for workflow detail of actor type '{0}'.")
        },
        {
            level: 1,
            code: "EMPLOYEE_SHOULD_BE_DEFINED_FOR_WORKFLOW_DETAIL_OF_ACTOR_TYPE",
            message: i18n.gettext("Employee should be defined for workflow detail of actor type '{0}'.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_WORKFLOW_DETAIL_ACTOR",
            message: i18n.gettext("Unsupported workflow detail actor '{0}'.")
        },
        {
            level: 1,
            code: "IT_IS_NOT_ALLOWED_TO_HAVE_MORE_THAN_ONE_WORKFLOW_DETAIL_FOR_SAME_SEQUENCE_IN_WORKFLOW",
            message: i18n.gettext("It is not allowed to have more than one workflow detail for the same sequence '{0}' in workflow '{1}'.")
        },
        {
            level: 1,
            code: "FIRST_WORKFLOW_DETAIL_IS_NOT_FOUND_IN_WORKFLOW",
            message: i18n.gettext("First workflow detail is not found in workflow '{0}'.")
        },
        {
            level: 1,
            code: "UNSUPPORTED_WORKFLOW_STATE",
            message: i18n.gettext("Unsupported workflow state '{0}'.")
        },
        {
            level: 1,
            code: "THE_ATTRIBUTE_1_VALUE_IN_DETAIL_IN_CODE_TABLE_SHOULD_BE_SET_FOR_ORG_STRUCTURE",
            message: i18n.gettext("The attribute 1 value in detail in code table '{0}' should be set to '{1}' for org structure.")
        },
        {
            level: 1,
            code: "SCHEDULED_START_AND_SCHEDULED_END_SHOULD_BE_SPECIFIED_FOR_ACTIVE_WORKFLOW_PERIOD_DETAIL",
            message: i18n.gettext("Scheduled start and scheduled end should be specified for active workflow period detail.")
        },
        {
            level: 1,
            code: "ONLY_PROVIDED_WORKFLOW_STATES_ARE_ALLOWED_FOR_THE_FIRST_WORKFLOW_STATE",
            message: i18n.gettext("Only '{0}' workflow states are allowed for the first workflow step, but '{1}' is found.")
        },
        {
            level: 1,
            code: "ONLY_SPECIFIED_ACTOR_TYPE_CAN_PROCESS_THIS_WORKFLOW_STEP",
            message: i18n.gettext("Only '{0}' workflow actor type can process this workflow step.")
        },
        {
            level: 1,
            code: "CAN_NOT_FIND_EMPLOYEE_AS_MANAGER_FOR_WORKFLOW_ACTOR_TYPE",
            message: i18n.gettext("Cannot find employee as manager for workflow actor type '{0}'.")
        },
        {
            level: 1,
            code: "THE_POSITION_WORKFLOW_STRUCTURE_NUMBER_SHOULD_BE_IN_RANGE",
            message: i18n.gettext("The position workflow structure number '{0}' should be in range [1,2].")
        },
        {
            level: 1,
            code: "ENTITY_WAS_NOT_FOUND_BY_ID",
            message: i18n.gettext("'{0}' was not found by id '{1}'.")
        },
        {
            level: 1,
            code: "ENTITY_WAS_NOT_FOUND_BY_CODE",
            message: i18n.gettext("'{0}' was not found by code '{1}'.")
        },
        {
            level: 1,
            code: "ENTITY_WAS_NOT_FOUND_BY_DESCRIPTION",
            message: i18n.gettext("'{0}' was not found by description '{1}'.")
        },
        {
            level: 1,
            code: "SHIFT_SCHEDULE_OVERLAPS_ANOTHER_ONE_IN_SCHEDULE_ON_DAY",
            message: i18n.gettext("Shift schedule overlaps another one in schedule '{0}' on day '{1}'.")
        },
        {
            level: 1,
            code: "NO_COMPANY_FORM_FOUND",
            message: i18n.gettext("Company form with name '{0}' doesn't exist")
        },
        {
            level: 1,
            code: "GL_EXPORT_ERROR",
            message: i18n.gettext("An issue appeared during exporting gl.<br/>{0}")
        },
        {
            level: 1,
            code: "NO_ACH_BANK_ACCOUNT_FOR_EMPLOYEE",
            message: i18n.gettext("Employee {0} doesn't have ACH bank account")
        },
        {
            level: 1,
            code: "MULTIPLE_ACH_BANK_ACCOUNTS_FOR_EMPLOYEE",
            message: i18n.gettext("Employee {0} has more than one ACH bank account")
        },
        {
            level: 1,
            code: "SINGLE_SIGN_ON_OKTA_REQUEST_ERROR",
            message: i18n.gettext("An issue appeared on Okta's side.</br>{0}")
        },
        {
            level: 1,
            code: "NEGATIVE_COMPENSATION_VALUE",
            message: i18n.gettext("Compensation value could not be negative")
        },
        {
            level: 1,
            code: "EITHER_IS_CREATE_BLANK_OR_IS_COPY_FROM_OR_IS_ROTATE_SHOULD_BE_SET_TO_TRUE",
            message: i18n.gettext("Either 'isCreateBlank' or 'isCopyFrom' or 'isRotate' request parameter should be set to 'true'.")
        },
        {
            level: 1,
            code: "UNABLE_TO_DELETE_BATCH_DURING_CALCULATION",
            message: i18n.gettext("Payroll batch is being processed and cannot be deleted.")
        },
        {
            level: 1,
            code: "NOT_FOUND_DEDUCTION_IN_THE_BATCH_BY_EMPLOYEE_NUMBER_AND_DEDUCTION_CODE_AND_IS_EMPLOYEE",
            message: i18n.gettext("Payroll batch deduction is not found for the next parameters: Employee Number = '{0}', Deduction Code = '{1}', Is Employee = '{2}'.")
        },
        {
            level: 1,
            code: "UNABLE_TO_COMMUNITY_WITH_POSTS",
            message: i18n.gettext("Community with posts cannot be deleted.")
        },
        {
            level: 1,
            code: "UNABLE_TO_DELETE_USED_INSTRUCTOR",
            message: i18n.gettext("Can't delete Instructor. The instructor has assigned to classes.")
        },
        {
            level: 1,
            code: "EXPRESSION_PARSING_ERROR",
            message: i18n.gettext("An error occurred during expression parsing.<br/>Error: '{0}'.")
        },
        {
            level: 1,
            code: "TIME_OFF_PLAN_NEGATIVE_CAP_FORMULA_NOT_VALID",
            message: i18n.gettext("Incorrect formula. Time Off Plan Negative Cap formula is not valid - '{0}'.")
        },
        {
            level: 1,
            code: "TIME_OFF_PLAN_ACCRUAL_CAP_FORMULA_NOT_VALID",
            message: i18n.gettext("Incorrect formula. Time Off Plan Accrual Cap formula is not valid - '{0}'.")
        },
        {
            level: 1,
            code: "INVALID_NEGATIVE_CAP_VALUE",
            message: i18n.gettext("Invalid Negative Cap value. Cap should be > 0.")
        },
        {
            level: 1,
            code: "NEGATIVE_NET_OVERFLOW_NEGATIVE_CAP",
            message: i18n.gettext("Negative Net value exceeds available Negative Cap.")
        },
        {
            level: 1,
            code: "EITHER_EMPLOYEE_ID_OR_EMPLOYEE_NUMBER_WITH_EMPLOYER_ID_OR_EMPLOYEE_GROUP_NAME_WITH_EMPLOYER_ID_SHOULD_BE_SET",
            message: i18n.gettext("Either 'employeeId' or 'employeeNumber' with 'employerId' or 'employeeGroupName' with 'employerId' request parameters should be specified.")
        },
        {
            level: 1,
            code: "AN_ERROR_OCCURRED_PARSING_GL_EXPORT_PARAMETER_1",
            message: i18n.gettext("An error occurred during parsing gl export setting in 'parameter 1'.<br/>Error: '{0}'.")
        },
        {
            level: 1,
            code: "INVALID_ASSIGNMENT_FOR_EMPLOYEE",
            message: i18n.gettext("Employee doesn't have selected assignment")
        },
        {
            level: 1,
            code: "INVALID_WORK_LOCATION_FOR_EMPLOYEE",
            message: i18n.gettext("Employee doesn't have selected work location")
        },
        {
            level: 1,
            code: "WORK_LOCATION_IS_SET_AS_PRIMARY_FOR_EMPLOYEES_CAN_NOT_BE_REMOVED",
            message: i18n.gettext("Work location is set as primary for employees: '{0}'. It can't be removed.")
        },
        {
            level: 1,
            code: "WORK_LOCATION_IS_SET_AS_PRIMARY_FOR_EMPLOYERS_CAN_NOT_BE_REMOVED",
            message: i18n.gettext("Work location is set as primary for employers: '{0}'. It can't be removed.")
        },
        {
            level: 1,
            code: "DEFAULT_SOCIAL_MEDIA_TYPE_IS_NOT_SET",
            message: i18n.gettext("Default social media type is not set in Social Media Type user code table.")
        },
        {
            level: 1,
            code: "DEFAULT_SKILL_LEVEL_IS_NOT_SET",
            message: i18n.gettext("Default skill level is not set in Skill Level user code table.")
        },
        {
            level: 1,
            code: "ACCESS_DENIED_IT_IS_NOT_ALLOWED_TO_VIEW_TEAM_DOCUMENTS_FOR_EMPLOYEE",
            message: i18n.gettext("Access denied. It is not allowed to view team documents for employee '{0}'.")
        },
        {
            level: 1,
            code: "EMPLOYEE_NOT_FOUND",
            message: i18n.gettext("Employee with emplyee number('{0}') was not found!")
        },
        {
            level: 1,
            code: "EMPLOYEE_FOR_EMPLOYER_NOT_FOUND",
            message: i18n.gettext("Employee with emplyee number('{0}') was not found for employer('{1}')!")
        },
        {
            level: 1,
            code: "INVALID_TIME_CLOCK_OFFLINE_PUNCH_DATE",
            message: i18n.gettext("Invalid offline punch date ('{0:date('m/d/Y - h:i a')}') for employee number ('{1}'). Date could not be greater of current date and less then current for 14 days. Please check your Time Clock device settings")
        },
        {
            level: 1,
            code: "EMPLOYEE_HAS_ALREADY_STARTED_TASK",
            message: i18n.gettext("The employee has already started the task ({0}).")
        },
        {
            level: 1,
            code: "TIMESHEET_IS_NOT_VERTICAL",
            message: i18n.gettext("Current timesheet is not Vertical!")
        },
        {
            level: 1,
            code: "TIMESHEET_IS_NOT_FOUND",
            message: i18n.gettext("Timesheet with the specified ID is not found. Please, select another timesheet")
        },
        {
            level: 1,
            code: "TIMESHEET_IS_NOT_HOURLY",
            message: i18n.gettext("Current timesheet is not Hourly!")
        },
        {
            level: 1,
            code: "CANT_START_TIMER_FOR_TIMESHEET",
            message: i18n.gettext("You can't start timer for a timesheet({0}) with {1} status!")
        },
        {
            level: 1,
            code: "CANT_STOP_TIMER_FOR_TIMESHEET",
            message: i18n.gettext("You can't stop timer for a timesheet({0}) with {1} status!")
        },
        {
            level: 1,
            code: "CAN_START_THE_TIMER_FOR_REGULAR_HOURS",
            message: i18n.gettext("You can start timer for Regular hours only.")
        },
        {
            level: 1,
            code: "EMPLOYEE_DOESNT_HAVE_STARTED_TASK",
            message: i18n.gettext("The employee({0}) doesn't have started task.")
        },
        {
            level: 1,
            code: "DELAYED_REPORT_GENERATION_COULD_BE_PERFORMED_ONLY_BY_USER",
            message: i18n.gettext("Delayed report generation could be performed only by user")
        },
        {
            level: 1,
            code: "REPORT_GENERATION_TASK_DOES_NOT_EXIST",
            message: i18n.gettext("Report generation task does not exist")
        },
        {
            level: 1,
            code: "INVALID_DELAYED_REPORT_FILENAME",
            message: i18n.gettext("Invalid delayed report file name. Filename could not be empty")
        },
        {
            level: 1,
            code: "NOT_COMPLETED_REPORT_COULD_NOT_BE_DOWNLOADED",
            message: i18n.gettext("Not completed report could not be downloaded")
        },
        {
            level: 1,
            code: "INVALID_REPORT_GENERATION_TASK_SETUP",
            message: i18n.gettext("Invalid Report Generation Task setup")
        },
        {
            level: 1,
            code: "TIME_OFF_PLAN_START_DATE_COULD_NOT_BE_GREATER_THAN_HIRE_DATE",
            message: i18n.gettext("Time off plan start date({0:date}) could not be greater than employee hire date({1:date})")
        },
        {
            level: 1,
            code: "AT_LEAST_ONE_FIELD_SHOULD_BE_SET_IN_CANDIDATE_EDUCATION",
            message: i18n.gettext("At least one field should be set in candidate education.")
        },
        {
            level: 1,
            code: "AT_LEAST_ONE_FIELD_SHOULD_BE_SET_IN_CANDIDATE_EMPLOYMENT_HISTORY",
            message: i18n.gettext("At least one field should be set in candidate employment history.")
        },
        {
            level: 1,
            code: "AT_LEAST_ONE_FIELD_SHOULD_BE_SET_IN_CANDIDATE_AWARD",
            message: i18n.gettext("At least one field should be set in candidate award.")
        },
        {
            level: 1,
            code: "AT_LEAST_ONE_FIELD_SHOULD_BE_SET_IN_PERSON_EDUCATION",
            message: i18n.gettext("At least one field should be set in person education.")
        },
        {
            level: 1,
            code: "AT_LEAST_ONE_FIELD_SHOULD_BE_SET_IN_PERSON_PRIOR_EMPLOYMENT",
            message: i18n.gettext("At least one field should be set in person prior employment.")
        },
        {
            level: 1,
            code: "APP_UNINSTALL_SCHEDULE_TASKS_MUST_BE_REMOVED",
            message: i18n.gettext("Cannot uninstall app({0}). Please remove all schedule tasks with this app.")
        },
        {
            level: 1,
            code: "A_CLIENT_ERROR_OCCURRED",
            message: i18n.gettext("A client error occurred: {0}.")
        },
        {
            level: 1,
            code: "APP_UNINSTALL_PAYROLL_SETTINGS_MUST_BE_REMOVED",
            message: i18n.gettext("Cannot uninstall app({0}). Please remove all links in payroll settings to this app.")
        },
        {
            level: 1,
            code: "APP_UNINSTALL_GL_SETUP_MUST_BE_REMOVED",
            message: i18n.gettext("Cannot uninstall app({0}). Please remove all links in GL setup to this app.")
        },
        {
            level: 1,
            code: "CAN_NOT_FIND_PAYROLL_PERIOD_BY_SCHEDULE_ID_AND_PAY_DATE",
            message: i18n.gettext("Cannot find payroll period by schedule id '{0}' and pay date '{1:date}'.")
        },
        {
            level: 1,
            code: "PAYROLL_PERIOD_SHOULD_BE_SET_FOR_SINGLE_PERIOD_PAYROLL_IMPORT_OPTION",
            message: i18n.gettext("Payroll period should be set for single period payroll import option.")
        },
        {
            level: 1,
            code: "PAY_DATE_SHOULD_BE_SET_IN_FORM_FOR_SINGLE_PERIOD_PAYROLL_IMPORT_OPTION",
            message: i18n.gettext("Pay date should be set in form for single period payroll import option.")
        },
        {
            level: 1,
            code: "PAY_DATE_SHOULD_BE_SET_IN_TEMPLATE_FOR_MULTIPLE_PERIOD_PAYROLL_IMPORT_OPTION",
            message: i18n.gettext("Pay date should be set in template for multiple period payroll import option.")
        },
        {
            level: 1,
            code: "THIS_WORK_LOCATION_IS_NOT_ADDED_TO_EMPLOYER",
            message: i18n.gettext("This location is not added to employer '{0}' so it can not be removed.")
        },
        {
            level: 1,
            code: "THIS_WORK_LOCATION_IS_NOT_ADDED_TO_EMPLOYEE",
            message: i18n.gettext("This location is not added to employee '{0}' so it can not be removed.")
        },
        {
            level: 1,
            code: "THIS_WORK_LOCATION_IS_THE_ONLY_WORK_LOCATION_ATTACHED_TO_EMPLOYER",
            message: i18n.gettext("This location is the only work location attached to employer '{0}' so it can not be removed.")
        },
        {
            level: 1,
            code: "THIS_WORK_LOCATION_IS_PRIMARY_IN_EMPLOYER",
            message: i18n.gettext("This work location is primary in employer '{0}' so it can not be removed.")
        },
        {
            level: 1,
            code: "THIS_WORK_LOCATION_IS_THE_ONLY_WORK_LOCATION_ATTACHED_TO_EMPLOYEE",
            message: i18n.gettext("This location is the only work location attached to employee '{0}' so it can not be removed.")
        },
        {
            level: 1,
            code: "THIS_WORK_LOCATION_IS_PRIMARY_IN_EMPLOYEE",
            message: i18n.gettext("This work location is primary in employee '{0}' so it can not be removed.")
        },
        {
            level: 1,
            code: "THIS_WORK_LOCATION_IS_USED_IN_CHECK_IN",
            message: i18n.gettext("This work location is used in check in for employee '{0}' for employer '{1}' so it can not be removed.")
        },
        {
            level: 1,
            code: "THIS_WORK_LOCATION_IS_USED_IN_EMPLOYEE_WORK_LOCATION",
            message: i18n.gettext("This work location is used in employee work location for employee '{0}' for employer '{1}' so it can not be removed.")
        },
        {
            level: 1,
            code: "THIS_WORK_LOCATION_IS_USED_IN_GL_ACCOUNT_MAP",
            message: i18n.gettext("This work location is used in gl account map for employer '{0}' so it can not be removed.")
        },
        {
            level: 1,
            code: "THIS_WORK_LOCATION_IS_USED_IN_GL_EXPORT",
            message: i18n.gettext("This work location is used in gl export in payroll for employee '{0}', batch '{1}', employer '{2}', so it can not be removed.")
        },
        {
            level: 1,
            code: "THIS_WORK_LOCATION_IS_USED_IN_PAYROLL_INCOME",
            message: i18n.gettext("This work location is used in payroll income '{0}' for employee '{1}', batch '{2}', employer '{3}', so it can not be removed.")
        },
        {
            level: 1,
            code: "THIS_WORK_LOCATION_IS_USED_IN_POPULATION_COUNT",
            message: i18n.gettext("This work location is used in population count for employer '{0}' so it can not be removed.")
        },
        {
            level: 1,
            code: "THIS_WORK_LOCATION_IS_USED_IN_POSITION",
            message: i18n.gettext("This work location is used in position '{0}' for employer '{1}' so it can not be removed.")
        },
        {
            level: 1,
            code: "THIS_WORK_LOCATION_IS_USED_IN_REQUIRED_COVERAGE",
            message: i18n.gettext("This work location is used in required coverage for employer '{0}' so it can not be removed.")
        },
        {
            level: 1,
            code: "THIS_WORK_LOCATION_IS_USED_IN_SHIFT_GROUP",
            message: i18n.gettext("This work location is used in shift group '{0}' for employer '{1}' so it can not be removed.")
        },
        {
            level: 1,
            code: "THIS_WORK_LOCATION_IS_USED_IN_TIMESHEET",
            message: i18n.gettext("This work location is used in timesheet for employee '{0}', employer '{1}', start date '{2:date}', end date '{3:date}', so it can not be removed.")
        },
        {
            level: 1,
            code: "UNABLE_TO_DELETE_HOLIDAY",
            message: i18n.gettext("Can't delete holiday. '{0}' holiday is used in employee timesheet tasks.")
        },
        {
            level: 1,
            code: "UNABLE_TO_DELETE_TASK",
            message: i18n.gettext("Can't delete task. '{0}' task is used in '{1}'.")
        },
        {
            level: 1,
            code: "A_CYCLE_IS_FOUND_IN_DEDUCTIONS",
            message: i18n.gettext("Deduction '{0}' cannot use current value in the field 'Start After', a cycle is formed due to 'Start After' field in another deduction '{1}'")
        },
        {
            level: 1,
            code: "INCOME_LIST_WITH_OT_SUFFIX_WAS_NOT_FOUND",
            message: i18n.gettext("Income with '{0}-OT' code is required for calculation")
        },
        {
            level: 1,
            code: "INCOME_LIST_WAS_NOT_FOUND",
            message: i18n.gettext("Income with '{0}' code is required for calculation")
        },
        {
            level: 1,
            code: "NO_ONE_ACTIVE_PRIMARY_ASSIGNMENT_WAS_FOUND_FOR_PAYROLL_PERIOD",
            message: i18n.gettext("No one active primary employee's({0}) assignment was found for payroll period [{1}, {2}]!")
        },
        {
            level: 1,
            code: "INCORRECT_VALUE_IS_IN_DATE_FORMAT_FIELD",
            message: i18n.gettext("Incorrect value is in Date Format field")
        },
        {
            level: 1,
            code: "INCORRECT_INTERVAL",
            message: i18n.gettext("Interval isn't set for schedule '{0}'")
        },
        {
            level: 1,
            code: "INCORRECT_VALUE_IS_IN_TIME_FORMAT_FIELD",
            message: i18n.gettext("Incorrect value is in Time Format field")
        },
        {
            level: 1,
            code: "TIME_CLOCK_OFFLINE_PUNCH_IS_EXPIRED",
            message: i18n.gettext("Time clock offline punch for date {0} is expired")
        },
        {
            level: 1,
            code: "DUPLICATE_ENTRY",
            message: i18n.gettext("Duplicate Entry '{0}' for table '{1}'.")
        },
        {
            level: 1,
            code: "INCOME_LIST_ALREADY_EXISTS",
            message: i18n.gettext("Income with code '{0}' already exists.")
        },
        {
            level: 1,
            code: "WORKFLOW_RECORD_HAS_ALREADY_BEEN_PROCESSED",
            message: i18n.gettext("This request is already processed.")
        },
        {
            level: 1,
            code: "EMPLOYEE_GOAL_NOT_ATTACHED_TO_REVIEW",
            message: i18n.gettext("Employee goal must be attached to active or future review")
        },
        {
            level: 1,
            code: "FILE_CONTAINS_STRING_DATA_LONGER_THAN_ALLOWED",
            message: i18n.gettext("The file contains string data longer than allowed <br/>{0}")
        },
        {
            level: 1,
            code: "EXPRESSION_IS_INVALID",
            message: i18n.gettext("Formula {0} is invalid expression.")
        },
        {
            level: 1,
            code: "ILLEGAL_OPERATION",
            message: i18n.gettext("Illegal operation ({0}) with parameters fp({1}) and sp({2}})")
        },
        {
            level: 1,
            code: "MEAL_PERIOD_FORMULA_IS_NOT_SET",
            message: i18n.gettext("Meal Period Formula is not set.")
        },
        {
            level: 1,
            code: "SHIFT_SPLIT_FORMULA_IS_NOT_SET",
            message: i18n.gettext("Shift Split Formula is not set.")
        },
        {
            level: 1,
            code: "SHIFT_SPREAD_FORMULA_IS_NOT_SET",
            message: i18n.gettext("Shift Spread Formula is not set.")
        },
        {
            level: 1,
            code: "MEAL_PERIOD_FORMULA_IS_NOT_VALID",
            message: i18n.gettext("Meal Period Formula '{0}' is not valid.")
        },
        {
            level: 1,
            code: "SHIFT_SPREAD_FORMULA_IS_NOT_VALID",
            message: i18n.gettext("Shift Spread Formula '{0}' is not valid.")
        },
        {
            level: 1,
            code: "DUPLICATE_EMPLOYEES_IN_SHIFT",
            message: i18n.gettext("Can't save shift with duplicated employees: {0}")
        },
        {
            level: 1,
            code: "CANNOT_DELETE_DEDUCTION_IS_PARENT",
            message: i18n.gettext("You can't delete deduction. The deduction is a parent for another deduction")
        },
        {
            level: 1,
            code: "CANNOT_DELETE_DEDUCTION_IS_START",
            message: i18n.gettext("You can't delete deduction. The deduction is start deduction for another deduction")
        },
        {
            level: 1,
            code: "UNABLE_TO_PROCESS_CERTIFIED_RATE_CALCULATIONS_NO_POSITION_CODE_BY_PROJECT",
            message: i18n.gettext("Unable to process certified rate calculations for Employee: '{0}'. Could not locate Position Code: '{1}' in any of the certified rate tables while searching by Project")
        },
        {
            level: 1,
            code: "UNABLE_TO_PROCESS_CERTIFIED_RATE_CALCULATIONS_MULTIPLE_POSITION_CODES_BY_PROJECT",
            message: i18n.gettext("Unable to process certified rate calculations for Employee: '{0}'. Position Code: '{1}' is linked in more than one certified rate tables while searching by Project")
        },
        {
            level: 1,
            code: "UNABLE_TO_PROCESS_CERTIFIED_RATE_CALCULATIONS_NO_POSITION_CODE_BY_ASSIGNMENT",
            message: i18n.gettext("Unable to process certified rate calculations for Employee: '{0}'. Could not locate Position Code: '{1}' in any of the certified rate tables while searching by Assignment")
        },
        {
            level: 1,
            code: "UNABLE_TO_PROCESS_CERTIFIED_RATE_CALCULATIONS_MULTIPLE_POSITION_CODES_BY_ASSIGNMENT",
            message: i18n.gettext("Unable to process certified rate calculations for Employee: '{0}'. Position Code: '{1}' is linked in more than one certified rate tables while searching by Assignment")
        },
        {
            level: 1,
            code: "UNABLE_TO_PROCESS_CERTIFIED_RATE_CALCULATIONS_NO_POSITION_CODE_BY_WORK_LOCATION",
            message: i18n.gettext("Unable to process certified rate calculations for Employee: '{0}'. Could not locate Position Code: '{1}' in any of the certified rate tables while searching by Work Location")
        },
        {
            level: 1,
            code: "UNABLE_TO_PROCESS_CERTIFIED_RATE_CALCULATIONS_MULTIPLE_POSITION_CODES_BY_WORK_LOCATION",
            message: i18n.gettext("Unable to process certified rate calculations for Employee: '{0}'. Position Code: '{1}' is linked in more than one certified rate tables while searching by Work Location")
        },
        {
            level: 1,
            code: "META_TABLE_IS_NOT_FOUND",
            message: i18n.gettext("Meta table {0} is not found.")
        },
        {
            level: 1,
            code: "WORK_LOCATION_IS_NOT_ALLOWED_FOR_EMPLOYEES",
            message: i18n.gettext("Work Location '{0}' is not allowed for the next employees: {1}")
        },
        {
            level: 1,
            code: "AVERAGE_DAYS_SHOULD_BE_IN_RANGE",
            message: i18n.gettext("The averageDays '{0}' should be more than 0 and less or equal 7.")
        },
        {
            level: 1,
            code: "AVERAGE_WEEKS_SHOULD_BE_IN_RANGE",
            message: i18n.gettext("The averageWeeks '{0}' should be more than 0 and less or equal 52")
        },
        {
            level: 1,
            code: "DATA_CHANGED_REFRESH_PAGE",
            message: i18n.gettext("Application data has been already changed. Refresh the page.")
        },
        {
            level: 1,
            code: "INVALID_CANADIAN_TAX_CONFIGURATION_MORE_THAN_2_TAXES",
            message: i18n.gettext("The amount of canadian taxes cannot exceed 2 for employee '{0}'. Please, remove unnecessary taxes to continue.")
        },
        {
            level: 1,
            code: "EMPLOYEE_ONBOARDING_NOT_FOUND",
            message: i18n.gettext("Employee onboarding with id {0} was not found.")
        },
        {
            level: 1,
            code: "RECRUITER_WORK_PHONE_IS_NOT_SET",
            message: i18n.gettext("Recruiter's work phone is not set.")
        },
        {
            level: 1,
            code: "UNABLE_TO_FIND_PAYROLL_PERIOD_START_AND_END_DATES_FOR_ROW",
            message: i18n.gettext("Unable to find payroll period start an end dates for row '{0}'")
        },
        {
            level: 1,
            code: "UNABLE_TO_FIND_ASSIGNMENT_FOR_ROW",
            message: i18n.gettext("Unable to find assignment for row '{0}'")
        },
        {
            level: 1,
            code: "UNABLE_TO_FIND_PRIMARY_WORK_LOCATION_FOR_ROW",
            message: i18n.gettext("Unable to find primary work location for row '{0}'")
        },
        {
            level: 1,
            code: "UNABLE_TO_FIND_LOCATIONS_FOR_ROW",
            message: i18n.gettext("Unable to find locations for row '{0}'")
        },
        {
            level: 1,
            code: "UNABLE_TO_MATCH_TAX_BY_LOCATIONS_FOR_ROW",
            message: i18n.gettext("Unable to match tax by locations for row '{0}'")
        },
        {
            level: 1,
            code: "TIMEOFF_WAITING_PERIOD_CANNOT_REQUEST",
            message: i18n.gettext("You cannot submit a time off request until the waiting period is over.")
        },
        {
            level: 1,
            code: "EMPLOYEE_BENEFIT_DOES_NOT_EXIST",
            message: i18n.gettext("Employee benefit with id '{0}' doesn't exist in the system.")
        },
        {
            level: 1,
            code: "EMPLOYEE_BENEFIT_DOES_NOT_CONTAIN_WEB_FORM",
            message: i18n.gettext("Employee benefit doesn't contain a web form.")
        },
        {
            level: 1,
            code: "PAY_DATE_SHOULD_BE_SET_IN_TEMPLATE_FOR_SINGLE_PERIOD_PAYROLL_IMPORT_OPTION",
            message: i18n.gettext("Pay date should be set in template for single period payroll import option.")
        },
        {
            level: 1,
            code: "TIMESHEET_PUNCH_OUTSIDE_GEOFENCE",
            message: i18n.gettext("Your current location is not in an approved clock in/out area!")
        },
        {
            level: 1,
            code: "EMPLOYEE_OPEN_ENROLLMENT_STEP_DOES_NOT_CONTAIN_WEB_FORM",
            message: i18n.gettext("Employee open enrollment step doesn't contain a web form.")
        },
        {
            level: 1,
            code: "EMPLOYEE_OPEN_ENROLLMENT_STEP_DOES_NOT_EXIST",
            message: i18n.gettext("Employee open enrollment step with id '{0}' doesn't exist in the system.")
        }
    ]
};
       