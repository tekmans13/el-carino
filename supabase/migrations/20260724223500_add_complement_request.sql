alter table inscriptions
add column if not exists complement_message text;

alter table inscriptions
add column if not exists complement_requested_at timestamptz;

alter table inscriptions
add column if not exists complement_email_sent_at timestamptz;
