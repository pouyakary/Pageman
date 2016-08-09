
# Pageman

At Kary Foundation we use a very rich stack to build web. We use higher languages like TypeScript and Less. And templating via Jekyll. However when it comes to writing content it gets hard. We use Markdown for normal content and Legend for side commenting.

When it comes to having markdown, html and legend fixed together it really gets hard. Also HTML comments are horrible. As the foundation with most prestige on code management via commenting we need to have a C-family style of commenting so that we can bring Kary Comments into our document files.

In order to have all the said factors we developed Pageman. A base that lets you mixup all these languages with kary comments. This is a file made possible with pageman's preprocess: 

![](https://cloud.githubusercontent.com/assets/2157285/17080746/7c164e86-5150-11e6-8adf-1dae193d48f6.png)

## Installing
Simply install the pageman with npm
```
% npm install -g pageman
```

## Editor support
Kary Foundation provides a [Pageman Language Support Extension](https://marketplace.visualstudio.com/items?itemName=karyfoundation.pageman) for Visual Studio Code that you can use to highlight Pageman code.

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

## Configuration
If you're using legend commentings in your website please make sure you have [these CSS](https://gist.github.com/pmkary/c5c13553ea36ba06df86acc4cc6217cf) classes defined.

<br />
<a href="http://www.karyfoundation.org/">
    <img src="http://www.karyfoundation.org/foundation/logo/github-full-horse.png" width="250"/>
</a>