#REVIEW OF HOW TO START THE DB ON LOGIN
1. Open the Docker app and ensure it is running on the menu tray.

2. In a Git Bash terminal, run "docker compose up" (or "..down -v" if you want to delete a running db)

3. To test the db is running correctly, open a powershell terminal and run "docker compose exec database psql -U postgres -d onecafe", this puts you in the terminal to run commands for the db.

4. Running \dt returns a schema of the existing tables within the db.

5. Running "SELECT * FROM <tablename>;" can be used to ensure the wanted data was added to the table. 