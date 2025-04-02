# Previous Quiz 2 Questions & Options

Please note that some diagrams that were used in the questions are not present here.

## Question 1

**Runkeeper is a popular mobile app that tracks your running, walking, cycling, and other fitness activities. It presents the data in a typical social mobile app interface, allowing you to view your progress over time and share your accomplishments with friends. During the fitness activity, you can also view several real-time metrics such as distance, pace, and time overlaid on a 2D map view of your current location.**

**In the dimensions of the original Milgram-Kishino's RV continuum (Milgram and Kishino, 1994), it has some EWK, but almost no RF or EPM.**

**Given this knowledge, where is Runkeeper most appropriately placed on the RV continuum?**

**You can view the YouTube video below to get an idea of the app features. Runkeeper Features: https://youtu.be/1b8OkEcsMrw**

**(Acronyms are based on papers related to the RV continuum, also shown in class.)**

- A (real environment)
- B
- C
- D
- E (virtual environment)

**Answer**

`B`.

(Admittedly controversial, since `D` may also be a valid answer. Runkeeper is alike to Strava (which is in the slido, week02-intro). Strava gets a `B` on the scale, despite also having some EWK and zero RF and EPM).


## Question 2

**The 3D virtual dogs can perform spatial understanding of the real-world, enabling them to jump onto the real table seen through the camera.**

**What dimension of the original Milgram-Kishino's RV continuum (Milgram and Kishino, 1994) is this spatial understanding feature referring to?**

- EWK
- CO
- EPM
- IM
- RF

**Answer**

`EWK` (week02-intro slido)

## Question 3

**Which of the following is/are characteristic experiential dimensions of flow known in current research literature?**

- Warped sense of time
- Involvement
- Sense of Control
- Loss of self-consciousness
- Effortlessness
- Realness

**Answer**

- `Warped sense of time` / transformation of time (alternative answer)
- `Sense of control` / total control (alternative answer)
- `Loss of self-consciousness`
- `Effortlessness`

Other characteristics of flow:
- Clear goals
- Challenge that matches skill
- Complete concentration
- Autotelic experience (motivated instrinsically. unlike extrinsically, e.g. monetary benefit)

(week02-intro notes)

## Question 4

**Your UX team aims to enhance the sense of control and reduce self-consciousness, disorientation and nausea. They will run user studies before and after some key feature changes are made to your existing VR application.**

**What is/are the possible famous validated questionnaires to use in the user studies, pertinent to the aims above, to aid in design decisions for your UX team?**

- Virtual Reality Sickness Questionnaire (VRSQ)
- Igroup Presence Questionnaire (IPQ)
- Systems Usability Scale (SUS)
- Simulator Sickness Questionnaire (SSQ)
- Flow State Scale (FSS)

**Answer**

