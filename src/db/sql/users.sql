

CREATE  TABLE USERS(
id            SERIAL       PRIMARY KEY,
username    VARCHAR(128) NOT NULL UNIQUE,
password      VARCHAR(64) NOT NULL CONSTRAINT PASSWORD_LENGTH CHECK(char_length(password)>8),
created_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
modified_time  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
role_type VARCHAR(64) NOT NULL DEFAULT 'student' CHECK(role_type in ('admin','teacher','student','instructors'))
);