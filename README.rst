Anima Character Generator
=========================

This is a browser-based utility for generating characters for the Anima: Beyond
Fantasy role-playing game.  It doesn't require an internet connection or even a
local server; everything is done in JavaScript within the browser.  Character
data is saved and reloaded by copying and pasting it (using a JSON text
format).  It's already relatively complete for DP and MK expenditure and
assorted score calculations.  Better support for magic, psychic, and creature
abilities is gradually being implemented.

Background
----------
I'm currently running an Anima game, and while the players and I really like
the system, character generation is rather time-consuming; there are a lot of
options to consider and calculations to make, and there aren't any official
electronic aids beyond a printable character sheet.  Some players of the game
have helped remedy this by creating editable PDF versions of the character
sheet, but these still require you to do a lot of calculations by hand and
require a full sheet of paper for each character; this is cumbersome when the
party encounters a mixed group of opponents, and I really just want an
overview of their main statistics.

Other players have created Excel spreadsheets for generating Anima characters,
which mostly solve the problem of needing to do manual calculations, but I find
myself skipping all over the sheet to fill in the blanks, having trouble
remembering what's left to fill out, and getting distracted by the display of
intermediate calculations.  Also, there are some rules in the game which are
rather ambiguous, and the spreadsheet authors have sometimes chosen a
different way of interpreting them than I have (which affects the
calculations).  And then there's the problem of needing a spreadsheet window
for each opponent.  These tools can be quite useful for players to keep track
of their characters, but are only a modest improvement over the editable PDF
forms for a GM with many characters to run.

Since I and several of my players are web application developers, we decided to
write our own utility to deal with this.  It interprets the rules as I run
them (although it may eventually have options to use alternate rule
interpretations).  It separates the raw data that needs to be input from the
display of the resulting character statistics.  It has a summary display that
shows just the information you're likely to need in order to run that
particular character effectively.  This stat block can be copied and pasted
into a text file and still look ok.  And it will eventually be capable of
showing the summaries for several characters at a time, and easily editing any
of them.

Status
------
The basic data format and most of the core calculations have been implemented.
Advantages, disadvantages, and most of the things that DP and MK can be spent
on are supported, although some things like Ars Magnus and creature powers
aren't fully implemented yet.  It's currently useful for starting almost any
character, and can fully represent characters without magic, psychic, or truly
esoteric martial abilities.  Support for creature Essential Abilities is in
place, and work on creature Powers has been started.  The character's total
Psychic Points and Magic Level are calculated and displayed, but allocating
them to abilities isn't yet implemented.

These are the main things left to be implemented that I'm aware of:

* Allocation of Magic Level to Paths, spells, and Metamagic Advantages
* Allocation of Psychic Points
* Creature Powers (about half implemented, but not yet in the UI)
* Current Elan level and its effect on abilities
* Mental Patterns (from Arcana Exxet)
* Ars Magnus (from Dominus Exxet)
* Limits (from Dominus Exxet)
* Seals of Invocation (from Dominus Exxet)
* Legacies of Blood (from Dominus Exxet)
* Selection of weapons and armor, and display relevant stats when using them
* Option to use Secondary Ability development rules from Core Exxet

If you notice other missing features or find bugs in what's already there, let
me know and I'll update it as free time allows.
