# Must Mask

|                                           |                                               |
| ----------------------------------------- | --------------------------------------------- |
| ![Map](https://na.cx/i/FRGNOkd.png 'Map') | ![Share](https://na.cx/i/QiiHCdz.png 'Share') |

## About Must Mask

With the recent situation, many people that ran out of masks are feeling extremely anxious and helpless. Stores occasionally have replenished stocks of masks, attract long queues from early morning. Many leave in disappointment after exposing themselves for hours in the queue.

On one hand, there are ones unable to buy masks, and on the other, ones that have enough supply to last a few months and are willing to help others.

In view of this, we have developed the Must Mask platform so that people who have exhausted their supplies can reach out to those who are willing to share. Helping each other to overcome the current situation and return to normal life.

Must Mask operating attributes:
* Uses GPS to mark location of shared masks
* Users can help each other locally, quickly and conveniently, facilitating social distancing and reducing risk for transmitting
* Only require a Facebook / Apple account to participate
* Free to use platform, the purpose is to reduce public’s anxiety and help restore everyone's normal lives

## Features

* Built using React Native
* Dark / Light mode
* Chinese / English i18n
* Auto clustering for map pins

## Getting Started

1. Rename `.env.sample` to `.env` and replace `GOOGLE_PLACE_API_KEY_GOES_HERE` with your Google Place API key ([You can get one here](https://developers.google.com/maps/gmp-get-started))
1. Rename `AppDelegate.m.sample` to `AppDelegate.m` and replace `GOOGLE_MAP_API_KEY` with your Google Map API key ([You can get one here](https://developers.google.com/maps/gmp-get-started))
1. Rename `Info.plist.sample` to `Info.plist` and replace `CODE_PUSH_DEPLOYMENT_KEY` with your Code Push Deployment key
1. Rename `AndroidManifest.xml.sample` to `AndroidManifest.xml` and replace `GOOGLE_MAP_API_KEY` with your Google Map API key ([You can get one here](https://developers.google.com/maps/gmp-get-started))
1. Rename `strings.xml.sample` to `strings.xml` and replace `CODE_PUSH_DEPLOYMENT_KEY` with your Code Push Deployment key
1. `yarn run ios` or `yarn run android`

## License

MIT License

Copyright (c) 2020 Colloque Tsui

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.