#! /bin/bash
echo "Configuring database"
export PGPASSWORD="postgres"
# dropdb -U postgres far_away_app
createdb -U postgres application_database

psql -U postgres  < ./src/db/sql/drop_tables.sql
# psql -U postgres  < ./src/db/sql/user_role_type.sql
psql -U postgres  < ./src/db/sql/users.sql
echo "Configured user"
# psql -U postgres  < ./src/db/sql/user_details.sql
# psql -U postgres  < ./src/db/sql/user_role.sql
# psql -U postgres  < ./src/db/sql/user_otp.sql
# psql -U postgres  < ./src/db/sql/send_email_type.sql
# psql -U postgres  < ./src/db/sql/send_email.sql
psql -U postgres  < ./src/db/sql/instructor_organization.sql
echo "Configured instructors"
psql -U postgres  < ./src/db/sql/classes.sql
echo "Configured classes"
psql -U postgres  < ./src/db/sql/period_relationship.sql
echo "Configured relationship"
psql -U postgres  < ./src/db/sql/class_relationship.sql
echo "Configured relationship"
psql -U postgres  < ./src/db/sql/class_period.sql

echo "Configured database"