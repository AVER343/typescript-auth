# typescript-auth
##Technologies used 
- Expressjs,Node.js (Typescript) for backend
- PostgreSQL database
- JWT - authenthication
-------
Be sure to have following configuration of postgres instancer running.
```
  database:'postgres'
  password:'postgres'
  user:'postgres'
```

Then, to start the application , 
```
npm run start
```
Architecture of application -

    >Instructor can create organizations and classes
    >Classes are created within organizations.
    >Each class will have a period which will be created and managed by Teacher
    >Students enroll themselves in periods 
    
 ALL routes (except ```users/*```) have authentication and authorizatiuon based off of roles.
 
