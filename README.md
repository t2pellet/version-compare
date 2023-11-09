## Setup

This was made with:
- npm v8.19.4
- node v16.20.2

## Install

`yarn add flexible-version-compare`

## Usage

```
import versionCompare from 'flexible-version-compare'
const result = versionCompare('123.456.78.0.0', '45.ab');
```

## Behaviour

### Logic
For each part:
- If these parts are numbers, they are numerically compared. 
- If only one is, the non numerical part is considered greater.
- If neither are, they are string compared

Compared from L->R, first greater part means that version string is greater.

If one string is longer than the other, the longer string is greater if it has any remaining non-zero part



### Accepted Formats

Since there was no specified format for the input strings, it accepts a wide variety of types.

It works with anything matching this REGEX: `/^[\w\s]+(\.[\w\s]+)*$/`

It allows any 'word' character in the individual parts delimited by '.'