# slinguist

A bad translation engine for Crusader Kings 3 (or any game really), meant to emulate popular bad translation versions of mods like Skyrim.

```
Stewardship > Turn it off
Martial > Battle Battle Battle Battle Battle Battle Battle
Diplomacy > Politics
Intrigue > Enterprise
Learning > Training
Prowess > Promenade

Relationships > Communication
Courtiers > Lawyer
Vassals > Search for a Search
Liege > Liar

The Empire of Heaven > Air Transport
"This is exactly what I need!" > "About us!"

This character has given reluctant praise to someone very popular > This feature should thank someone who is very popular.
```

```
I will declare my undying love for [SCHEME.GetTarget.GetShortUINameNoTooltip] and win [SCHEME.GetTarget.GetHerHis] heart through noble acts of chivalry.
I declare my subconscious love for [SCHEME.GetTarget.GetShortUINameNoTooltip] to win [SCHEME.GetTarget.GetHerHis] heart through the great acts of Persia...
```

Right now this randomly chooses between languages a random amount of time, but there's no way to exclude tokens from translation which is key. So I'll need to:

1. Find a better source than (or a better way to use) Libre as a translator platform, like wrapping html tags around tokens and preventing it from translating these then stripping those tags after translate
2. Create a full parsing engine that will read CK3's localization files and convert them to JSON key/value pairs, sanitizing the input
3. Find a better way to batch. This basic `translation` package wants small data like sentences, but ideally I'd batch entire files at a time and I don't want separate strings interfering with one another or hitting slowdowns from too many requests due to the 7-20 requests per translation needed. It might be worth going to Google and doing per-page translation
4. Fully recreate the game's original localization file structure with translated results, which will likely need to process via chunks / folders at a time. It may be worth writing a wrapper that keeps track of chunks and where it is so I can freely process the next chunk at will or schedule them
5. Test if random translation is better / funnier than a specified chain.
6. Ideally find a _free_ source for ML translation since all the ones I've seen are paid, and it's a lot pricier than I care to spend for something that will never make me a dime
