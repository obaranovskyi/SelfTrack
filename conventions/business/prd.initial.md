I want to create an application that would help me to track my general progress in losing weight, drinking water, and the time I exercise.

It should be a progressive application, as I want to install it on my phone. All the data are going to be stored in the local storage.

Pages:

Dashboard
---
On the dashboard I see, the date I started, the current date, and the bigger number of days, which is responsible for showing the days in progress (current date - start date). The start date will be the day it was opened for the first time. 

In local storage we store the start date; everything else is calculated.

The weight I started with, my current weight, and my lost weight. In this section I can change my weight by clicking "+" or "-", which will add or extract 100 grams from the weight. Generally speaking, it should be something like

| Start weight  | Lost Weight |
| 90                    | 2.9                   |

- 87.1 +

Where the "+" and "-" are the buttons.

In local storage we store my start weight and current weight. Every time I open the app and change the weight, the current weight is updated in the local storage. At the very beginning, the user enters his weight.

Below we have an exercise tracker:

Avg. Exercise
25 min
- 0 +

In local storage we store the last 165 days. Each day is represented by exercise minutes; if there is no number on some day, it's 0.

Below we have a water tracker. In this section I have something similar to weight, but each day it starts from 0. Here I can add or remove water I've drunk per day. It can't go lower than zero. 

Avg. Water
13.3 liters
- 0 +

Where the "+" and "-" are the buttons.

In local storage we store a single number, total drunk water, and we show average drunk water per day above the water editor.

Next we have mood picker; it should be done from the emojis from 1 to 10. During the day I can change mood number.

In the local storage, we store the last 90 days of mood to calculate the average mood. The average mood should be shown above the mood editor.

At the bottom we have a small button, "Reset the progress." If someone clicks on it, we should show a popup. To reset the progress, the user should enter the current date. The popup has an example of how the user should enter the date. If the user enters the number, all data is erased from the local storage, and the app acts like it was opened for the first time.


