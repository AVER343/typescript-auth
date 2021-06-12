CREATE TABLE CLASSES(
id            SERIAL       PRIMARY KEY,
org_id        BIGINT       NOT     NULL , 
created_on  TIMESTAMP    DEFAULT now(),
class_name VARCHAR(48) NOT NULL,
class_active    BOOLEAN      DEFAULT TRUE,
FOREIGN KEY(org_id) REFERENCES INSTRUCTOR_ORGANIZATION(id)
);
