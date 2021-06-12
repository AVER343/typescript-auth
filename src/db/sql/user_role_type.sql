
CREATE  TABLE USER_ROLE_TYPE(
id            SERIAL       PRIMARY KEY        ,
user_role     VARCHAR(64) UNIQUE ,
reputation    BIGINT CHECK(reputation>0) UNIQUE
);
INSERT INTO USER_ROLE_TYPE(user_role,reputation) VALUES('default',1000);
INSERT INTO USER_ROLE_TYPE(user_role,reputation) VALUES('admin',1);