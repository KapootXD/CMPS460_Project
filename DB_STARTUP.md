#REVIEW OF HOW TO START THE DB ON LOGIN
Open the Docker app and ensure it is running on the menu tray.

In a Git Bash terminal, run "docker compose up --build" (or "docker compose down -v" if you want to close and delete the db)

To test the db is running correctly, open a powershell terminal and run "docker compose exec database psql -U postgres -d onecafe", this puts you in the terminal to run commands for the db.

Running \dt returns a schema of the existing tables within the db.

Running "SELECT * FROM <tablename>;" can be used to ensure the wanted data was added to the table.