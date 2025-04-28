[Back to README](README.md)

# How to - make PR

When pushing to a branch, you will be prompted to make a PR. 

<img width="1369" alt="Pasted image 20250415080557" src="https://github.com/user-attachments/assets/298a02d7-539d-46e3-b7a2-a8ee4583dbd6" />

Here is a checklist of things to check before you publish the PR:
- [ ] Have I removed all unintentional commented out code?
- [ ] Have I marked all intentional commented out code with a TODO, and explained what it is and what should be done?
- [ ] Have I removed all unintentional console.log?
- [ ] Does the code have any conflicts with main?
- [ ] Does the code build? (can review PR when it doesn't, and github will show that it doesn't build, but code should not be merged until it builds)

A PR consists of a PR name, a PR description and some additional information in the sidebar to the right

## PR name
Usually same, or very similar, to the issue name. I generally prefer this format: `Prefix: Issue name`, where `Prefix` refers to `Bug`, `Feature` or `Task`. 

## PR description
Describe what the PR aims to fix. If the code performs anything visual, add a screenshot of what it does. You can also add your thoughts when making it, or any documentation you have used to make decisions, so reviewers understand why decisions were made.

## Sidebar info

<img width="316" alt="Pasted image 20250415093513" src="https://github.com/user-attachments/assets/ee9e786a-bf26-4d59-b602-73b312c6acf2" />

- Set some reviewers (I never tried Copilot, but doesn't seem bad). 
- Set yourself as assignee.
- Add Label, and Projects and Milestone if relevant.
