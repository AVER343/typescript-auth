
CREATE  TABLE USER_ROLE(
id            SERIAL       PRIMARY KEY,
user_role     INTEGER,
user_id       BIGINT      UNIQUE NOT NULL,
FOREIGN KEY(id) REFERENCES USERS(id)
);