- `FSS`: questionnaire that measures **flow** (**sense of control** and **loss of consciousness**) see [qn3](#question-3)
- `VRSQ`*: motion-sickness questionnaire specialized for virtual environments (revision of `SSQ`) measuring **cybersickness** (**nausea** and **disorientation**)

The other questionnaires, for reference:
- `SSQ`*: gold standard questionnaire to measure **nausea** and **disorientation**
- `IPQ`: measures presence ("the feeling of being there"). tests for spatial, involvement, and realness. see [qn5](#question-5)
- `SUS`: a short 10-item questionnaire designed to measure the usability of a system

*\* SSQ was designed for aviators. VRSQ is specialized for VR. Instructor recommends SSQ when you want to compare to other studies; VRSQ otherwise as it's up-to-date. There is no comparison between studies, so VRSQ should be sufficient.*

## Question 5

**When designing for immersion in the next version of our VR commuting simulator, I want to improve the experience of presence.**

**Which of the following is/are suitable approaches that translate this goal into implementation?**

- add AI-driven human characters with realistic behaviors in the simulation
- implement teleportation locomotion instead of the current walking-in-place locomotion
- increase the visual fidelity of the graphics with custom physically based rendering shaders
- implement mechanics to structure the commuting experience akin to completing progressively challenging levels in a game setting
- implement real-walking locomotion (tracking actual walking in a room-scale setting) instead of the current walking-in-place locomotion
- implement GUI elements to present clear goals for the user to attain at every point of the commuting experience

**Answer**

- **presence**: `add AI-driven human characters with realistic behaviors in the simulation`
- **presence**: `increase the visual fidelity of the graphics with custom physically based rendering shaders`
- **embodiment***: `implement teleportation locomotion instead of the current walking-in-place locomotion`
- **embodiment***: `implement real-walking locomotion (tracking actual walking in a room-scale setting) instead of the current walking-in-place locomotion`

*\* Embodiment is often correlated to presence. These may not be answers, at your discretion (week08).*

The other answers, for reference:
- **flow**: implement mechanics to structure the commuting experience akin to completing progressively challenging levels in a game setting
- **flow**: implement GUI elements to present clear goals for the user to attain at every point of the commuting experience

*Notes about Presence:*

Presence has a physical component and social component.

Physical: "the feeling of being there"

Social: "being around virtual beings". (People that are extroverted or open experience increased presence around virtual beings.)

IPQ questionnaire that tests for presence checks for 3 characteristics: spatial, involvement, and realness.

## Question 6

**You are developing a VR cooking simulator that allows players to engage in culinary tasks like chopping vegetables, stirring soups, and plating dishes.**

**Which of the implementation element(s) below would enhance the affordances for interactions within the simulator?**

- Dynamic haptic feedback that simulates the sensations of cutting through different textures or the resistance of stirring a thick stew
- Integrating realistic background sounds to simulate a bustling kitchen environment
- Virtual utensils and ingredients designed with features like indentations or handles that indicate how they should be held or used
- Having increasing difficulty levels in the cooking tasks
- Precise hand-tracking with finger-tracker gloves for detailed manipulation of kitchen tools and ingredients
- Implementing advanced AI for non-player character interactions within the kitchen
- Subtle visual cues on interactive elements, such as a shimmer on ingredients ready to be chopped or a glow on pots that need attention

**Answer**

Note keyword in the question is ***interactions***.

- `Dynamic haptic feedback that simulates the sensations of cutting through different textures or the resistance of stirring a thick stew`
- `Virtual utensils and ingredients designed with features like indentations or handles that indicate how they should be held or used`
- `Subtle visual cues on interactive elements, such as a shimmer on ingredients ready to be chopped or a glow on pots that need attention`

The other answers, for reference:

- **presence**: Integrating realistic background sounds to simulate a bustling kitchen environment
- **flow**: Having increasing difficulty levels in the cooking tasks
- **probably flow***: Precise hand-tracking with finger-tracker gloves for detailed manipulation of kitchen tools and ingredients
- **presence**: implementing advanced AI for non-player character interactions within the kitchen

\* This could be an answer, however in week10-case-studies, for VR Museums, it is not an answer (the question is different though).

## Question 7

**What sort of affordance will most likely occur when you strap on HTC VIVE trackers only on the hands for an experienced VR user in a VR commuting simulator application with walking as the main interaction?**

- The user will perform a natural walking action with the whole body to navigate in the virtual environment
- The user will consciously use only the hands in his/her own way to navigate in the virtual environment
- The user will consciously use only the feet in his/her own way to navigate in the virtual environment
- The user will consciously use both the hands and feet in his/her own way to navigate in the virtual environment
- The user will reach out for a VIVE controller to use the thumbstick to navigate in the virtual environment

**(Unsure) Answer**

- `The user will consciously use only the hands in his/her own way to navigate in the virtual environment`

*Answer derived from process of elimination: If you put on trackers on the hands of (any) user, they will assume they will need it to move. It's like setting expectations.*

- The user will perform a natural walking action with the whole body to navigate in the virtual environment **(won't happen since hands have trackers. is experienced user but still)**
- The user will consciously use only the feet in his/her own way to navigate in the virtual environment **(will subconsciously use feet. no trackers on feet)**
- The user will consciously use both the hands and feet in his/her own way to navigate in the virtual environment **(see above)**
- The user will reach out for a VIVE controller to use the thumbstick to navigate in the virtual environment **(inconclusive)**

## Question 8

**When designing for immersion in the next version of our VR commuting simulator, I want to improve the experience of flow.**

**What data collection method(s) would be suitable for evaluating whether this goal has been achieved after the simulator has been updated with implementation changes translated from the aforementioned goal?**

- Let users fill in the IPQ
- Perform semi-structured interviews with users
- Let users fill in the FSS
- Create telemetry tracking mechanisms to observe users
- Let users fill in the VRSQ

**Answer**
- `Perform semi-structured interviews with users`
- `Let users fill in the FSS`
- `Create telemetry tracking mechanisms to observe users`

(week10-case-studies)

## Question 9

**In designing an HMD, you want to make the generated virtual image look taller vertically.**

**What dimension(s) can you change to achieve this?**

- Focal length of the lenses
- Distance between the lenses and the physical display
- Height of the physical display
- IPD between the lenses
- Width of the physical display
- Eye relief

**(Unsure) Answer**

- `Focal length of the lenses`
- `Distance between the lenses and the physical display`
- `Height of the physical display`
- `Eye relief`

## Question 10

**What does changing the focal length of the lenses in an HMD affect?**

- Horizontal FOV
- IPD between the lenses
- Distance between the lenses and the physical display
- Vertical FOV
- Distance between the lenses and the physical display
- The size of the virtual image

**Answer**

- `Horizontal FOV`
- `Vertical FOV`
- `The size of the virtual image`

Other answers:

- `Depth of virtual image generated` (week05, week06)

## Question 11

**What does changing the IPD of the lenses in an HMD affect?**

- Distance between the lenses and the physical display
- Distance between the lenses and the user's eyes
- Horizontal FOV
- Vertical FOV
- Focal length of the lenses
- How the virtual images are rendered for each eye

**Answer**

- `Horizontal FOV`
- `How the virtual images are rendered for each eye`

## Question 12

**In designing an HMD, you want to expand the horizontal FOV.**

**What dimension(s) can you change to achieve this?**

- Width of the physical display
- Eye relief
- IPD between the lenses
- Distance between the lenses and the physical display
- Height of the physical display
- Focal length of the lenses

**(Unsure) Answer**

- `Width of the physical display`
- `Eye relief`
- `IPD between the lenses`
- `Distance between the lenses and the physical display`
- `Focal length of the lenses`

## Question 13

**What is the API class in Babylon.js that will allow you to easily use 360 videos as the skybox?**

**Write the exact name of the class without additional spacing, and don't prepend with the "BABYLON." namespace.**

**Answer**

`VideoDome`

## Question 14

**This code to load a custom 3D model has a runtime error. How do you rectify this?**

**Hint: it is a runtime error with nothing to do with syntax, and all class and function names are correct.**

**(Note: the line numbers in the answers refer to those on the left gutter of the code snippet.)**

- Remove lines 11-15
- Replace line 5 with line 17
- Move line 10 to newline below line 5
- Remove line 2
- Move line 17 to newline below line 10
- Move line 17 to newline below line 5
- Move line 10 to newline below line 17

**Answer**

N/A. No images, inconclusive (no slido that matches this either).

## Question 15

**When running your Babylon.js project, you encounter the error below:**

`logger.ts:168  BJS - [16:81:68]: Unable to find a plugin to load .glb`

**Which file should you amend to fix this error assuming all relevant packages are installed?**

- package-lock.json
- tsconfig.json
- app.ts that contains your main app logic
- package.json

**Answer**

- `app.ts that contains your main app logic`

The reason is that you forgot to side effect import `import "babylonjs-loaders";`

Also by process of elimination:

package-lock.json, package.json loads the packages, and ALL relevant packages have already been loaded. tsconfig's job is to tell the compiler how to compile the typescript (nothing to do with loaders).

## Question 16

**The code above allows the sphere to be dragged around...**

- a plane parallel to the direction the player is viewing
- a plane parallel to the ground
- a plane perpendicular to the direction the player is viewing
- in any direction

**Answer:**

Incomplete question. Figure out the answers based on the following code snippets:

```typescript
const pointerDragBehavior = new PointerDragBehavior({
  dragPlaneNormal: Vector3.Up(), // 0, +1, 0
});
sphere.addBehavior(pointerDragBehavior);

// answer: moves in xz plane
```

```typescript
const pointerDragBehavior = new PointerDragBehavior({
  dragPlaneNormal: Vector3.Backward(), // 0, 0, -1
});
sphere.addBehavior(pointerDragBehavior);

// answer moves in xy plane
```

```typescript
const pointerDragBehavior = new PointerDragBehavior({
  dragPlaneNormal: Vector3.Right() // +1, 0, 0
});
sphere.addBehavior(pointerDragBehavior);

// answer moves in yz plane
```

## Question 17

**The following code allows the sphere to be dragged around with the pointer.**

**What is the best way to get the current position of the sphere, when it is being dragged, to debug in the console?**

- add an Observable to the sphere to get the position
- add an Observer to the sphere to get the position
- get the position of the sphere every second
- add an Observer to the onDragObservable of the pointerDragBehavior to get the position

**Answer**

- `add an Observer to the onDragObservable of the pointerDragBehavior to get the position`

```typescript
const pointerDragBehavior = new PointerDragBehavior({
  dragPlaneNormal: Vector3.Right()
});
sphere.addBehavior(pointerDragBehavior);
// fires at the end of each drag
pointerDragBehavior.onDragEndObservable.add(/* add observable*/);
```

## Question 18

In total, how many observers did we add here?
`2`

In total, how many observables did we operate on?
`2`

In total, how many observables did we manually create?
`1`

**This appears similiar to week09 slido answers. Reference that instead.**

## Question 19

**In the VR game Land's End, what interaction mechanics were implemented?**

You can view the YouTube video below to get an idea of the gameplay.
[Land's End YouTube Gameplay by VR Adventure](https://youtu.be/9NYMid2TU20)

- viewpoint control
- body (excluding hands) gestures
- hand gestures

**Answer**

- `viewpoint control`

## Question 20

**You are tasked to build a VR game where users can roam freely in a vast open world. The distances between points of interest in the game is rather large, around 10-20 kilometres. Cybersickness is the most important concern and augmentation of movement speeds is known to induce more symptoms.**

- teleportation
- joy-stick based
- walking-in-place (WIP) with KatVR 360 slidemill
- walking-in-place (WIP) with HTC Vive HMD and trackers
- tracking real movement in physical space

**Answer**

Question is incomplete. I assume the case **What locomotion technique is best suited for this use case?**

- `teleportation` (i'm not sure)

Refer to week08 slido answers, there's a list of different questions there for locomotion.