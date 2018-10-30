# font-visual-size-matching

A WIP proposal for [FontBakery](https://github.com/googlefonts/fontbakery).

NOTE: the sizing in my javascript isn't acting predictably yet. 😑 I need to double-check to find out why. Until I know it's working as expected, I'm putting this proposal on hold.

Sizing comparison tool coded at [https://codesandbox.io/s/q7449w2m9w](https://codesandbox.io/s/q7449w2m9w).

## Observed behavior

Fonts have very little standardization for their overall sizing. They generally fit within their UPM grid, but different fonts treat this differently. Even if two fonts are both 1000UPM (as checked by Google Fonts check `116`), they may be scaled within that 1000 units in completely different ways. This results in three primary problems:

1. When using fonts to design and/or code a web layout, a designer wants to be able to try different options quickly and easily. However, the relative sizes of fonts can be very different, even for fonts that are stylistically similar. This means that in order to try different fonts, the CSS must be adjusted, and it can be difficult to isolate the two variables efficiently.
1. If a font has different sizing than its fallback fonts (e.g. `font-family: Noto Serif, Times, serif`) there will be a jump in size and possible reflow when the site loads for new visitors.
1. Accessibility guidelines WCAG 2.0 provide specifications for minimum color contrast on "text" and "large text." Unfortunately, there isn't much definition of what exact point sizes these are. Still, the fact that type sizes vary makes it more difficult for designers and developers to know that they are meeting the correct criteria for accessibility if they are using different fonts.

## Expected behavior

Ideally, fonts would have only as much size difference as was needed to express their design ideas (e.g. unique relative vertical metrics, differences in width, contrast, shapes, etc) but fall within a standard which would make fonts more useful on the web, by solving the problems described above. 

## Proposal: a QA check for the relative sizing of new fonts, flagging outliers

A FontBakery QA could alert designers if the relative size of a given font is an outlier against common fonts. This might be something that designers could ignore if they were making creative display fonts, but something that could be a useful tool for those designing fonts intended for use in text and UI.

## Diagrams of the issue

When different fonts are used for the same content, it is easy to see the size differences between them. Look, for example, at Noto Serif next to Tinos in the example below:

![image](https://user-images.githubusercontent.com/7355414/47742017-173b6e80-dc52-11e8-9f1d-805d638c7f9a.png)

You can also see a sort of "bar chart" of comparitive line lengths, by setting type at a small size. This isn't necessarily a huge problem, but you might expect "normal width" text fonts to have a bit more similarity.

![image](https://user-images.githubusercontent.com/7355414/47742074-3c2fe180-dc52-11e8-9bf1-32d21e77a96c.png)

A common solution for mixing fonts is to match the x-height. Material Design provides a ["Theme Editor" Sketch Plugin](https://material.io/tools/theme-editor/) which, among other things, helps designers to try different fonts in place of the standard Roboto. When a new font is selected, it is swapped in place of Roboto, with its font size rescaled to match x-heights.

![image](https://user-images.githubusercontent.com/7355414/47741081-c4f94e00-dc4f-11e8-80c1-a11ffa297553.png)

Using this tool, I've compared several popular fonts, to show the effect of matching fonts by x-height. The font sizes generated are one way to see the relative sizing compared to a "normal" font like Roboto. It works fairly well in the majority of cases, but sometimes, fonts still end up clearly visually bigger or smaller. In particular, a font with a relatively low x-Height (such as Adobe Caslon Pro or EB Garamond) will look massive next to common fallbacks like Times or Tinos.

![image](https://user-images.githubusercontent.com/7355414/47741121-de9a9580-dc4f-11e8-8a0a-5c2295ca419b.png)

![image](https://user-images.githubusercontent.com/7355414/47741126-e1958600-dc4f-11e8-9784-16e9156dcc55.png)

In short, if the x-height of a font is relatively low, it will look large when its x-height is matched with other fonts. If the x-height of a font is relatively large, it will look small when its x-height is matched with other fonts. So, x-height isn't necessarily the most accurate metric to match different fonts by.

## A potential standard

As shown when x-height is matched, it is not necessarily a perfect solution due to other shifting dimensions like cap height, ascender height, and descender height, which also effect perceived size.

Potentially, something a little more flexible might be the average of x-height, cap height, and ascender height (and maybe also decender height). This value could be considered a font's "visual size" (I'm making this term up right now). I'm not 100% sure of this metric as a perfect one, because x-height letters do tend to make up the bulk of words in most text. Still, a quick test shows (in my opinion) that it brings the apparent sizing of two fonts closer than simply matching the x-Height:

![image](https://user-images.githubusercontent.com/7355414/47756272-cb032500-dc77-11e8-9545-de1c988a002d.png)

![image](https://user-images.githubusercontent.com/7355414/47756244-b9218200-dc77-11e8-8d3a-13e01b4f93e8.png)


If we _really_ wanted to be clever about visual sizing, we could make a study of relative usage of letters in Latin script languages on popular websites, then base the visual size calculation off of the metrics, with frequency in the calculation. If anyone wants to experiment with the fonts or the calculations, here's a Code Sandbox:

https://codesandbox.io/s/0qv6pl7qkw

You can check different Google Fonts by editing the list in 
```
const gFontFamilies = ["Noto Serif", "EB Garamond"];
```

...or edit the variables just below that to pull in system / local fonts.

## Suggested QA message for Font Bakery

If a font falls outside the bell curve of visual sizes for common fonts (say, OS fallback fonts or most popular fonts on Google Fonts), it could be flagged on FontBakery. For example, we might have a flag something like:

⚠️ **WARN:** Font's visual size is >5% larger than common system fonts.
- The average of this font's visual size (the average of the x-height, cap height, and ascender height) is more than 5% larger than common system fonts. This may make it harder to use in web layouts and more disruptive in font loading on web pages.

The tolerance we give (e.g. 5%) could be as loose or as specific as we want, but we would probably want _some_ flexibility to allow for different design styles.

We _could_ go so far as to automatically, programmatically scale sizes for fonts put into the library, but that would risk damaging outlines. Especially for fonts with fine details, this could break things. However, I believe there would be user benefit to having a relative size comparison be part of our QA process.

---

My thoughts around this are still forming, but hopefully this gives a starting point for a discussion, if others think this might be a useful QA check. If so, let me know, and I can try to write the FB test! But first, if you have thoughts around how we might define similar visual sizing, I want to zero-in on something flexible, fairly universal, and easy enough to explain.

