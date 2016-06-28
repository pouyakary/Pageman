
# Pageman
At Kary Foundation we use a very rich stack to build web. We use higher languages like TypeScript and Less. And templating via Jekyll. However when it comes to writing content it gets hard. We use Markdown for normal content and Legend for side commenting.

When it comes to having markdown, html and legend fixed together it really gets hard. Also HTML comments are horrible. As the foundation with most prestige on code management via commenting we need to have a C-family style of commenting so that we can bring Kary Comments into our document files.

In order to have all the said factors we developed Pageman. A base that lets you mixup all these languages with kary comments. This is a file made possible with pageman's preprocess: 

```
---
layout: something
title: something else
---

//
// Body!
//

<div>
    Some awesome HTML here
</div>

---md
Some ***Cool*** Markdown here...
---end

<div>
    Some more cool HTML
</div>

---legend
And some ^very fun^ legend files.
---end
```

## Installing
Simply install the pageman with npm
```
% npm install -g pageman
```

## Usage
If you specify any file it will build just the said files
```
% pageman yourfile.kfml something.kfml
```
However you can also build the the whole directory by just typing
```
% pageman
```
And you can run a watching server with
```
% pageman -w
```