# Gilgamesh Versus: Level I Proof of Concept

This is a proof of concept for Level I in Gilgamesh Versus. It's a 2D side-scrolling platformer built with Phaser 3. Ultimately, we'll plug a beefed up version of this game element into the main game, [Gilgamesh Versus](https://github.com/bunsushi/Gilgamesh-Versus).

## How to Play

Left arrow key = go left
Right arrow key = go right
Up arrow key = jump

Pretty simple!

## Run Locally

To get this demo running on your local machine:
1. ```git clone``` this repo into the directory of your choice.
2. ```cd GV-level01-prototype``` and run ```npm install```.
- You'll be installing the following node packages:
  - grunt
  - grunt-contrib-connect
3. If you don't have Grunt CLI installed yet, run ```npm install -g grunt-cli``` to be able to use Grunt commands in the terminal.
4. ```grunt connect```
5. open up [localhost:8000](http://localhost:8000) to play!

## Chrome Users

If you are using Chrome, you may run into a problem with the arrow keys "sticking"--where your character will keep moving, instead of responding to your key press. You will have to hold SHIFT while moving your character to have full control. This seems to be an issue that arises from some Chrome extensions and certain keyboards. If you're experiencing this problem, try opening the game in a different browser for the best playing experience.

## Development Notes

To make a compatible tilesheet:
1. Import your tiles into a new map (.tmx)
2. Export this map as a PNG image.
- This ensures that the height and width of your tilesheet is a valid multiple of a single tile.
3. In your game level map, add the PNG as an external tilesheet

To render the Tiled map in the browser:
1. Save your map as a .tmx file.
2. "Save as" this file as a .json file.