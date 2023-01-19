# To run this app, Docker and Docker Compose is required.
1. Download [Docker](https://www.docker.com) and then [download my repo as a zip.](https://github.com/brandonjmarquez/piano-roll/archive/refs/heads/master.zip)
2. Unzip the file you just downloaded.
3. Using the command line in the root directory of the unzipped file, run:
```docker compose up --build```
4. Visit http://localhost:3000
5. Enjoy!


## TODO
- Add start animation to give time for audio to load
- Change all css % values to discrete values
<<<<<<< HEAD
- Change width of note when recording over same note
- Record over recording, pause before all notes finish, then resume. Weird behavior
- Add undo recording
=======
- Notes don't play when brought back by 'undo'. Has something to do with how 'props.onNoteClicked' sends note info.
- Clicked notes disappear when recording starts.
<<<<<<< HEAD
=======
>>>>>>> 71ede2b (feat(client): Added display to show midi time in seconds. fix(client): Various bug fixes.)
>>>>>>> bb6cfce (Revert "fix: branch merge complete")
