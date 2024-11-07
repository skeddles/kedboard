# kedboard

A web based musical keyboard toy that uses keys which are mathematically aligned to perfect ratios of frequencies rather than the standard western 12-tone equal temperament. 

## Try it now: [kedboard](https://skeddles.github.io/kedboard/)

![example image](./image.png)

# Why?

I created this because pianos, notes, keys, and music theory are nonsensical gibberish based on arbitrary decisions made hundreds of years ago and only stuck around because of cultural momentum.

All the notes on this keyboard are calculated with perfect ratios.

There is of course some reprocussions from doing it like this. The normal keyboard is divided into 12 equally spaced notes (KIND OF...), but the divisions in this one are not equal, despite looking like it. This also means it's always tuned to the key of your root note, you can't play in other keys, because the distance between notes is different, so moving notes up and down will sound out of tune.

## Controls 

Click on keys to play that note.

Or tap a keyboard key to play a note. The keys are mapped so that each row is a different octave (starting at 1), and each letter is the next key on the kedboard.

### Settings

You can adjust the settings to change the keyboard. 
- **Root Note**: The note that the keyboard is tuned to, the frequency(hertz) of the root note on the lowest octave I've set the default to 60hz because it's the lowest number that can is divisible by 2, 3, and 5 (which results in less decimals for Hertz, which is easier to remember/calculate).
- **Octaves**: The number of octaves to display on the keyboard. With the default frequency, the second octave is roughly C4. 
- **Divisions**: Every key is a based on a ratio of the octaves root frequency. This number describes the largest division that should be used to create keys - all divisions up to that number will be used. By default it is 5 which gets you 10 keys per octave, using halves, thirds, fourths and fifths.