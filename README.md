
# Pageman
At Kary Foundation we use a very rich stack to build web. We use languages higher languages like TypeScript and Less. And templating via Jekyll. However when it comes to writing content it gets hard. We use Legend for side commenting and we really loved to have C family like comments so that we could have had Kary Comments to manage our files.

Pageman lets you mixup all these languages with kary comments. This is a file made possible with pageman technology:

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

## Getting Started.
Simply install the pageman with npm
```
% npm install -g pageman
```

now use
```
%  pageman yourFile.pm
```