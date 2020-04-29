# Contributing to FoodLeh?

Hello everyone! Thank you all for taking the time and effort to contribute! 🥘🍜🥗We are built with ReactJS and hosted on Google Firebase with Firestore database.

### About us
We are a free, crowdsourced hawker platform in Singapore relying on Singaporeans to share information about our local F&B places. We love hawker food and hope you do too! 

### How to contribute
We have organised a list of features and fixes in the pipeline. If you are working on something, leave a comment on the related issue so nobody does duplicate work! (we will tag the issue)

## Important tasks

###### 1. Changing Edit, Create access, adding Delete, Report (Issue #8)
Free edit and create access is probably not as good an idea as we thought. The quick fix is to change it to trigger an email to us at foodleh@outlook.com with the fields to update and new info in each field. Possible solutions include emailjs, which has a free tier (don't anticipate needing >200 emails per month). We'll update manually in the database. 

Delete and Report would involve the same functionality of triggering an email to us, hence tagged here.

Long-term fix probably involves tracking a "shadow version" of proposed changes in our DB under each entry and updating by subbing in the shadow version.

###### 2. Performance (Issue #22, #23)
- Resize images that are already in our Firebase Cloud Storage because some of them are huge: https://stackoverflow.com/questions/60329738/how-can-i-resize-all-existing-images-in-firebase-storage
- Use webp to replace jpeg/jpg/png image types for faster loading
- Implement infinite scrolling to not load the entire page at once - react-window has been suggested to us.

## General tasks

###### 1. Improve location search with postal code filtering (in progress) (Issue #9)

Run migration script from LoneRifle (for us to do on backend) to update database. See Issue #9 for detailed explanation courtesy of LoneRifle :)

###### 2. Language translation for hawkers (Issue #10)

Use cookies eg js-cookies etc to have a language toggle button, add translation asset files. We're planning to start with Chinese translation and ask around for demand for other languages.

## Organisation tasks

###### 1. Dependency auto-updater (Issue #21)

###### 2. Adopt and enforce DCO (Issue #20)

###### 3. Code refactoring (Issue #15)

- Combine SearchAll and Nearby components into a common component
- Set up assets folder for icons
- Abstract cuisines values into a common file
- Use CSS modules instead of inline to make things more modular 





