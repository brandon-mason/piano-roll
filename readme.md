# Recordable Piano Instrument Web App
## Landing Page and Instructions
<img width="1512" alt="landing-page" src="https://user-images.githubusercontent.com/60440397/222621555-19cfa0df-277f-4274-bfe8-be9248b5c293.png">

<img width="1512" alt="instructions" src="https://user-images.githubusercontent.com/60440397/222621610-2826f31d-09cd-4eb9-be22-5aa6610c7744.png">

## Playing, Recording, Metronome
<img width="599" alt="playback-buttons" src="https://user-images.githubusercontent.com/60440397/222622276-6c54e69f-fba9-4fb7-9730-37ab81e9032c.png">

From left to right the buttons are stop: record, play, toggle metronome, and a display for the time of the current recording/playback.

## Settings
<img width="747" alt="piano" src="https://user-images.githubusercontent.com/60440397/222621669-193f01fc-0f49-43a0-b408-20ba34b9eb61.png">

From left to right the controls are: change sound, change octaves, change volume.

<img width="747" alt="midi" src="https://user-images.githubusercontent.com/60440397/222621674-58cf6762-fd8a-49cc-aa93-8663cc4057e1.png">

From left to right the controls are: change BPM, change number of measures, change subdivision, undo last note added(WIP).

## Logging In
<img width="1512" alt="login" src="https://user-images.githubusercontent.com/60440397/222621751-5baf1e70-acea-4487-997e-e33c4badceb9.png">

<img width="1512" alt="register" src="https://user-images.githubusercontent.com/60440397/222621758-257b0074-a371-4172-8d23-c4f46f8868b1.png">

Logging in is used to save recorded tracks, so that they can be loaded back onto the piano roll between sessions.

## Saving and Exporting
<img width="747" alt="save:export:delete" src="https://user-images.githubusercontent.com/60440397/222621904-1a1eac45-0ba3-48a4-b0af-2866cd3645c5.png">

From left to right the controls are: Delete current selected track, clear current track, name track, save current track, export current track to midi.

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
- Change width of note when recording over same note
- Record over recording, pause before all notes finish, then resume. Weird behavior
- Add undo recording
- Notes don't play when brought back by 'undo'. Has something to do with how 'props.onNoteClicked' sends note info.
- Clicked notes disappear when recording starts.
- Timeline goes past grid.
- Add backdrop to selectors when overwrite popup appears.
- Add warnings for save, new, delete, load.
- Reset password feature
- invalid messages on register page
