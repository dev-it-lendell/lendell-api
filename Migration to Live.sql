-- endorsement_logs

INSERT INTO lendellp_losis.endorsement_logs (client_id, endo_code, endo_action, assigned_poc, assigned_operations, assigned_support, assigned_team, datetime_added)
SELECT client_id, endo_code, endo_action, assigned_poc, assigned_operations, assigned_support, assigned_team, datetime_added
FROM lendellp_losis_test.endorsement_logs t
WHERE endo_code like '%CNX%' and date(datetime_added) >= '2025-05-10';


-- tbl_endo
INSERT INTO lendellp_losis.tbl_endo (endo_id,
    endo_desc,
    endo_code,
    fname,
    mname,
    lname,
    suffix,
    birthdate,
    endo_date,
    endo_status,
    is_for_review,
    is_sent_partial,
    is_done,
    is_rerun,
    folder_name,
    document_status_others,
    supporting_documents,
    supporting_documents_remarks,
    remarks_others,
    document_status_employment,
    remarks_employment,
    document_status_education,
    remarks_education,
    endorsed_to,
    turn_around_date,
    endo_services,
    package_desc,
    client_id,
    site_id,
    endo_requestor,
    change_package,
    importance,
    bi_id,
    closure_date,
    account,
    initiation_date,
    application_code,
    external_client_id,
    external_status,
    external_package_account_name,
    msa,
    site,
    active,
    created_at,
    updated_at)
SELECT endo_id,
    endo_desc,
    endo_code,
    fname,
    mname,
    lname,
    suffix,
    birthdate,
    endo_date,
    endo_status,
    is_for_review,
    is_sent_partial,
    is_done,
    is_rerun,
    folder_name,
    document_status_others,
    supporting_documents,
    supporting_documents_remarks,
    remarks_others,
    document_status_employment,
    remarks_employment,
    document_status_education,
    remarks_education,
    endorsed_to,
    turn_around_date,
    endo_services,
    package_desc,
    client_id,
    site_id,
    endo_requestor,
    change_package,
    importance,
    bi_id,
    closure_date,
    account,
    initiation_date,
    application_code,
    external_client_id,
    external_status,
    external_package_account_name,
    msa,
    site,
    active,
    created_at,
    updated_at
FROM lendellp_losis_test.tbl_endo t
WHERE endo_code like '%CNX%' and date(created_at) >= '2025-05-30';


-- tble_endorsed_to

INSERT INTO lendellp_losis.tbl_endorsed_to (endo_code, endorsed_by, endorsed_to, datetime_added)
SELECT endo_code, endorsed_by, endorsed_to, datetime_added
FROM lendellp_losis_test.tbl_endorsed_to t
WHERE endo_code like '%CNX%' and date(datetime_added) >= '2025-05-10';


-- tbl_endorsement_bi_process
INSERT INTO lendellp_losis.tbl_endorsement_bi_process (endo_code, assigned_supervisor, assigned_support, assigned_specialist, assigned_analyst, review_supervisor,
assigned_client, percentage_, datetime_added, datetime_updated, datetime_completed)
SELECT endo_code, assigned_supervisor, assigned_support, assigned_specialist, assigned_analyst, review_supervisor,
assigned_client, percentage_, datetime_added, datetime_updated, datetime_completed
FROM lendellp_losis_test.tbl_endorsement_bi_process t
WHERE endo_code like '%CNX%' and date(datetime_added) >= '2025-05-10';


-- tbl_endo_external_files
INSERT INTO lendellp_losis.tbl_endo_external_files (endo_code, name, tag, type, content_type, content_url, datetime_created, datetime_updated, remarks)
SELECT endo_code, name, tag, type, content_type, content_url, datetime_created, datetime_updated, remarks
FROM lendellp_losis_test.tbl_endo_external_files t;

-- tble_endo_api_data
INSERT INTO lendellp_losis.tbl_endo_api_data (endo_code, raw_data, provider, datetime_created, datetime_updated, remarks)
SELECT endo_code, raw_data, provider, datetime_created, datetime_updated, remarks
FROM lendellp_losis_test.tbl_endo_api_data t;