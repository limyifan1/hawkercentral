# Contributing to FoodLeh?

Hello everyone! Thank you all for taking the time and effort to contribute! 🥘🍜🥗We are built with ReactJS and hosted on Google Firebase with Firestore database.

### About us
We are a free, crowdsourced hawker platform in Singapore relying on Singaporeans to share information about our local F&B places. We love hawker food and hope you do too! 

### How to contribute
We have organised a list of features and fixes in the pipeline. If you are working on something, leave a comment on the related issue so nobody does duplicate work! (we will tag the issue)

[DCO](https://developercertificate.org/): Please signoff in every commit using git commit --signoff (or git commit -s). To acknowledge the Developer Certificate of Origin (DCO), sign your commits by adding Signed-off-by: John Doe john.doe@email.com to the last line of each Git commit message. The e-mail address used to sign must match the e-mail address of the Git author. 

## Important tasks

#### 1. Changing Edit, Create access, adding Delete, Report ([#8][i8])
Free edit and create access is probably not as good an idea as we thought. The quick fix is to change it to trigger an email to us at foodleh@outlook.com with the fields to update and new info in each field. Possible solutions include emailjs, which has a free tier (don't anticipate needing >200 emails per month). We'll update manually in the database. 

Delete and Report would involve the same functionality of triggering an email to us, hence tagged here.

Long-term fix probably involves tracking a "shadow version" of proposed changes in our DB under each entry and updating by subbing in the shadow version.

#### 2. Performance ([#22][i22]) ([#23][i23])
- Resize images that are already in our Firebase Cloud Storage because some of them are huge: https://stackoverflow.com/questions/60329738/how-can-i-resize-all-existing-images-in-firebase-storage
- Use webp to replace jpeg/jpg/png image types for faster loading
- Implement infinite scrolling to not load the entire page at once - react-window has been suggested to us.

## General tasks

#### 1. Improve location search with postal code filtering (in progress) ([#9][i9])

Run migration script from LoneRifle (for us to do on backend) to update database. See Issue #9 for detailed explanation courtesy of LoneRifle :)

#### 2. Language translation for hawkers ([#10][i10])

Use cookies eg js-cookies etc to have a language toggle button, add translation asset files. We're planning to start with Chinese translation and ask around for demand for other languages.

#### 3. Users return to same scrolling point when they click back from a listing

In the listings page, when users click into a listing, then go back to the listings page again, they are reloaded and must start from the top of the page. We want to let them go back to the point where the clicked the listing, so they don't need to scroll down all the way again. No issue made yet.

#### 4. Let users open individual listings in a new window

Current listings won't let you open in a new window, weird for users who usually want to see many at once. No issue made yet.

## Organisation tasks

#### 1. Code refactoring ([#15][i15])

- Set up assets folder for icons
- Abstract cuisines values into a common file
- Use CSS modules instead of inline to make things more modular 


[i8]: https://github.com/limyifan1/hawkercentral/issues/8
[i9]: https://github.com/limyifan1/hawkercentral/issues/9
[i10]: https://github.com/limyifan1/hawkercentral/issues/10
[i15]: https://github.com/limyifan1/hawkercentral/issues/15
[i22]: https://github.com/limyifan1/hawkercentral/issues/22
[i23]: https://github.com/limyifan1/hawkercentral/issues/23


